"use client";
import React from 'react';

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;
  const names = users.map(u => u.name || u.username || 'Someone').slice(0,3).join(', ');
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-2 text-xs text-white/50">
      {names} {users.length > 1 ? 'are' : 'is'} typing...
    </div>
  );
};

export default TypingIndicator;
