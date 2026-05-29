import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:8000';
const randomSuffix = Math.floor(Math.random() * 1000000);
const testUser = {
  name: `TestUser${randomSuffix}`,
  email: `testuser${randomSuffix}@example.com`,
  password: 'Password123!'
};

const log = (...args) => console.log('[TEST]', ...args);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async () => {
  try {
    const res = await axios.post(`${API_BASE}/api/auth/signup`, testUser, { withCredentials: true });
    log('Signup succeeded');
    return res.data;
  } catch (error) {
    if (error.response) {
      log('Signup failed:', error.response.status, error.response.data);
    } else {
      log('Signup failed:', error.message);
    }
    throw error;
  }
};

const loginUser = async () => {
  try {
    const res = await axios.post(`${API_BASE}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    }, { withCredentials: true });
    log('Login succeeded');
    return res.data;
  } catch (error) {
    if (error.response) {
      log('Login failed:', error.response.status, error.response.data);
    } else {
      log('Login failed:', error.message);
    }
    throw error;
  }
};

const createCommunity = async (user) => {
  const title = `Test Community ${randomSuffix}`;
  const body = {
    title,
    description: 'A temporary community created for integration testing.',
    tags: ['PsychologicalThriller'],
    communityBanner: '',
    userId: user._id,
    username: user.name,
    createdAt: new Date().toISOString(),
  };
  try {
    const res = await axios.post(`${API_BASE}/api/create-community`, body, { withCredentials: true });
    log('Created community:', res.data.community.slug || res.data.community._id);
    return res.data.community;
  } catch (error) {
    if (error.response) {
      log('Create community failed:', error.response.status, error.response.data);
    } else {
      log('Create community failed:', error.message);
    }
    throw error;
  }
};

const joinCommunity = async (token, communityId) => {
  const res = await axios.post(`${API_BASE}/api/join-community`, { communityId }, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  log('Join community response:', res.data.message || 'success');
  return res.data;
};

const getCommunityMessages = async (token, communityId) => {
  const res = await axios.get(`${API_BASE}/api/community-messages/${communityId}`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  log('Fetched community messages count:', Array.isArray(res.data.messages) ? res.data.messages.length : 0);
  return res.data.messages;
};

const runSocketTest = async (token, communityId) => {
  return new Promise((resolve, reject) => {
    const socket = io(API_BASE, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });

    let received = false;

    socket.on('connect', () => {
      log('Socket connected:', socket.id);
      socket.emit('join-community', { communityId }, (joinRes) => {
        log('Socket join response:', joinRes);
        if (!joinRes?.success) {
          return reject(new Error(`Socket join failed: ${joinRes?.message || 'unknown'}`));
        }
        socket.emit('send-message', { communityId, message: 'Hello from integration test' }, (sendRes) => {
          log('Socket send response:', sendRes);
          if (!sendRes?.success) {
            return reject(new Error(`Socket send failed: ${sendRes?.message || 'unknown'}`));
          }
        });
      });
    });

    socket.on('receive-message', (message) => {
      log('Socket received message:', message.message || message);
      if (message.message === 'Hello from integration test') {
        received = true;
        socket.disconnect();
        resolve(message);
      }
    });

    socket.on('connect_error', (err) => {
      reject(new Error(`Socket connect error: ${err.message || err}`));
    });

    socket.on('error', (err) => {
      reject(new Error(`Socket error: ${err}`));
    });

    setTimeout(() => {
      if (!received) {
        socket.disconnect();
        reject(new Error('Socket test timed out without receiving the message'));
      }
    }, 10000);
  });
};

const main = async () => {
  try {
    log('Starting full chat flow test');
    let authData;
    try {
      authData = await createUser();
    } catch (err) {
      log('Signup failed, trying login with same credentials');
      authData = await loginUser();
    }

    const token = authData.accessToken;
    const user = authData.user;
    if (!token || !user) {
      throw new Error('No token or user returned from auth');
    }

    const community = await createCommunity(user);

    await joinCommunity(token, community._id);

    const initialMessages = await getCommunityMessages(token, community._id);
    if (!Array.isArray(initialMessages)) {
      throw new Error('Community messages response invalid');
    }

    const receivedMessage = await runSocketTest(token, community._id);
    log('Socket flow succeeded, received persisted message id:', receivedMessage._id || '(none)');

    const finalMessages = await getCommunityMessages(token, community._id);
    const found = finalMessages.some((msg) => msg.message === 'Hello from integration test');
    log('Final messages fetch contains test message:', found);

    if (!found) {
      throw new Error('Message created by socket was not found in community messages after send');
    }

    log('Full chat flow validation completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[TEST] Full chat flow validation failed:', error.response?.data || error.message || error);
    process.exit(1);
  }
};

main();
