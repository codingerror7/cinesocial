"use client";
import React from 'react';

const OnlineMembers = ({ count }) => {
  return (
    <div className="text-sm text-white/60">{count || 0} online</div>
  );
};

export default OnlineMembers;
