import React, { useRef, useState } from 'react';
import {
  BadgeCheck,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  Layers,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Volume2,
  VolumeX,
  CheckCheck,
} from 'lucide-react';
import type { PostItem, StoryItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface FeedViewProps {
  posts: PostItem[];
  stories: StoryItem[];
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onOpenComments: (post: PostItem) => void;
  onOpenStory: (index: number) => void;
  onAddStory: () => void;
  onOpenExplore: () => void;
  onOpenLightbox: (post: PostItem) => void;
  onSharePost: (post: PostItem) => void;
  onFollowCreator: (handle: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  stories,
  onToggleLike,
  onToggleSave,
  onOpenComments,
  onOpenStory,
  onAddStory,
  onOpenExplore,
  onOpenLightbox,
  onSharePost,
  onFollowCreator,
}) => {
  const [slideIndexes, setSlideIndexes] = useState<Record<string, number>>({});
  const [burstPostId, setBurstPostId] = useState<string | null>(null);
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>('post-sophia');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const lastTapRef = useRef<Record<string, number>>({});

  const formatLikes = (num: number) => {
    if (num >= 10000) {
      const val = (num / 1000).toFixed(1);
      return val.endsWith('.0') ? `${val.slice(0, -2)}k` : `${val}k`;
    }
    return num.toLocaleString();
  };

  const handlePhotoTap = (post: PostItem) => {
    const now = Date.now();
    const last = lastTapRef.current[post.id] || 0;
    lastTapRef.current[post.id] = now;

    if (now - last < 320 && now - last > 0) {
      setBurstPostId(post.id);
      setTimeout(() => setBurstPostId((prev) => (prev === post.id ? null : prev)), 800);
      if (!post.isLiked) {
        onToggleLike(post.id);
      }
    }
  };

  const changeSlide = (postId: string, total: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndexes((prev) => {
      const current = prev[postId] || 0;
      const next = (current + delta + total) % total;
      return { ...prev, [postId]: next };
    });
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Story Carousel */}
      <section
        aria-label="Stories"
        className="w-full pt-3 pb-3.5 overflow-x-auto no-scrollbar flex gap-4 px-4 sm:px-6 items-center border-b border-slate-200/80 dark:border-white/5"
      >
        {stories.map((story, idx) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
            {story.isOwn ? (
              <button
                type="button"
                onClick={onAddStory}
                className="relative w-16 h-16 rounded-full p-[2px] bg-slate-200 dark:bg-slate-800 active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-rose-500"
                aria-label="Create new post or story"
              >
                <ImageWithFallback
                  src={story.avatar}
                  alt={story.name}
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#12131a] shadow-sm">
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.8} />
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenStory(idx)}
                className={`relative w-16 h-16 rounded-full p-[2.5px] active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-rose-500 ${
                  story.viewed
                    ? 'bg-slate-300 dark:bg-slate-700'
                    : 'bg-gradient-to-tr from-[#ff516a] via-[#8455ef] to-[#ffb95f]'
                }`}
                aria-label={`View ${story.handle}'s story`}
              >
                <span className="block w-full h-full rounded-full p-[2px] bg-white dark:bg-[#12131a]">
                  <ImageWithFallback
                    src={story.avatar}
                    alt={story.handle}
                    className="w-full h-full rounded-full object-cover"
                  />
                </span>
                {story.isLive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold tracking-wide ring-2 ring-white dark:ring-[#12131a]">
                    Live
                  </span>
                )}
              </button>
            )}
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate max-w-[68px]">
              {story.name}
            </span>
          </div>
        ))}
      </section>

      {/* Main Feed Stream */}
      <div className="flex flex-col gap-6 pt-3">
        {posts.map((post) => {
          const slideIdx = slideIndexes[post.id] || 0;
          const totalSlides = post.images.length;
          const activeImg = post.images[slideIdx] || post.images[0];
          const isAudioPlaying = audioPlayingId === post.id;

          return (
            <article
              key={post.id}
              className="flex flex-col w-full bg-white dark:bg-[#1a1b22] sm:rounded-2xl border-y sm:border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-xs"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3 relative">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(post)}
                    className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#ff516a] via-[#8455ef] to-[#ffb95f] flex-shrink-0 active:scale-95 transition-transform"
                    aria-label={`Inspect post by ${post.authorHandle}`}
                  >
                    <ImageWithFallback
                      src={post.authorAvatar}
                      alt={post.authorHandle}
                      className="w-full h-full rounded-full object-cover bg-slate-900"
                    />
                  </button>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {post.authorHandle}
                      </span>
                      {post.verified && (
                        <BadgeCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{post.location}</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    aria-label="Post options"
                    onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                    className="w-11 h-11 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuId === post.id && (
                    <div className="absolute right-0 top-11 z-20 w-44 rounded-xl bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 shadow-xl py-1 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenLightbox(post);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        Inspect EXIF & Frame
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onFollowCreator(post.authorHandle);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        Follow @{post.authorHandle}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSharePost(post);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-3.5 py-2 text-left text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/5"
                      >
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Frame */}
              <div
                onClick={() => handlePhotoTap(post)}
                className={`relative w-full bg-slate-950 overflow-hidden cursor-pointer select-none group ${
                  post.aspectRatio === '16/9'
                    ? 'aspect-video'
                    : post.aspectRatio === '1/1'
                    ? 'aspect-square'
                    : 'aspect-[4/5]'
                }`}
              >
                <ImageWithFallback
                  src={activeImg}
                  alt={post.caption}
                  style={post.filterStyle ? { filter: post.filterStyle } : undefined}
                  className="w-full h-full object-cover transition-transform duration-300"
                />

                {/* Carousel indicator & controls */}
                {totalSlides > 1 && (
                  <>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 tabular-nums">
                      <Layers className="w-3 h-3" />
                      <span>
                        {slideIdx + 1}/{totalSlides}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={(e) => changeSlide(post.id, totalSlides, -1, e)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/75"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={(e) => changeSlide(post.id, totalSlides, 1, e)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/75"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md">
                      {post.images.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          type="button"
                          aria-label={`Go to slide ${dotIdx + 1}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSlideIndexes((prev) => ({ ...prev, [post.id]: dotIdx }));
                          }}
                          className={`h-1.5 rounded-full transition-all ${
                            dotIdx === slideIdx ? 'w-3.5 bg-rose-500' : 'w-1.5 bg-white/45'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Double-tap heart burst */}
                {burstPostId === post.id && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Heart className="w-24 h-24 text-white fill-rose-500 drop-shadow-[0_4px_24px_rgba(244,63,94,0.8)] animate-double-tap" />
                  </div>
                )}

                {/* Ambient Audio Pill */}
                {post.audio && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAudioPlayingId(isAudioPlaying ? null : post.id);
                    }}
                    className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/10 text-left active:scale-[0.99] transition-transform z-10"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white flex-shrink-0">
                        {isAudioPlaying ? (
                          <Volume2 className="w-3.5 h-3.5" />
                        ) : (
                          <VolumeX className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="text-xs text-white font-semibold truncate">
                        {post.audio.artist} · <span className="font-normal text-slate-300">{post.audio.title}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                      <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                        <span className={`w-0.5 h-3 bg-rose-400 rounded-full sound-bar-1 ${!isAudioPlaying ? 'sound-bar-paused' : ''}`} />
                        <span className={`w-0.5 h-3 bg-rose-300 rounded-full sound-bar-2 ${!isAudioPlaying ? 'sound-bar-paused' : ''}`} />
                        <span className={`w-0.5 h-3 bg-rose-400 rounded-full sound-bar-3 ${!isAudioPlaying ? 'sound-bar-paused' : ''}`} />
                      </div>
                      <span className="text-[11px] text-slate-200 font-medium">
                        {isAudioPlaying ? 'Playing' : 'Muted'}
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
                    onClick={() => onToggleLike(post.id)}
                    className={`min-w-[44px] h-11 flex items-center justify-center rounded-full transition-colors ${
                      post.isLiked
                        ? 'text-rose-500 animate-heart-pop'
                        : 'text-slate-700 dark:text-slate-200 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    type="button"
                    aria-label="Open comments"
                    onClick={() => onOpenComments(post)}
                    className="min-w-[44px] h-11 px-2 flex items-center gap-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                      {post.comments.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    aria-label="Share post"
                    onClick={() => onSharePost(post)}
                    className="min-w-[44px] h-11 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:text-violet-500 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label={post.isSaved ? 'Remove bookmark' : 'Save post'}
                  onClick={() => onToggleSave(post.id)}
                  className={`min-w-[44px] h-11 flex items-center justify-center rounded-full transition-colors ${
                    post.isSaved
                      ? 'text-amber-500'
                      : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'
                  }`}
                >
                  <Bookmark className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Caption & Metadata */}
              <div className="px-4 pb-4 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                    {formatLikes(post.likes)}{' '}
                    <span className="font-normal text-slate-500 dark:text-slate-400">likes</span>
                  </span>
                  {post.exif && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {post.exif}
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
                  <span className="font-bold mr-1.5">{post.authorHandle}</span>
                  {post.caption}{' '}
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-rose-600 dark:text-rose-400 font-medium mr-1.5">
                      #{tag}
                    </span>
                  ))}
                </p>

                {post.comments.length > 0 && (
                  <div className="flex items-baseline gap-2 pt-0.5 text-xs">
                    <span className="font-semibold text-violet-600 dark:text-violet-300">
                      {post.comments[post.comments.length - 1].authorHandle}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 truncate">
                      {post.comments[post.comments.length - 1].text}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenComments(post)}
                    className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {post.comments.length > 0
                      ? `View all ${post.comments.length} comment${post.comments.length > 1 ? 's' : ''}`
                      : 'Add a comment'}
                  </button>
                  <span className="text-xs text-slate-400 dark:text-slate-500">{post.timestamp}</span>
                </div>
              </div>
            </article>
          );
        })}

        {/* End of Feed */}
        <div className="mx-4 sm:mx-0 my-2 p-6 rounded-2xl bg-slate-50 dark:bg-[#1a1b22] border border-slate-200/80 dark:border-white/5 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300 flex items-center justify-center mb-3">
            <CheckCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
            You're All Caught Up
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">
            You've explored recent captures from the curators you follow.
          </p>
          <button
            type="button"
            onClick={onOpenExplore}
            className="px-5 py-2.5 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-[#34343c] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Explore Emerging Creators</span>
          </button>
        </div>
      </div>
    </div>
  );
};
