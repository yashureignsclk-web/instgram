import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  AtSign,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  Play,
  Send,
  UserPlus,
  X,
} from 'lucide-react';
import type { FollowRequest, NotificationItem } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ActivityViewProps {
  notifications: NotificationItem[];
  followRequests: FollowRequest[];
  onToggleFollowNotification: (id: string) => void;
  onReplyNotification: (id: string, reply: string) => void;
  onResolveRequest: (id: string, approved: boolean) => void;
  onOpenInsights: () => void;
}

type ActivityFilter = 'all' | 'mentions' | 'likes' | 'comments';

export const ActivityView: React.FC<ActivityViewProps> = ({
  notifications,
  followRequests,
  onToggleFollowNotification,
  onReplyNotification,
  onResolveRequest,
  onOpenInsights,
}) => {
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [showRequests, setShowRequests] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');

  const filtered = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'mentions') return item.type === 'mention';
      if (filter === 'likes') return item.type === 'like';
      if (filter === 'comments') return item.type === 'comment' || item.type === 'mention';
      return true;
    });
  }, [notifications, filter]);

  const todayItems = filtered.filter((n) => n.section === 'today');
  const weekItems = filtered.filter((n) => n.section === 'week');

  const handleSendReply = (id: string) => {
    if (!replyDraft.trim()) return;
    onReplyNotification(id, replyDraft.trim());
    setReplyDraft('');
    setReplyingToId(null);
  };

  const renderBadgeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3 h-3 text-rose-500 fill-current" />;
      case 'comment':
        return <MessageCircle className="w-3 h-3 text-violet-500 fill-current" />;
      case 'mention':
        return <AtSign className="w-3 h-3 text-violet-500" />;
      case 'follow':
        return <UserPlus className="w-3 h-3 text-amber-500" />;
      default:
        return <BarChart3 className="w-3 h-3 text-violet-500" />;
    }
  };

  const renderRow = (item: NotificationItem) => {
    if (item.type === 'milestone') {
      return (
        <div
          key={item.id}
          onClick={onOpenInsights}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenInsights();
            }
          }}
          className="rounded-xl p-3.5 bg-violet-50 dark:bg-violet-950/30 border border-violet-200/80 dark:border-violet-500/20 flex items-center justify-between gap-3 cursor-pointer hover:bg-violet-100/70 dark:hover:bg-violet-950/45 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                {item.message}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                {item.commentText}
              </p>
              <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-300">
                {item.timestamp}
              </span>
            </div>
          </div>
          <span className="w-9 h-9 rounded-full bg-white dark:bg-[#292931] border border-violet-200 dark:border-white/10 text-slate-900 dark:text-white flex items-center justify-center flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      );
    }

    const isReplyOpen = replyingToId === item.id;

    return (
      <div
        key={item.id}
        className="rounded-xl p-3 bg-white dark:bg-[#1a1b22] border border-slate-200/70 dark:border-white/5 flex flex-col gap-2 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={item.actorAvatar}
                alt={item.actorHandle}
                className="w-11 h-11 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-[#12131a] border border-slate-200 dark:border-white/10 flex items-center justify-center">
                {renderBadgeIcon(item.type)}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm text-slate-900 dark:text-slate-100 leading-snug">
                <span className="font-bold">{item.actorHandle}</span>{' '}
                <span className="text-slate-600 dark:text-slate-300">{item.message}</span>
              </p>
              {item.commentText && (
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                  "{item.commentText}"
                </p>
              )}
              {item.replyText && (
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                  You replied: "{item.replyText}"
                </p>
              )}
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="text-slate-400 dark:text-slate-500">{item.timestamp}</span>
                {item.type === 'comment' && (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingToId(isReplyOpen ? null : item.id);
                      setReplyDraft('');
                    }}
                    className="font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    {isReplyOpen ? 'Cancel' : 'Reply'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {item.type === 'follow' ? (
            <button
              type="button"
              onClick={() => onToggleFollowNotification(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition-colors whitespace-nowrap ${
                item.isFollowing
                  ? 'bg-slate-200 dark:bg-[#34343c] text-slate-800 dark:text-slate-100'
                  : 'bg-gradient-to-r from-[#ff516a] to-[#ca8100] text-white'
              }`}
            >
              {item.isFollowing ? 'Following' : 'Follow Back'}
            </button>
          ) : (
            item.targetImage && (
              <div className="relative flex-shrink-0">
                <ImageWithFallback
                  src={item.targetImage}
                  alt="Activity target"
                  className={`${
                    item.isReel ? 'w-11 h-14' : 'w-11 h-11'
                  } rounded-lg object-cover border border-slate-200/70 dark:border-white/10`}
                />
                {item.isReel && (
                  <span className="absolute bottom-1 right-1 bg-black/70 rounded px-1 py-0.5 text-white">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </span>
                )}
              </div>
            )
          )}
        </div>

        {/* Inline Reply Drawer */}
        {isReplyOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendReply(item.id);
            }}
            className="flex items-center gap-2 pl-14 pt-1"
          >
            <input
              type="text"
              autoFocus
              value={replyDraft}
              onChange={(e) => setReplyDraft(e.target.value)}
              placeholder={`Reply to @${item.actorHandle}...`}
              className="flex-1 min-w-0 bg-slate-100 dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-full px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              aria-label="Send reply"
              className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-rose-700"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full pb-10 px-4 sm:px-6 pt-3">
      {/* Header & Filter Chips */}
      <div className="flex flex-col gap-3 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Activity
          </h1>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
            {filtered.length} updates
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {(['all', 'mentions', 'likes', 'comments'] as ActivityFilter[]).map((tab) => {
            const active = filter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1e1f26] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#292931]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Follow Requests Banner */}
      {followRequests.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowRequests((s) => !s)}
            className="w-full bg-slate-50 dark:bg-[#1a1b22] border border-slate-200/80 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-[#22232c] rounded-xl p-3.5 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center -space-x-2.5 flex-shrink-0">
                {followRequests.slice(0, 3).map((req) => (
                  <ImageWithFallback
                    key={req.id}
                    src={req.avatar}
                    alt={req.handle}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white dark:ring-[#1a1b22]"
                  />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  Follow Requests ·{' '}
                  <span className="text-rose-600 dark:text-rose-400 tabular-nums">
                    {followRequests.length}
                  </span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Approve or decline pending curator accounts
                </p>
              </div>
            </div>
            {showRequests ? (
              <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
            )}
          </button>

          {showRequests && (
            <div className="mt-2 flex flex-col gap-2 pl-2">
              {followRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#1a1b22] border border-slate-200/70 dark:border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ImageWithFallback
                      src={req.avatar}
                      alt={req.handle}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        @{req.handle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {req.mutuals}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onResolveRequest(req.id, true)}
                      aria-label={`Approve ${req.handle}`}
                      className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-rose-700"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => onResolveRequest(req.id, false)}
                      aria-label={`Decline ${req.handle}`}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Today Section */}
      {todayItems.length > 0 && (
        <section className="flex flex-col gap-2 mb-5">
          <div className="flex items-center justify-between py-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Today</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {todayItems.length} recent
            </span>
          </div>
          {todayItems.map(renderRow)}
        </section>
      )}

      {/* This Week Section */}
      {weekItems.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">This Week</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Earlier</span>
          </div>
          {weekItems.map(renderRow)}
        </section>
      )}

      {/* Caught Up Footer */}
      <div className="mt-8 flex flex-col items-center text-center opacity-80">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1a1b22] flex items-center justify-center mb-2 text-rose-500">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          You're all caught up
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          No earlier notifications from the past 30 days
        </p>
      </div>
    </div>
  );
};
