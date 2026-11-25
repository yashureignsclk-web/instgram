import React, { useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bookmark,
  Camera,
  Film,
  Grid,
  Heart,
  Layers,
  Link as LinkIcon,
  LogOut,
  MessageCircle,
  Moon,
  Pin,
  Play,
  Plus,
  Sun,
} from 'lucide-react';
import type { PostItem, StoryItem, UserProfileData } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProfileViewProps {
  user: UserProfileData;
  posts: PostItem[];
  savedPosts: PostItem[];
  highlights: StoryItem[];
  isDark: boolean;
  isLoggedIn: boolean;
  onToggleTheme: () => void;
  onEditProfile: () => void;
  onShareProfile: () => void;
  onOpenInsights: () => void;
  onOpenStory: (index: number) => void;
  onOpenCreate: () => void;
  onSelectPost: (post: PostItem) => void;
  onOpenAuth: () => void;
}

type ProfileTab = 'grid' | 'reels' | 'saved';

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  posts,
  savedPosts,
  highlights,
  isDark,
  isLoggedIn,
  onToggleTheme,
  onEditProfile,
  onShareProfile,
  onOpenInsights,
  onOpenStory,
  onOpenCreate,
  onSelectPost,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('grid');
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null);

  const reelPosts = posts.filter((p) => p.isReel);

  const formatMetric = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Profile Hero Card */}
      <section className="flex flex-col px-4 sm:px-6 pt-5 pb-6 bg-slate-50 dark:bg-[#1a1b22] sm:rounded-b-3xl border-b border-slate-200/80 dark:border-white/5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 sm:gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenStory(0)}
              aria-label="Open your story highlight"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-[#ff516a] via-[#ffb95f] to-[#571bc1] shadow-md active:scale-95 transition-transform"
            >
              <span className="block w-full h-full rounded-full p-[2px] bg-white dark:bg-[#12131a]">
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </span>
            </button>
            <button
              type="button"
              onClick={onOpenCreate}
              aria-label="Create new post"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow ring-2 ring-white dark:ring-[#1a1b22] hover:bg-rose-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Stat Counters */}
          <div className="flex items-center justify-around flex-1 max-w-sm text-center">
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                {user.postsCount}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Posts
              </span>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                {user.followersLabel}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Followers
              </span>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tabular-nums">
                {user.followingCount}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Following
              </span>
            </div>
          </div>
        </div>

        {/* Identity & Bio */}
        <div className="flex flex-col mt-4 relative z-10">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {user.name}
              </h1>
              <BadgeCheck className="w-5 h-5 text-amber-500" />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                className="px-3 py-1.5 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-[#34343c] transition-colors"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-violet-600" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenAuth}
                aria-label="Manage account session"
                className={`px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  isLoggedIn
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-white dark:bg-[#292931] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#34343c]'
                }`}
              >
                {isLoggedIn ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Signed In</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            @{user.handle} · {user.badge}
          </p>

          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-2 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>{user.role}</span>
          </p>

          <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed max-w-xl">
            {user.bio}
          </p>

          <a
            href={`https://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline w-fit"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{user.website}</span>
          </a>
        </div>

        {/* Profile Actions */}
        <div className="flex items-center gap-2.5 mt-5 relative z-10 max-w-xl">
          <button
            type="button"
            onClick={onEditProfile}
            className="flex-1 h-11 px-4 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-[#34343c] active:scale-95 transition-all whitespace-nowrap"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={onShareProfile}
            className="flex-1 h-11 px-4 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-[#34343c] active:scale-95 transition-all whitespace-nowrap"
          >
            Share Profile
          </button>
          <button
            type="button"
            onClick={onOpenInsights}
            aria-label="Creator Insights"
            className="w-11 h-11 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 flex items-center justify-center hover:bg-violet-500/25 active:scale-90 transition-all flex-shrink-0"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Story Highlights */}
      <section className="flex flex-col mt-5 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Story Highlights
          </span>
          <button
            type="button"
            onClick={() => onOpenStory(1)}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 hover:underline"
          >
            <span>Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
          {highlights.slice(1).map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenStory(i + 1)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
            >
              <div
                className={`w-16 h-16 rounded-full p-[2px] transition-transform group-active:scale-95 ${
                  i === 0
                    ? 'bg-gradient-to-tr from-[#ff516a] to-[#ffb95f]'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-[#12131a]">
                  <ImageWithFallback
                    src={item.media}
                    alt={item.location}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate max-w-[68px]">
                {item.location.split(',')[0]}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenCreate}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#1e1f26] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              New
            </span>
          </button>
        </div>
      </section>

      {/* Profile Gallery Tabs */}
      <section className="mt-5 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center justify-around bg-white dark:bg-[#12131a]">
          {(
            [
              { id: 'grid', label: 'Grid', Icon: Grid },
              { id: 'reels', label: 'Reels', Icon: Film },
              { id: 'saved', label: 'Saved', Icon: Bookmark },
            ] as const
          ).map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-3.5 flex flex-col items-center justify-center relative transition-colors ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-bold mt-1">{label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-[2.5px] rounded-full bg-gradient-to-r from-[#ff516a] via-[#ffb95f] to-[#8455ef]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid View */}
        {activeTab === 'grid' && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5 sm:gap-1 bg-white dark:bg-[#12131a]">
            {posts.map((post) => {
              const showOverlay = activeOverlayId === post.id;
              return (
                <div
                  key={post.id}
                  onClick={() => {
                    setActiveOverlayId(showOverlay ? null : post.id);
                    onSelectPost(post);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPost(post);
                    }
                  }}
                  className="relative aspect-square bg-slate-200 dark:bg-[#1e1f26] cursor-pointer overflow-hidden group"
                >
                  <ImageWithFallback
                    src={post.images[0]}
                    alt={post.caption}
                    style={post.filterStyle ? { filter: post.filterStyle } : undefined}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {post.isPinned && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-amber-400">
                      <Pin className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {!post.isPinned && post.images.length > 1 && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {!post.isPinned && post.isReel && post.images.length === 1 && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                    <span className="flex items-center gap-1 text-white text-xs font-bold tabular-nums">
                      <Heart className="w-4 h-4 text-rose-400 fill-current" />
                      {formatMetric(post.likes)}
                    </span>
                    <span className="flex items-center gap-1 text-white text-xs font-bold tabular-nums">
                      <MessageCircle className="w-4 h-4 text-amber-300 fill-current" />
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reels View */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5 sm:gap-1">
            {reelPosts.map((reel) => (
              <button
                key={reel.id}
                type="button"
                onClick={() => onSelectPost(reel)}
                className="relative aspect-[9/16] bg-slate-200 dark:bg-[#1e1f26] overflow-hidden group text-left"
              >
                <ImageWithFallback
                  src={reel.images[0]}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold tabular-nums">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{reel.views || '12.4K'}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Saved Collection View */}
        {activeTab === 'saved' &&
          (savedPosts.length === 0 ? (
            <div className="px-6 py-12 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1e1f26] flex items-center justify-center text-slate-400 mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No Saved Frames Yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                Bookmark posts from the Feed or Explore to keep lighting and framing references here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5 sm:gap-1">
              {savedPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => onSelectPost(post)}
                  className="relative aspect-square bg-slate-200 dark:bg-[#1e1f26] overflow-hidden group"
                >
                  <ImageWithFallback
                    src={post.images[0]}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </span>
                </button>
              ))}
            </div>
          ))}
      </section>
    </div>
  );
};
