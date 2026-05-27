import axios from 'axios';
import { io } from 'socket.io-client';
import mongoose from 'mongoose';
import Community from '../src/model/Community.models.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API = 'http://localhost:8000';

const randomEmail = `test+${Date.now()}@example.com`;

async function main(){
  try{
    console.log('Signing up test user...');
    const signupRes = await axios.post(`${API}/api/auth/signup`,{
      name: `SocketT${Date.now()%10000}`,
      email: randomEmail,
      password: 'Password123'
    });
    const { user, accessToken } = signupRes.data;
    console.log('Created user', user._id);

    // get communities
    const comms = await axios.get(`${API}/api/get-communities`);
    let community = comms.data?.communities?.[0];
    if(!community){
      console.log('No community found, creating one...');
      const create = await axios.post(`${API}/api/create-community`,{
        title: `Test Community ${Date.now()}`,
        description: 'Auto-created by socket test',
        tags: ['test'],
        userId: user._id,
        username: user.name
      });
      community = create.data.community;
      console.log('Created community', community._id);
    } else {
      console.log('Using existing community', community._id);
    }

    // Ensure membership by directly updating DB (avoids validation save issues in REST join)
    console.log('Ensuring membership via direct DB update...');
    let mongoUri = process.env.MONGO_URL;
    if(!mongoUri){
      // fallback: read .env directly
      const fs = await import('fs');
      const envText = fs.readFileSync(new URL('../.env', import.meta.url));
      const match = envText.toString().match(/^MONGO_URL\s*=\s*(.+)$/m);
      if(match){
        mongoUri = match[1].trim();
      }
    }
    if(!mongoUri) throw new Error('MONGO_URL not available');
    await mongoose.connect(mongoUri);
    await Community.findByIdAndUpdate(community._id, { $addToSet: { members: user._id } });
    console.log('Membership ensured in DB');

    // connect socket
    console.log('Connecting socket with access token...');
    const socket = io(API, { auth: { token: accessToken }, transports: ['websocket'] });

    socket.on('connect', ()=>{
      console.log('Socket connected', socket.id);
    });

    socket.on('connect_error', (err)=>{
      console.error('Connect error', err.message);
    });

    socket.on('new-message', (msg)=>{
      console.log('Received new-message event:', msg);
    });

    socket.on('online-members', (payload)=>{
      console.log('Online members update', payload);
    });

    // wait for connection then join
    socket.on('connect', async ()=>{
      socket.emit('join-community',{ communityId: community._id }, (ack)=>{
        console.log('Join ack', ack?.ok ? 'OK' : ack);
        if(ack?.ok){
          console.log('Messages returned:', (ack.messages || []).length);
          // send a message
          socket.emit('send-message',{ communityId: community._id, message: 'Hello from socket test' }, (res)=>{
            console.log('Send message ack', res);
            setTimeout(()=>{
              console.log('Test complete, disconnecting');
              socket.disconnect();
              mongoose.disconnect();
              process.exit(0);
            },1000);
          });
        } else {
          console.error('Failed to join via socket', ack);
          socket.disconnect();
          mongoose.disconnect();
          process.exit(1);
        }
      });
    });

    // safety timeout
    setTimeout(()=>{
      console.error('Test timed out');
      socket.disconnect();
      mongoose.disconnect();
      process.exit(2);
    }, 30000);

  } catch(err){
    console.error('Test failed', err.response?.data || err.message || err);
    process.exit(1);
  }
}

main();
