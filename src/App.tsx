import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Bell,
  Compass,
  Home,
  LogIn,
  MessageCircle,
  Moon,
  PlusSquare,
  Sparkles,
  Sun,
  User,
} from 'lucide-react';
import type {
  CuratorProfile,
  DirectMessageThread,
  ExploreTile,
  FollowRequest,
  NotificationItem,
  PostItem,
  StoryItem,
  TabId,
  UserProfileData,
} from './types';
import {
  INITIAL_CURATORS,
  INITIAL_DM_THREADS,
  INITIAL_EXPLORE_TILES,
  INITIAL_FEED_POSTS,
  INITIAL_FOLLOW_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE_POSTS,
  INITIAL_STORIES,
  INITIAL_USER,
} from './data/luminaData';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { CreatePostView } from './components/CreatePostView';
import { ActivityView } from './components/ActivityView';
import { ProfileView } from './components/ProfileView';
import { ImageWithFallback } from './components/ImageWithFallback';
import {
  AuthModal,
  CommentsModal,
  DirectMessagesDrawer,
  EditProfileModal,
  InsightsModal,
  LightboxModal,
  StoryViewerModal,
} from './components/Modals';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home-feed');
  const [isDark, setIsDark] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('lumina_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<UserProfileData>(() => {
    try {
      const saved = window.localStorage.getItem('lumina_user');
      return saved ? (JSON.parse(saved) as UserProfileData) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });
  const [stories, setStories] = useState<StoryItem[]>(INITIAL_STORIES);
  const [feedPosts, setFeedPosts] = useState<PostItem[]>(INITIAL_FEED_POSTS);
  const [profilePosts, setProfilePosts] = useState<PostItem[]>(INITIAL_PROFILE_POSTS);
  const [exploreTiles, setExploreTiles] = useState<ExploreTile[]>(INITIAL_EXPLORE_TILES);
  const [curators, setCurators] = useState<CuratorProfile[]>(INITIAL_CURATORS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>(INITIAL_FOLLOW_REQUESTS);
  const [dmThreads, setDmThreads] = useState<DirectMessageThread[]>(INITIAL_DM_THREADS);

  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [lightboxTarget, setLightboxTarget] = useState<
    { type: 'post'; id: string } | { type: 'tile'; id: string } | null
  >(null);
  const [isDmOpen, setIsDmOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    try {
      window.localStorage.setItem('lumina_logged_in', String(isLoggedIn));
    } catch {
      // ignore storage errors
    }
  }, [isLoggedIn]);

  useEffect(() => {
    try {
      window.localStorage.setItem('lumina_user', JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const showToast = (message: string) => {
    setToast(message);
  };

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => n.unread).length + followRequests.length,
    [notifications, followRequests]
  );

  const unreadDmCount = useMemo(
    () => dmThreads.filter((d) => d.unread).length,
    [dmThreads]
  );

  const handleTabSelect = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'activity') {
      setNotifications((prev) => prev.map((n) => (n.unread ? { ...n, unread: false } : n)));
    }
  };

  const togglePostLike = (postId: string) => {
    const updater = (list: PostItem[]) =>
      list.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      );
    setFeedPosts(updater);
    setProfilePosts(updater);
  };

  const togglePostSave = (postId: string) => {
    let savedNow = false;
    const updater = (list: PostItem[]) =>
      list.map((p) => {
        if (p.id === postId) {
          savedNow = !p.isSaved;
          return { ...p, isSaved: savedNow };
        }
        return p;
      });
    setFeedPosts(updater);
    setProfilePosts(updater);
    showToast(savedNow ? 'Saved to your collection' : 'Removed from saved');
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      text,
      timestamp: 'Just now',
    };
    const updater = (list: PostItem[]) =>
      list.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    setFeedPosts(updater);
    setProfilePosts(updater);
  };

  const handleSharePost = (post: PostItem) => {
    const shareUrl = `https://lumina.studio/p/${post.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).catch(() => undefined);
    }
    showToast(`Copied link to @${post.authorHandle}'s post`);
  };

  const handleFollowCreatorHandle = (handle: string) => {
    setCurators((prev) =>
      prev.map((c) => (c.handle === handle ? { ...c, isFollowing: true } : c))
    );
    showToast(`Following @${handle}`);
  };

  const handleToggleFollowCurator = (id: string) => {
    let targetHandle = '';
    let nowFollowing = false;
    setCurators((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          targetHandle = c.handle;
          nowFollowing = !c.isFollowing;
          return { ...c, isFollowing: nowFollowing };
        }
        return c;
      })
    );
    if (targetHandle) {
      setUser((u) => ({
        ...u,
        followingCount: nowFollowing ? u.followingCount + 1 : Math.max(0, u.followingCount - 1),
      }));
      showToast(nowFollowing ? `Following @${targetHandle}` : `Unfollowed @${targetHandle}`);
    }
  };

  const handleToggleSaveTile = (tileId: string) => {
    let savedNow = false;
    setExploreTiles((prev) =>
      prev.map((t) => {
        if (t.id === tileId) {
          savedNow = !t.isSaved;
          return { ...t, isSaved: savedNow };
        }
        return t;
      })
    );
    showToast(savedNow ? 'Saved frame to Profile' : 'Removed from saved');
  };

  const handleToggleLikeTile = (tileId: string) => {
    setExploreTiles((prev) =>
      prev.map((t) =>
        t.id === tileId
          ? {
              ...t,
              isLiked: !t.isLiked,
              likes: t.isLiked ? t.likes - 1 : t.likes + 1,
            }
          : t
      )
    );
  };

  const handlePublishPost = (newPost: PostItem) => {
    setFeedPosts((prev) => [newPost, ...prev]);
    setProfilePosts((prev) => [newPost, ...prev]);
    setUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    setActiveTab('home-feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Published to your feed & profile');
  };

  const handleToggleFollowNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFollowing: !n.isFollowing } : n))
    );
  };

  const handleReplyNotification = (id: string, reply: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, replyText: reply } : n))
    );
    showToast('Reply sent');
  };

  const handleResolveRequest = (id: string, approved: boolean) => {
    const req = followRequests.find((r) => r.id === id);
    setFollowRequests((prev) => prev.filter((r) => r.id !== id));
    if (req) {
      showToast(approved ? `Approved @${req.handle}` : `Declined @${req.handle}`);
    }
  };

  const handleMarkStoryViewed = (storyId: string) => {
    setStories((prev) => prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s)));
  };

  const handleSendStoryReply = (handle: string, text: string) => {
    setDmThreads((prev) => {
      const existing = prev.find((t) => t.handle === handle);
      if (existing) {
        return prev.map((t) =>
          t.id === existing.id
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  { id: `m-${Date.now()}`, sender: 'me', text, time: 'Just now' },
                ],
              }
            : t
        );
      }
      return prev;
    });
    showToast(`Reply sent to @${handle}`);
  };

  const handleSelectDmThread = (threadId: string) => {
    setDmThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, unread: false } : t)));
  };

  const handleSendDmMessage = (threadId: string, text: string) => {
    setDmThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              unread: false,
              messages: [
                ...t.messages,
                { id: `m-${Date.now()}`, sender: 'me', text, time: 'Just now' },
              ],
            }
          : t
      )
    );
  };

  // Saved posts combined from feed, profile, and bookmarked explore tiles
  const savedPosts = useMemo(() => {
    const map = new Map<string, PostItem>();
    [...feedPosts, ...profilePosts].forEach((p) => {
      if (p.isSaved && !map.has(p.id)) {
        map.set(p.id, p);
      }
    });
    exploreTiles.forEach((tile) => {
      if (tile.isSaved && !map.has(tile.id)) {
        map.set(tile.id, {
          id: tile.id,
          authorHandle: tile.creator.replace(/^@/, ''),
          authorName: tile.creator.replace(/^@/, ''),
          authorAvatar: tile.image,
          location: tile.category,
          images: [tile.image],
          caption: tile.title,
          tags: [tile.category.toLowerCase().replace(/\s+/g, '')],
          likes: tile.likes,
          isLiked: Boolean(tile.isLiked),
          isSaved: true,
          comments: [],
          timestamp: 'Saved',
          exif: tile.exif,
          isReel: tile.isReel,
          views: tile.views,
        });
      }
    });
    return Array.from(map.values());
  }, [feedPosts, profilePosts, exploreTiles]);

  const activeCommentsPost = useMemo(() => {
    if (!commentsPostId) return null;
    return (
      feedPosts.find((p) => p.id === commentsPostId) ||
      profilePosts.find((p) => p.id === commentsPostId) ||
      null
    );
  }, [commentsPostId, feedPosts, profilePosts]);

  const activeLightboxPost = useMemo(() => {
    if (!lightboxTarget || lightboxTarget.type !== 'post') return null;
    return (
      feedPosts.find((p) => p.id === lightboxTarget.id) ||
      profilePosts.find((p) => p.id === lightboxTarget.id) ||
      savedPosts.find((p) => p.id === lightboxTarget.id) ||
      null
    );
  }, [lightboxTarget, feedPosts, profilePosts, savedPosts]);

  const activeLightboxTile = useMemo(() => {
    if (!lightboxTarget || lightboxTarget.type !== 'tile') return null;
    return exploreTiles.find((t) => t.id === lightboxTarget.id) || null;
  }, [lightboxTarget, exploreTiles]);

  const navItems: {
    id: TabId;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home-feed', label: 'Feed', Icon: Home },
    { id: 'explore', label: 'Explore', Icon: Compass },
    { id: 'create-post', label: 'Create', Icon: PlusSquare },
    { id: 'activity', label: 'Activity', Icon: Bell, badge: unreadNotifications },
    { id: 'user-profile', label: 'Profile', Icon: User },
  ];

  const mainMaxWidth =
    activeTab === 'explore' || activeTab === 'create-post'
      ? 'max-w-5xl'
      : activeTab === 'user-profile'
      ? 'max-w-4xl'
      : 'max-w-2xl';

  return (
    <div className="min-h-screen bg-white dark:bg-[#12131a] text-slate-900 dark:text-slate-100 transition-colors duration-200 flex">
      {/* Desktop Persistent Left Navigation Rail */}
      <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 flex-shrink-0 border-r border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#15161e] sticky top-0 h-screen px-4 py-6">
        <div className="flex flex-col gap-6">
          <button
            type="button"
            onClick={() => handleTabSelect('home-feed')}
            className="flex items-center gap-2.5 px-3 text-left"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff516a] via-[#8455ef] to-[#ffb95f] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-editorial text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              LUMINA
            </span>
          </button>

          <nav aria-label="Primary navigation" className="flex flex-col gap-1.5">
            {navItems.map(({ id, label, Icon, badge }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabSelect(id)}
                  className={`w-full h-12 px-3.5 rounded-2xl flex items-center justify-between text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff516a]/15 to-[#8455ef]/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </span>
                  {badge !== undefined && badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold tabular-nums">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsDmOpen(true)}
              className="w-full h-12 px-3.5 rounded-2xl flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all"
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </span>
              {unreadDmCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white text-[11px] font-bold tabular-nums">
                  {unreadDmCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              className="flex-1 h-10 px-3 rounded-xl bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-[#292931]"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-violet-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Account session"
                className="h-10 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5 hover:bg-emerald-500/20 whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Signed In</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Login"
                className="h-10 px-3 rounded-xl bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:bg-slate-100 dark:hover:bg-[#292931] whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 text-rose-500" />
                <span>Login</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleTabSelect('user-profile')}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#1e1f26] border border-slate-200/80 dark:border-white/5 text-left hover:border-rose-500/40 transition-colors"
          >
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isLoggedIn && (
                <span
                  aria-label="Active session"
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1e1f26]"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </p>
                <BadgeCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                @{user.handle} {isLoggedIn ? '· Active' : ''}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-6">
        {/* Mobile Compact Sticky Header */}
        <header className="lg:hidden sticky top-0 z-30 h-14 px-4 bg-white/90 dark:bg-[#12131a]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between pt-safe">
          <button
            type="button"
            onClick={() => handleTabSelect('home-feed')}
            className="flex items-center gap-2"
          >
            <span className="font-editorial text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              LUMINA
            </span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-violet-600" />
              )}
            </button>

            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Signed in account"
                className="h-9 pl-1.5 pr-3 rounded-full bg-slate-100 dark:bg-[#1e1f26] border border-emerald-500/30 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#292931]"
              >
                <span className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.handle}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1e1f26]" />
                </span>
                <span className="max-w-[96px] truncate">@{user.handle}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                aria-label="Login"
                className="h-9 px-3 rounded-full bg-slate-100 dark:bg-[#1e1f26] border border-slate-200/80 dark:border-white/10 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#292931]"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-500" />
                <span>Login</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDmOpen(true)}
              aria-label="Open direct messages"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <MessageCircle className="w-5 h-5" />
              {unreadDmCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {unreadDmCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Centered Screen Stage + Optional Desktop Right Discovery Rail */}
        <div className="flex-1 w-full flex justify-center gap-8 px-0 sm:px-4 lg:px-8 pt-0 lg:pt-4">
          <main className={`w-full ${mainMaxWidth} min-w-0`}>
            {activeTab === 'home-feed' && (
              <FeedView
                posts={feedPosts}
                stories={stories}
                onToggleLike={togglePostLike}
                onToggleSave={togglePostSave}
                onOpenComments={(post) => setCommentsPostId(post.id)}
                onOpenStory={(idx) => setActiveStoryIndex(idx)}
                onAddStory={() => handleTabSelect('create-post')}
                onOpenExplore={() => handleTabSelect('explore')}
                onOpenLightbox={(post) => setLightboxTarget({ type: 'post', id: post.id })}
                onSharePost={handleSharePost}
                onFollowCreator={handleFollowCreatorHandle}
              />
            )}

            {activeTab === 'explore' && (
              <ExploreView
                tiles={exploreTiles}
                curators={curators}
                onToggleSaveTile={handleToggleSaveTile}
                onSelectTile={(tile) => setLightboxTarget({ type: 'tile', id: tile.id })}
                onToggleFollowCurator={handleToggleFollowCurator}
              />
            )}

            {activeTab === 'create-post' && (
              <CreatePostView
                user={user}
                onCancel={() => handleTabSelect('home-feed')}
                onPublishPost={handlePublishPost}
              />
            )}

            {activeTab === 'activity' && (
              <ActivityView
                notifications={notifications}
                followRequests={followRequests}
                onToggleFollowNotification={handleToggleFollowNotification}
                onReplyNotification={handleReplyNotification}
                onResolveRequest={handleResolveRequest}
                onOpenInsights={() => setIsInsightsOpen(true)}
              />
            )}

            {activeTab === 'user-profile' && (
              <ProfileView
                user={user}
                posts={profilePosts}
                savedPosts={savedPosts}
                highlights={stories}
                isDark={isDark}
                isLoggedIn={isLoggedIn}
                onToggleTheme={() => setIsDark((d) => !d)}
                onEditProfile={() => setIsEditProfileOpen(true)}
                onShareProfile={() => {
                  if (navigator.clipboard?.writeText) {
                    navigator.clipboard
                      .writeText(`https://${user.website}`)
                      .catch(() => undefined);
                  }
                  showToast(`Copied @${user.handle}'s profile link`);
                }}
                onOpenInsights={() => setIsInsightsOpen(true)}
                onOpenStory={(idx) => setActiveStoryIndex(idx)}
                onOpenCreate={() => handleTabSelect('create-post')}
                onSelectPost={(post) => setLightboxTarget({ type: 'post', id: post.id })}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            )}
          </main>

          {/* Desktop Right Discovery Rail on Home Feed */}
          {activeTab === 'home-feed' && (
            <aside className="hidden xl:flex flex-col gap-5 w-80 flex-shrink-0 pt-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1b22] border border-slate-200/80 dark:border-white/5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Rising Curators
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleTabSelect('explore')}
                    className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    Explore all
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {curators.map((curator) => (
                    <div
                      key={curator.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ImageWithFallback
                          src={curator.avatar}
                          alt={curator.handle}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            @{curator.handle}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {curator.specialty} · {curator.followers}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleFollowCurator(curator.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0 ${
                          curator.isFollowing
                            ? 'bg-slate-200 dark:bg-[#292931] text-slate-700 dark:text-slate-200'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        {curator.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-violet-500/10 to-amber-500/10 border border-slate-200/80 dark:border-white/5 flex flex-col gap-2.5">
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Studio Darkroom
                </p>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Publish your 35mm roll
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Grade shadows, pair ambient tracks, and publish carousels straight to your curated grid.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabSelect('create-post')}
                  className="mt-1 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Open Studio Editor
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile Bottom 5-Tab Navigation Bar */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#12131a]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-white/5 pb-safe"
      >
        <div className="h-16 grid grid-cols-5 items-center px-2">
          {navItems.map(({ id, label, Icon, badge }) => {
            const isActive = activeTab === id;
            const isProfile = id === 'user-profile';
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabSelect(id)}
                className={`relative h-12 flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isProfile ? (
                  <span
                    className={`w-6 h-6 rounded-full overflow-hidden ring-2 ${
                      isActive ? 'ring-rose-500' : 'ring-transparent'
                    }`}
                  >
                    <ImageWithFallback
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </span>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-[10px] font-semibold leading-none">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="absolute top-1.5 right-3 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Toast Notification Pill */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-xl border border-white/10 dark:border-slate-200 whitespace-nowrap"
        >
          {toast}
        </div>
      )}

      {/* Interactive Modals & Drawers */}
      <CommentsModal
        post={activeCommentsPost}
        currentUser={user}
        onClose={() => setCommentsPostId(null)}
        onAddComment={handleAddComment}
      />

      <StoryViewerModal
        stories={stories}
        activeIndex={activeStoryIndex}
        onChangeIndex={setActiveStoryIndex}
        onClose={() => setActiveStoryIndex(null)}
        onMarkViewed={handleMarkStoryViewed}
        onSendReply={handleSendStoryReply}
      />

      <LightboxModal
        post={activeLightboxPost}
        tile={activeLightboxTile}
        onClose={() => setLightboxTarget(null)}
        onToggleLikePost={togglePostLike}
        onToggleSavePost={togglePostSave}
        onToggleLikeTile={handleToggleLikeTile}
        onToggleSaveTile={handleToggleSaveTile}
        onOpenComments={(post) => setCommentsPostId(post.id)}
      />

      <DirectMessagesDrawer
        isOpen={isDmOpen}
        threads={dmThreads}
        onClose={() => setIsDmOpen(false)}
        onSelectThread={handleSelectDmThread}
        onSendMessage={handleSendDmMessage}
      />

      <InsightsModal
        isOpen={isInsightsOpen}
        user={user}
        onClose={() => setIsInsightsOpen(false)}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        user={user}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={(updates) => {
          setUser((prev) => ({ ...prev, ...updates }));
          showToast('Profile updated');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        isLoggedIn={isLoggedIn}
        user={user}
        curators={curators}
        onClose={() => setIsAuthOpen(false)}
        onToggleFollowCurator={handleToggleFollowCurator}
        onCompleteAuth={(updates, message) => {
          setUser((prev) => ({ ...prev, ...updates }));
          setIsLoggedIn(true);
          setIsAuthOpen(false);
          showToast(message);
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsAuthOpen(false);
          showToast('Signed out');
        }}
      />
    </div>
  );
}
