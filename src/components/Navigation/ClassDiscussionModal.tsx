'use client';

import React, { useState } from 'react';
import { useDaleel } from '../../context/DaleelContext';
import { MessageSquare, X, Send, Heart } from 'lucide-react';

export const ClassDiscussionModal: React.FC = () => {
  const {
    isDiscussionOpen,
    setIsDiscussionOpen,
    discussionPosts,
    addDiscussionPost,
    likeDiscussionPost,
    activeBlueprint,
  } = useDaleel();

  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  if (!isDiscussionOpen) return null;

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addDiscussionPost(topic || activeBlueprint.title, 'Inquiry', content);
    setTopic('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#223528] text-emerald-300 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900">Class Discussion</h2>
              <p className="text-xs text-stone-500">{activeBlueprint.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDiscussionOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FBFBF9]">
          {discussionPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-slate-900">{post.authorName}</strong>
                  <span className="text-stone-400 ml-2">{post.timestamp}</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                  {post.badge}
                </span>
              </div>
              <div className="font-semibold text-slate-800">{post.topic}</div>
              <p className="text-stone-700 leading-relaxed">{post.content}</p>
              <button
                type="button"
                onClick={() => likeDiscussionPost(post.id)}
                className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-600 cursor-pointer"
              >
                <Heart className="h-3.5 w-3.5" />
                <span>{post.likes}</span>
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handlePost} className="p-4 border-t border-stone-200 bg-white space-y-2 text-xs">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic (optional)"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share a finding or question with your class..."
              className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#223528] text-white font-bold disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
