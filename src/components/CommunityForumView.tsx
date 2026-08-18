import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Award,
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Send,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { ForumPost } from '../types';

interface CommunityForumViewProps {
  posts: ForumPost[];
  onAddPost: (post: ForumPost) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  // New Post Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumPost['category']>('Crop Advisory');
  const [cropTag, setCropTag] = useState('Wheat');
  const [authorName, setAuthorName] = useState('Kisan Basavaraj');

  const categories = [
    'All',
    'Crop Advisory',
    'Pest & Disease',
    'Equipment & Tech',
    'Govt Schemes',
    'Market Trends',
  ];

  const filteredPosts = posts.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      !searchFilter ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.cropTag?.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorName,
      authorRole: 'Farmer',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      location: 'Karnataka',
      timestamp: 'Just now',
      category,
      cropTag,
      title,
      content,
      likes: 0,
      userLiked: false,
      comments: [],
    };

    onAddPost(newPost);
    setShowCreateModal(false);
    setTitle('');
    setContent('');
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
    setActiveCommentPostId(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-stone-800 to-emerald-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Peer-to-Peer Agronomy & Knowledge Forum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Kisan Chopal: Farmer Knowledge Exchange
            </h2>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              Ask fellow farmers and certified agronomists questions on pest control, subsidy applications, high-yield varieties, and machinery maintenance.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Ask a Question / Share Advice</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search discussions & crops..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
          />
        </div>
      </div>

      {/* Forum Discussion Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-emerald-400 transition-all space-y-3"
          >
            {/* Post Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-stone-900 text-sm">{post.authorName}</h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                        post.authorRole === 'Agronomist'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {post.authorRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    {post.location} • {post.timestamp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {post.category}
                </span>
                {post.cropTag && (
                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    🏷 {post.cropTag}
                  </span>
                )}
              </div>
            </div>

            {/* Title & Body */}
            <div>
              <h3 className="font-bold text-stone-900 text-base">{post.title}</h3>
              <p className="text-xs text-stone-700 mt-1.5 leading-relaxed">{post.content}</p>
            </div>

            {/* Verified Agronomist Answer if available */}
            {post.verifiedAnswer && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Verified Agronomist Solution:</span>
                </div>
                <p className="text-emerald-950 leading-relaxed">{post.verifiedAnswer}</p>
              </div>
            )}

            {/* Interactions Bar */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-semibold text-stone-600">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
                    post.userLiked
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      post.userLiked ? 'fill-emerald-600 text-emerald-600' : ''
                    }`}
                  />
                  <span>{post.likes} Upvotes</span>
                </button>

                <button
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments.length} Answers</span>
                </button>
              </div>

              <button
                onClick={() => setActiveCommentPostId(post.id)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Reply to discussion
              </button>
            </div>

            {/* Comments Thread & Add Reply */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-stone-100 space-y-3">
                {/* Existing comments */}
                {post.comments.length > 0 && (
                  <div className="space-y-2 pl-3 border-l-2 border-emerald-300">
                    {post.comments.map((c) => (
                      <div key={c.id} className="text-xs bg-stone-50 p-2.5 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900">
                            {c.authorName} ({c.authorRole})
                          </span>
                          <span className="text-[10px] text-stone-400">{c.timestamp}</span>
                        </div>
                        <p className="text-stone-700 leading-relaxed">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write your farmer experience or advice..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(post.id);
                    }}
                    className="flex-1 text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Create Forum Discussion */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                Start a New Discussion in Kisan Forum
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="my-4 space-y-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Topic Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 bg-white"
                  >
                    <option value="Crop Advisory">Crop Advisory</option>
                    <option value="Pest & Disease">Pest & Disease</option>
                    <option value="Equipment & Tech">Equipment & Tech</option>
                    <option value="Govt Schemes">Govt Schemes</option>
                    <option value="Market Trends">Market Trends</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Crop Tag</label>
                  <input
                    type="text"
                    value={cropTag}
                    onChange={(e) => setCropTag(e.target.value)}
                    placeholder="e.g. Wheat, Tomato"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Question / Topic Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Best organic bio-fertilizer schedule for Basmati paddy?"
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Detailed Explanation *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details regarding your soil type, crop stage, symptoms, or subsidy questions..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Publish to Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
