"use client";

import { useEffect, useState } from 'react';
import Navbar2 from '@/Components/Navbar2';
import Sidebar from '@/Components/Sidebar';
import MobileTopBar from '@/Components/MobileTopBar';
import { getSocket } from '../../utils/socket';

const page = () => {
  const [status, setStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    setStatus(socket.connected ? 'Connected' : 'Connecting...');

    socket.on('connect', () => setStatus('Connected'));
    socket.on('disconnect', () => setStatus('Disconnected'));
    socket.on('chatMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chatMessage');
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    const socket = getSocket();
    if (!socket || !newMessage.trim()) return;

    socket.emit('chatMessage', newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className='min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-b from-[#0e0e14] to-black overflow-x-hidden'>
      <Navbar2 />
      <MobileTopBar />
      <Sidebar />

      <main className='flex-1 p-4 lg:p-8 text-white'>
        <div className='mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl'>
          <h1 className='text-3xl font-semibold mb-3'>Chatbot / Socket Test</h1>
          <p className='mb-4 text-sm text-slate-300'>Socket status: <span className='font-semibold'>{status}</span></p>

          <div className='mb-6 max-h-80 overflow-y-auto rounded-2xl border border-white/10 bg-black/50 p-4'>
            {messages.length === 0 ? (
              <p className='text-slate-400'>No messages yet. Send one to test socket communication.</p>
            ) : (
              messages.map((message, index) => (
                <div key={index} className='mb-3 rounded-2xl bg-slate-900/80 px-4 py-3'>
                  <p className='text-slate-100'>{message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className='flex flex-col gap-3 md:flex-row'>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-blue-400'
              placeholder='Type a message to broadcast'
            />
            <button
              type='submit'
              className='rounded-2xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-500'
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default page