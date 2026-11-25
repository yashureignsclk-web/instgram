export type TabId = 'home-feed' | 'explore' | 'create-post' | 'activity' | 'user-profile';

export type AspectRatio = '1/1' | '4/5' | '16/9';

export interface CommentItem {
  id: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface AudioTrack {
  artist: string;
  title: string;
  label: string;
}

export interface PostItem {
  id: string;
  authorHandle: string;
  authorName: string;
  authorAvatar: string;
  verified?: boolean;
  location: string;
  images: string[];
  aspectRatio?: AspectRatio;
  filterStyle?: string;
  filterName?: string;
  caption: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  comments: CommentItem[];
  timestamp: string;
  audio?: AudioTrack;
  exif?: string;
  isReel?: boolean;
  views?: string;
  isPinned?: boolean;
}

export interface StoryItem {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  media: string;
  caption: string;
  location: string;
  timestamp: string;
  isLive?: boolean;
  isOwn?: boolean;
  viewed?: boolean;
}

export interface ExploreTile {
  id: string;
  title: string;
  subtitle?: string;
  creator: string;
  category: string;
  image: string;
  span: '1x1' | '1x2' | '2x2';
  isReel?: boolean;
  views?: string;
  exif: string;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface CuratorProfile {
  id: string;
  handle: string;
  name: string;
  specialty: string;
  followers: string;
  avatar: string;
  isFollowing: boolean;
  verified?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'milestone';
  section: 'today' | 'week';
  actorHandle: string;
  actorAvatar: string;
  message: string;
  commentText?: string;
  replyText?: string;
  targetImage?: string;
  isReel?: boolean;
  timestamp: string;
  unread?: boolean;
  isFollowing?: boolean;
}

export interface FollowRequest {
  id: string;
  handle: string;
  name: string;
  mutuals: string;
  avatar: string;
}

export interface DirectMessageThread {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  online: boolean;
  unread: boolean;
  messages: { id: string; sender: 'them' | 'me'; text: string; time: string }[];
}

export interface UserProfileData {
  name: string;
  handle: string;
  badge: string;
  role: string;
  bio: string;
  website: string;
  avatar: string;
  postsCount: number;
  followersLabel: string;
  followingCount: number;
}
