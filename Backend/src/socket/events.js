export const EVENTS = {
  CLIENT: {
    JOIN: 'join-community',
    LEAVE: 'leave-community',
    SEND_MESSAGE: 'send-message',
    TYPING_START: 'typing-start',
    TYPING_STOP: 'typing-stop',
    MARK_READ: 'mark-read'
  },
  SERVER: {
    ROOM_JOINED: 'room-joined',
    ROOM_LEFT: 'room-left',
    NEW_MESSAGE: 'new-message',
    MESSAGE_RECEIVED: 'message-received',
    USER_TYPING: 'user-typing',
    USER_STOPPED_TYPING: 'user-stopped-typing',
    ONLINE_MEMBERS: 'online-members',
    MESSAGE_ERROR: 'message-error',
    RECONNECT_SYNC: 'reconnect-sync'
  }
};
