import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import type {
  CuratorProfile,
  DirectMessageThread,
  ExploreTile,
  PostItem,
  StoryItem,
  UserProfileData,
} from '../types';
import { ImageWithFallback } from './ImageWithFallback';

/* -------------------------------------------------------------------------- */
/* 1. Comments Modal                                                          */
/* -------------------------------------------------------------------------- */
interface CommentsModalProps {
  post: PostItem | null;
  currentUser: UserProfileData;
  onClose: () => void;
  onAddComment: (postId: string, text: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  currentUser,
  onClose,
  onAddComment,
}) => {
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [post, onClose]);

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddComment(post.id, draft.trim());
    setDraft('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Post comments"
    >
      <div
        className="w-full sm:max-w-lg bg-white dark:bg-[#1a1b22] rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Comments · <span className="tabular-nums">{post.comments.length}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              @{post.authorHandle} · {post.location}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[#34343c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
            <ImageWithFallback
              src={post.authorAvatar}
              alt={post.authorHandle}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
            <div className="text-sm text-slate-800 dark:text-slate-200">
              <span className="font-bold mr-1.5">{post.authorHandle}</span>
              <span>{post.caption}</span>
              <p className="text-xs text-slate-400 mt-1">{post.timestamp}</p>
            </div>
          </div>

          {post.comments.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No critiques or notes yet. Start the conversation below.
            </div>
          ) : (
            post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <ImageWithFallback
                  src={comment.authorAvatar}
                  alt={comment.authorHandle}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    <span className="font-bold mr-1.5">{comment.authorHandle}</span>
                    <span className="text-slate-700 dark:text-slate-200">{comment.text}</span>
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                    {comment.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-[#12131a] flex items-center gap-2.5 pb-safe"
        >
          <ImageWithFallback
            src={currentUser.avatar}
            alt={currentUser.handle}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Add a comment as @${currentUser.handle}...`}
            className="flex-1 min-w-0 bg-white dark:bg-[#1a1b22] border border-slate-200 dark:border-white/10 rounded-full px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Post comment"
            className="w-10 h-10 rounded-full bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 hover:bg-rose-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Story Viewer Modal                                                      */
/* -------------------------------------------------------------------------- */
interface StoryViewerModalProps {
  stories: StoryItem[];
  activeIndex: number | null;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
  onMarkViewed: (storyId: string) => void;
  onSendReply: (handle: string, text: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  activeIndex,
  onChangeIndex,
  onClose,
  onMarkViewed,
  onSendReply,
}) => {
  const [reply, setReply] = useState('');
  const [progress, setProgress] = useState(0);

  const story = activeIndex !== null ? stories[activeIndex] : null;

  useEffect(() => {
    if (story) {
      onMarkViewed(story.id);
      setProgress(0);
    }
  }, [story?.id]);

  useEffect(() => {
    if (activeIndex === null) return;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeIndex < stories.length - 1) {
            onChangeIndex(activeIndex + 1);
          } else {
            onClose();
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [activeIndex, stories.length, onChangeIndex, onClose]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && activeIndex < stories.length - 1) {
        onChangeIndex(activeIndex + 1);
      }
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        onChangeIndex(activeIndex - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, stories.length, onChangeIndex, onClose]);

  if (activeIndex === null || !story) return null;

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onSendReply(story.handle, reply.trim());
    setReply('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${story.handle}'s story`}
    >
      <div className="relative w-full h-full sm:max-w-md sm:h-[85vh] sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between border border-white/10 shadow-2xl">
        <ImageWithFallback
          src={story.media}
          alt={story.caption}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85 pointer-events-none" />

        {/* Top Progress & Creator Bar */}
        <div className="relative z-10 px-4 pt-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      idx < activeIndex ? '100%' : idx === activeIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <ImageWithFallback
                src={story.avatar}
                alt={story.handle}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-500"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">
                    @{story.handle}
                  </span>
                  {story.isLive && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 truncate">
                  {story.location} · {story.timestamp}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close story viewer"
              className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tap Zones / Buttons */}
        <div className="relative z-10 flex-1 flex items-center justify-between px-2">
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={() => onChangeIndex(Math.max(0, activeIndex - 1))}
            aria-label="Previous story"
            className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-md text-white flex items-center justify-center disabled:opacity-0 hover:bg-black/60 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() =>
              activeIndex < stories.length - 1 ? onChangeIndex(activeIndex + 1) : onClose()
            }
            aria-label="Next story"
            className="w-11 h-11 rounded-full bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Caption & Reply */}
        <div className="relative z-10 px-4 pb-5 flex flex-col gap-3 pb-safe">
          <p className="text-sm text-white/95 leading-snug">{story.caption}</p>
          <form onSubmit={handleReplySubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={`Send message to @${story.handle}...`}
              className="flex-1 min-w-0 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/65 focus:outline-none focus:border-rose-400"
            />
            <button
              type="submit"
              aria-label="Send story reply"
              className="w-11 h-11 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-rose-700"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Lightbox Modal (Post or Explore Tile)                                   */
/* -------------------------------------------------------------------------- */
interface LightboxModalProps {
  post: PostItem | null;
  tile: ExploreTile | null;
  onClose: () => void;
  onToggleLikePost: (id: string) => void;
  onToggleSavePost: (id: string) => void;
  onToggleLikeTile: (id: string) => void;
  onToggleSaveTile: (id: string) => void;
  onOpenComments: (post: PostItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  post,
  tile,
  onClose,
  onToggleLikePost,
  onToggleSavePost,
  onToggleLikeTile,
  onToggleSaveTile,
  onOpenComments,
}) => {
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    setSlideIdx(0);
  }, [post?.id, tile?.id]);

  useEffect(() => {
    if (!post && !tile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [post, tile, onClose]);

  if (!post && !tile) return null;

  const images = post ? post.images : tile ? [tile.image] : [];
  const activeSrc = images[slideIdx] || images[0];
  const title = post ? `@${post.authorHandle}` : tile!.title;
  const subtitle = post ? post.location : `${tile!.creator} · ${tile!.category}`;
  const caption = post ? post.caption : tile!.subtitle || `${tile!.category} curation`;
  const exif = post ? post.exif : tile!.exif;
  const likes = post ? post.likes : tile!.likes;
  const isLiked = post ? post.isLiked : Boolean(tile!.isLiked);
  const isSaved = post ? post.isSaved : Boolean(tile!.isSaved);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="High resolution photo inspector"
    >
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1a1b22] rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-12 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media Viewer */}
        <div className="md:col-span-7 bg-slate-950 relative flex items-center justify-center min-h-[280px] sm:min-h-[420px]">
          <ImageWithFallback
            src={activeSrc}
            alt={caption}
            style={post?.filterStyle ? { filter: post.filterStyle } : undefined}
            className="w-full h-full max-h-[65vh] md:max-h-[82vh] object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous frame"
                onClick={() => setSlideIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                aria-label="Next frame"
                onClick={() => setSlideIdx((i) => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Metadata & Actions */}
        <div className="md:col-span-5 flex flex-col justify-between p-5 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{subtitle}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close inspector"
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[#34343c]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {caption}
            </p>

            {exif && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#12131a] border border-slate-200/80 dark:border-white/5 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                <Camera className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>{exif}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-200/80 dark:border-white/5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => (post ? onToggleLikePost(post.id) : onToggleLikeTile(tile!.id))}
                className={`px-3.5 h-10 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors tabular-nums ${
                  isLiked
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-[#292931] text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#34343c]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes.toLocaleString()}</span>
              </button>

              {post && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenComments(post);
                  }}
                  className="px-3.5 h-10 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-800 dark:text-slate-100 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-[#34343c]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="tabular-nums">{post.comments.length}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => (post ? onToggleSavePost(post.id) : onToggleSaveTile(tile!.id))}
              aria-label={isSaved ? 'Remove bookmark' : 'Save frame'}
              className={`px-3.5 h-10 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-[#292931] text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#34343c]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. Direct Messages Drawer                                                  */
/* -------------------------------------------------------------------------- */
interface DirectMessagesDrawerProps {
  isOpen: boolean;
  threads: DirectMessageThread[];
  onClose: () => void;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
}

export const DirectMessagesDrawer: React.FC<DirectMessagesDrawerProps> = ({
  isOpen,
  threads,
  onClose,
  onSelectThread,
  onSendMessage,
}) => {
  const [activeId, setActiveId] = useState<string>(threads[0]?.id || '');
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && activeId) {
      onSelectThread(activeId);
    }
  }, [isOpen, activeId]);

  if (!isOpen) return null;

  const activeThread = threads.find((t) => t.id === activeId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activeThread) return;
    onSendMessage(activeThread.id, draft.trim());
    setDraft('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Direct messages"
    >
      <div
        className="w-full sm:max-w-xl h-full bg-white dark:bg-[#12131a] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-white/5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Messages
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct conversations with curators
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close messages"
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[#34343c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thread Switcher */}
        <div className="flex items-center gap-2.5 px-4 py-3 overflow-x-auto no-scrollbar border-b border-slate-200/80 dark:border-white/5">
          {threads.map((thread) => {
            const isActive = thread.id === activeThread?.id;
            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => {
                  setActiveId(thread.id);
                  onSelectThread(thread.id);
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-rose-600/10 border-rose-500/40 text-slate-900 dark:text-white'
                    : 'bg-slate-50 dark:bg-[#1a1b22] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300'
                }`}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={thread.avatar}
                    alt={thread.handle}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  {thread.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#12131a]" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-tight">@{thread.handle}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {thread.unread ? 'Unread' : 'Active'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Conversation */}
        {activeThread && (
          <>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {activeThread.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white rounded-br-sm'
                        : 'bg-slate-100 dark:bg-[#1e1f26] text-slate-900 dark:text-slate-100 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-[#1a1b22] flex items-center gap-2.5 pb-safe"
            >
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message @${activeThread.handle}...`}
                className="flex-1 min-w-0 bg-white dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-full px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send direct message"
                className="w-11 h-11 rounded-full bg-rose-600 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 hover:bg-rose-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Creator Insights Modal                                                  */
/* -------------------------------------------------------------------------- */
interface InsightsModalProps {
  isOpen: boolean;
  user: UserProfileData;
  onClose: () => void;
}

export const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, user, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cities = [
    { name: 'Tokyo, Japan', share: 38 },
    { name: 'Berlin, Germany', share: 27 },
    { name: 'Paris, France', share: 21 },
    { name: 'London, UK', share: 14 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Creator Insights"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1a1b22] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Creator Insights
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                @{user.handle} · Last 30 days
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close insights"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12131a] border border-slate-200/80 dark:border-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Reel Plays</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              104.2K
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +28.4%
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12131a] border border-slate-200/80 dark:border-white/5">
            <span className="text-xs text-slate-500 dark:text-slate-400">Followers</span>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
              {user.followersLabel}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
              +1.9K this month
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Audience Reach by City
          </h3>
          {cities.map((city) => (
            <div key={city.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {city.name}
                </span>
                <span className="font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                  {city.share}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-[#12131a] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef]"
                  style={{ width: `${city.share}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. Edit Profile Modal                                                      */
/* -------------------------------------------------------------------------- */
interface EditProfileModalProps {
  isOpen: boolean;
  user: UserProfileData;
  onClose: () => void;
  onSave: (updates: Pick<UserProfileData, 'name' | 'role' | 'bio' | 'website'>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  user,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [bio, setBio] = useState(user.bio);
  const [website, setWebsite] = useState(user.website);

  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setRole(user.role);
      setBio(user.bio);
      setWebsite(user.website);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      role: role.trim() || user.role,
      bio: bio.trim(),
      website: website.trim().replace(/^https?:\/\//, ''),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit Profile"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-[#1a1b22] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Edit Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit profile"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Creative Discipline
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Portfolio Link
          </label>
          <div className="flex items-center bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2.5">
            <Globe className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white text-sm font-bold"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. Auth Modal (Login + 5-Step Sign Up & SMS OTP Onboarding)                */
/* -------------------------------------------------------------------------- */
interface AuthModalProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  user: UserProfileData;
  curators: CuratorProfile[];
  onClose: () => void;
  onToggleFollowCurator: (id: string) => void;
  onCompleteAuth: (updates: Partial<UserProfileData>, toastMessage: string) => void;
  onLogout: () => void;
}

const AESTHETIC_TOPICS = [
  'Nocturnal Street',
  'Brutalist Concrete',
  '35mm Analog Film',
  'Chiaroscuro Portraits',
  'Alpine Landscapes',
  'Minimalist Geometry',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  isLoggedIn,
  user,
  curators,
  onClose,
  onToggleFollowCurator,
  onCompleteAuth,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState(user.handle);
  const [loginPassword, setLoginPassword] = useState('lumina35mm!');

  // Sign up & verification state
  const [fullName, setFullName] = useState('Valeria Cruz');
  const [phoneOrEmail, setPhoneOrEmail] = useState('+49 176 4820 9150');
  const [signupPassword, setSignupPassword] = useState('lumina35mm!');
  const [expectedOtp, setExpectedOtp] = useState('482915');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(29);
  const [claimedHandle, setClaimedHandle] = useState('valeria.cruz');
  const [claimedBio, setClaimedBio] = useState(user.bio);
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>([
    'Nocturnal Street',
    '35mm Analog Film',
  ]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const isOtpStepActive = mode === 'signup' && step === 2;

  useEffect(() => {
    if (!isOtpStepActive || otpTimer <= 0) return;
    const t = window.setInterval(() => {
      setOtpTimer((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [isOtpStepActive, otpTimer]);

  if (!isOpen) return null;

  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setOtpTimer(30);
  };

  const handleOtpChange = (index: number, value: string, prefix: string) => {
    const digits = value.replace(/\D/g, '');
    setOtpError(null);
    if (digits.length > 1) {
      const next = ['', '', '', '', '', ''];
      digits
        .slice(0, 6)
        .split('')
        .forEach((d, idx) => {
          next[idx] = d;
        });
      setOtpDigits(next);
      const focusIdx = Math.min(5, digits.length - 1);
      document.getElementById(`${prefix}-${focusIdx}`)?.focus();
      return;
    }

    const clean = digits.slice(-1);
    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    if (clean && index < 5) {
      document.getElementById(`${prefix}-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    prefix: string
  ) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      document.getElementById(`${prefix}-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`${prefix}-${index - 1}`)?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`${prefix}-${index + 1}`)?.focus();
    }
  };

  const autofillOtp = () => {
    setOtpDigits(expectedOtp.split(''));
    setOtpError(null);
  };

  const verifyOtpCode = () => {
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits from your SMS.');
      return false;
    }
    if (entered !== expectedOtp) {
      setOtpError(`Incorrect code. Enter ${expectedOtp} or tap Autofill.`);
      return false;
    }
    setOtpError(null);
    return true;
  };

  const toggleAesthetic = (topic: string) => {
    setSelectedAesthetics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleFinishSignup = () => {
    onCompleteAuth(
      {
        name: fullName.trim() || user.name,
        handle: claimedHandle.trim().replace(/^@/, '') || user.handle,
        bio: claimedBio.trim() || user.bio,
      },
      `Welcome to LUMINA, @${claimedHandle.trim().replace(/^@/, '') || user.handle}`
    );
    setMode('login');
    setStep(1);
  };

  const renderOtpEntryBlock = (phoneTarget: string, prefix: string, onVerified: () => void, submitLabel: string) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Verify via SMS OTP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter the 6-digit code sent to {phoneTarget}
          </p>
        </div>
      </div>

      {/* Simulated SMS Inbox Banner */}
      <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-violet-700 dark:text-violet-300 uppercase tracking-wider">
            SMS Preview
          </p>
          <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
            Your LUMINA code is{' '}
            <span className="font-extrabold tracking-widest tabular-nums text-slate-900 dark:text-white">
              {expectedOtp}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={autofillOtp}
          className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-bold flex-shrink-0 hover:bg-violet-700"
        >
          Autofill
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {otpDigits.map((digit, i) => (
          <input
            key={i}
            id={`${prefix}-${i}`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value, prefix)}
            onKeyDown={(e) => handleOtpKeyDown(i, e, prefix)}
            aria-label={`OTP digit ${i + 1}`}
            className={`h-12 text-center text-lg font-extrabold tabular-nums bg-slate-50 dark:bg-[#12131a] border rounded-xl text-slate-900 dark:text-white focus:outline-none ${
              otpError
                ? 'border-rose-500 focus:border-rose-500'
                : 'border-slate-200 dark:border-white/15 focus:border-rose-500'
            }`}
          />
        ))}
      </div>

      {otpError && (
        <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{otpError}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={autofillOtp}
          className="font-semibold text-violet-600 dark:text-violet-300 hover:underline flex items-center gap-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Use code {expectedOtp}
        </button>
        <button
          type="button"
          disabled={otpTimer > 0}
          onClick={generateNewOtp}
          className="font-semibold text-rose-600 dark:text-rose-400 disabled:text-slate-400 disabled:dark:text-slate-500 tabular-nums"
        >
          {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend SMS Code'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          if (verifyOtpCode()) onVerified();
        }}
        className="h-11 rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white text-sm font-bold hover:brightness-110 transition-all"
      >
        {submitLabel}
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="LUMINA Account Authentication"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#1a1b22] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'signup' && step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                aria-label="Previous onboarding step"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="font-editorial text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              LUMINA
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account dialog"
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#292931] text-slate-700 dark:text-slate-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-[#12131a] border border-slate-200/80 dark:border-white/5">
          {(
            [
              { id: 'login', label: 'Login' },
              { id: 'signup', label: 'Sign Up' },
            ] as const
          ).map((tab) => {
            const active = mode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setMode(tab.id);
                  setOtpError(null);
                  if (tab.id === 'signup') {
                    setStep(1);
                    setExpectedOtp('482915');
                    setOtpDigits(['', '', '', '', '', '']);
                    setOtpTimer(29);
                  }
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? 'bg-white dark:bg-[#292931] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Session Banner */}
        {isLoggedIn && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1a1b22]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  Active session · @{user.handle}
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  Signed in on this device
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1 hover:text-rose-600 dark:hover:text-rose-400 flex-shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* LOGIN VIEW */}
        {mode === 'login' && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {isLoggedIn ? 'Switch account' : 'Welcome back'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Continue with your curator profile or login with credentials
              </p>
            </div>

            {/* Saved Account Quick Continue */}
            <button
              type="button"
              onClick={() => onCompleteAuth({}, `Logged in as @${user.handle}`)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 hover:border-rose-500/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-rose-500"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Continue as {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    @{user.handle} · {user.badge}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-500" />
            </button>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
              <span>Or login with password</span>
              <span className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const handleClean = loginIdentifier.trim().replace(/^@/, '') || user.handle;
                onCompleteAuth({ handle: handleClean }, `Logged in as @${handleClean}`);
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="Handle, phone, or email"
                className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
              />
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                className="h-11 rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white text-sm font-bold shadow-sm hover:brightness-110 transition-all"
              >
                Login
              </button>
            </form>
          </div>
        )}

        {/* 5-STEP SIGN UP & SMS OTP ONBOARDING */}
        {mode === 'signup' && (
          <div className="flex flex-col gap-4">
            {/* Step Progress Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-rose-600 dark:text-rose-400 tabular-nums">
                  Step {step} of 5
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {step === 1 && 'Account Info'}
                  {step === 2 && 'SMS OTP Verification'}
                  {step === 3 && 'Claim Identity'}
                  {step === 4 && 'Aesthetics'}
                  {step === 5 && 'Follow Curators'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-colors ${
                      idx <= step
                        ? 'bg-gradient-to-r from-[#ff516a] to-[#8455ef]'
                        : 'bg-slate-200 dark:bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Create your curator profile
                </h2>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="Mobile number for SMS OTP"
                  className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                />
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    generateNewOtp();
                    setStep(2);
                  }}
                  className="h-11 rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white text-sm font-bold mt-1"
                >
                  Send SMS Verification Code
                </button>
              </div>
            )}

            {step === 2 &&
              renderOtpEntryBlock(
                phoneOrEmail,
                'signup-otp-digit',
                () => setStep(3),
                'Verify & Continue'
              )}

            {step === 3 && (
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Claim your identity
                </h2>
                <div className="flex items-center bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-rose-500 mr-1">@</span>
                  <input
                    type="text"
                    value={claimedHandle}
                    onChange={(e) => setClaimedHandle(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <textarea
                  rows={3}
                  value={claimedBio}
                  onChange={(e) => setClaimedBio(e.target.value)}
                  placeholder="Share your lens, cities, and visual focus..."
                  className="w-full bg-slate-50 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500 resize-none"
                />
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="h-11 rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white text-sm font-bold"
                >
                  Next: Choose Aesthetics
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-3.5">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Select your aesthetics
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tailor your Explore feed and curator recommendations
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {AESTHETIC_TOPICS.map((topic) => {
                    const active = selectedAesthetics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleAesthetic(topic)}
                        className={`px-3.5 py-3 rounded-2xl border text-xs font-semibold text-left flex items-center justify-between transition-colors ${
                          active
                            ? 'bg-rose-600/15 border-rose-500 text-rose-600 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-[#12131a] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{topic}</span>
                        {active && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="h-11 rounded-full bg-gradient-to-r from-[#ff516a] to-[#8455ef] text-white text-sm font-bold"
                >
                  Next: Follow Curators
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-violet-500" />
                    Follow featured curators
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Populate your home stream with 35mm & visual diaries
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {curators.map((curator) => (
                    <div
                      key={curator.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-[#12131a] border border-slate-200/80 dark:border-white/5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ImageWithFallback
                          src={curator.avatar}
                          alt={curator.handle}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            @{curator.handle}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {curator.specialty}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleFollowCurator(curator.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          curator.isFollowing
                            ? 'bg-slate-200 dark:bg-[#292931] text-slate-700 dark:text-slate-200'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {curator.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleFinishSignup}
                  className="h-11 rounded-full bg-gradient-to-r from-[#ff516a] via-[#8455ef] to-[#ca8100] text-white text-sm font-bold"
                >
                  Enter LUMINA
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
