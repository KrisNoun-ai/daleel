'use client';

import React, { useState } from 'react';
import { useOmniMesh } from '../../context/SnackLabContext';
import {
  MessageSquare,
  X,
  Send,
  Heart,
  MessageCircle,
  Sparkles,
  Users,
  Compass,
  Filter,
} from 'lucide-react';

export const ClassDiscussionModal: React.FC = () => {
  const {
    isClassDiscussionOpen,
    setIsClassDiscussionOpen,
    classDiscussionPosts,
    addClassDiscussionPost,
    likeDiscussionPost,
    student,
  } = useOmniMesh();

  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  if (!isClassDiscussionOpen) return null;

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addClassDiscussionPost(topic || 'Lab Synthesis & Discussion', content);
    setTopic('');
    setContent('');
  };

  const tags = ['All', 'Physical Science', 'Economics', 'Sensory QA', 'Brand Studio'];

  const filteredPosts =
    selectedTag === 'All'
      ? classDiscussionPosts
      : classDiscussionPosts.filter((p) => p.badge === selectedTag);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#223528] text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                  Grade 9 Class Discussion
                </h2>
                <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  28 Active Peers
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Collaborative Project Hub • Cross-Department Formulation Exchange
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsClassDiscussionOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter tags bar */}
        <div className="px-6 py-2.5 bg-white border-b border-stone-100 flex items-center gap-2 overflow-x-auto text-xs">
          <Filter className="h-3.5 w-3.5 text-stone-400 shrink-0" />
          <span className="text-[11px] text-stone-400 font-mono uppercase tracking-wider shrink-0 mr-1">
            Topics:
          </span>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#223528] text-white shadow-2xs font-semibold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-[#FBFBF9]">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-8 w-8 rounded-full ${post.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}
                  >
                    {post.authorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-slate-900">
                        {post.authorName}
                      </span>
                      {post.badge && (
                        <span className="text-[10px] font-mono bg-stone-100 text-stone-700 border border-stone-200 px-2 py-0.5 rounded-full font-medium">
                          {post.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500">
                      {post.grade} • {post.authorRole}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-mono shrink-0">
                  {post.timestamp}
                </span>
              </div>

              {post.topic && (
                <h4 className="font-semibold text-xs text-stone-800 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>{post.topic}</span>
                </h4>
              )}

              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                {post.content}
              </p>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <button
                  type="button"
                  onClick={() => likeDiscussionPost(post.id)}
                  className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <Heart className="h-3.5 w-3.5 text-stone-400 hover:text-rose-500" />
                  <span className="font-mono text-[11px] font-semibold">{post.likes}</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-stone-400 font-mono">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>{post.repliesCount} replies</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Composer */}
        <form onSubmit={handlePost} className="p-4 border-t border-stone-200 bg-white space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic or question title (e.g., Moisture Retention in Batch 03)..."
              className="w-full text-xs px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#223528]"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Share your findings with Grade 9 as ${student.name}...`}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#223528]"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#223528] text-white hover:bg-[#1b2b20] disabled:opacity-40 disabled:hover:bg-[#223528] text-xs font-semibold shadow-xs cursor-pointer transition-all"
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
