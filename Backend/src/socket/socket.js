import { Server } from 'socket.io';
import { socketAuth } from './authMiddleware.js';
import { EVENTS } from './events.js';
import { createMessage, getMessages, markRead } from '../services/message.service.js';
import { isMemberOfCommunity, addOnlineMember, removeOnlineMember } from '../services/room.service.js';

// in-memory rate limiter and presence maps (consider external store in production)
const RATE_LIMIT = { tokens: 5, refillMs: 1000 }; // 5 messages/sec

export const initSocket = (server, clientOrigin) => {
  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    },
    pingTimeout: 30000,
    allowEIO3: false,
  });

  // authenticate socket connections using handshake.auth.token
  io.use(async (socket, next) => socketAuth(socket, next));

  // attach per-socket rate limiter
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id, 'user', socket.user?._id);

    socket.rate = { tokens: RATE_LIMIT.tokens, last: Date.now() };

    socket.on('disconnect', async (reason) => {
      try {
        // attempt to remove user from all rooms' online lists; we can track rooms on socket.rooms
        for (const room of Array.from(socket.rooms)) {
          if (room.startsWith('community_')) {
            const communityId = room.replace('community_', '');
            await removeOnlineMember(communityId, socket.user._id);
            io.to(room).emit(EVENTS.SERVER.ONLINE_MEMBERS, { communityId });
          }
        }
      } catch (err) {
        console.warn('disconnect cleanup failed', err.message || err);
      }
      console.log('socket disconnected', socket.id, reason);
    });

    const consumeToken = () => {
      const now = Date.now();
      const elapsed = now - socket.rate.last;
      const refill = Math.floor(elapsed / RATE_LIMIT.refillMs) * RATE_LIMIT.tokens;
      if (refill > 0) {
        socket.rate.tokens = Math.min(RATE_LIMIT.tokens, socket.rate.tokens + refill);
        socket.rate.last = now;
      }
      if (socket.rate.tokens <= 0) return false;
      socket.rate.tokens -= 1;
      return true;
    };

    // join community
    socket.on(EVENTS.CLIENT.JOIN, async ({ communityId }, ack) => {
      try {
        if (!communityId) return ack?.({ ok: false, error: 'communityId required' });
        const isMember = await isMemberOfCommunity(communityId, socket.user._id);
        if (!isMember) return ack?.({ ok: false, error: 'must join community first' });

        const room = `community_${communityId}`;
        socket.join(room);
        await addOnlineMember(communityId, socket.user);
        const messages = await getMessages({ communityId, limit: 40 });
        io.to(room).emit(EVENTS.SERVER.ONLINE_MEMBERS, { communityId });
        ack?.({ ok: true, communityId, messages });
      } catch (err) {
        console.error('join error', err.message || err);
        ack?.({ ok: false, error: 'unable to join' });
      }
    });

    // leave
    socket.on(EVENTS.CLIENT.LEAVE, async ({ communityId }, ack) => {
      try {
        const room = `community_${communityId}`;
        socket.leave(room);
        await removeOnlineMember(communityId, socket.user._id);
        io.to(room).emit(EVENTS.SERVER.ONLINE_MEMBERS, { communityId });
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false, error: 'unable to leave' });
      }
    });

    // typing events
    socket.on(EVENTS.CLIENT.TYPING_START, ({ communityId }) => {
      const room = `community_${communityId}`;
      io.to(room).emit(EVENTS.SERVER.USER_TYPING, { user: socket.user, communityId });
    });

    socket.on(EVENTS.CLIENT.TYPING_STOP, ({ communityId }) => {
      const room = `community_${communityId}`;
      io.to(room).emit(EVENTS.SERVER.USER_STOPPED_TYPING, { user: socket.user, communityId });
    });

    // send message with acknowledgement and rate limiting
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, async (payload, ack) => {
      try {
        if (!consumeToken()) return ack?.({ ok: false, error: 'rate_limited' });
        const { communityId, message } = payload || {};
        if (!communityId || !message) return ack?.({ ok: false, error: 'invalid_payload' });
        const isMember = await isMemberOfCommunity(communityId, socket.user._id);
        if (!isMember) return ack?.({ ok: false, error: 'not_member' });

        // create and persist message
        const saved = await createMessage({ communityId, userId: socket.user._id, username: socket.user.name, avatar: socket.user.avatar, message });

        const outgoing = {
          _id: saved._id,
          community: saved.community,
          sender: saved.sender,
          username: saved.username,
          avatar: saved.avatar,
          message: saved.message,
          createdAt: saved.createdAt,
          readBy: saved.readBy || [],
          deliveredTo: saved.deliveredTo || []
        };

        const room = `community_${communityId}`;
        io.to(room).emit(EVENTS.SERVER.NEW_MESSAGE, outgoing);
        ack?.({ ok: true, message: outgoing });
      } catch (err) {
        console.error('send message failed', err.message || err);
        ack?.({ ok: false, error: 'unable_to_send' });
      }
    });

    // mark read
    socket.on(EVENTS.CLIENT.MARK_READ, async ({ communityId }, ack) => {
      try {
        await markRead({ communityId, userId: socket.user._id });
        ack?.({ ok: true });
      } catch (err) {
        ack?.({ ok: false });
      }
    });

  });

  return io;
};
