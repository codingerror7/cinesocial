"use client";
import React, { useEffect, useRef, useState } from 'react';

const ChatInput = ({ value, onChange, onSend, disabled, onStartTyping, onStopTyping }) => {
  const textareaRef = useRef(null);
  const [local, setLocal] = useState(value || '');
  const typingTimer = useRef(null);

  useEffect(() => setLocal(value || ''), [value]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(200, el.scrollHeight)}px`;
  }, [local]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocal(newValue);
    onChange?.(newValue);
    onStartTyping?.();
    if (typingTimer.current) {
      clearTimeout(typingTimer.current);
    }
    typingTimer.current = setTimeout(() => onStopTyping?.(), 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (local.trim() && !disabled) {
        onSend(local.trim());
        setLocal('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (local.trim() && !disabled) {
      onSend(local.trim());
      setLocal('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3">
        <textarea
          ref={textareaRef}
          value={local}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Join the community to chat' : 'Write a message...'}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:cursor-not-allowed disabled:text-white/40"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !local.trim()}
        className="shrink-0 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
