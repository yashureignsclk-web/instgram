import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Expand,
  Layers,
  MapPin,
  Music,
  RefreshCw,
  Sparkles,
  UserPlus,
  Wand2,
  X,
} from 'lucide-react';
import type { AspectRatio, AudioTrack, PostItem, UserProfileData } from '../types';
import { FILTER_PRESETS, RECENTS_GALLERY } from '../data/luminaData';
import { ImageWithFallback } from './ImageWithFallback';

interface CreatePostViewProps {
  user: UserProfileData;
  onCancel: () => void;
  onPublishPost: (post: PostItem) => void;
}

const CAPTION_SUGGESTIONS = [
  'Tokyo after midnight: refracted light and quiet footsteps on drenched asphalt.',
  'Between silence and shutter drag in Shibuya crossing at 01:15.',
  'Nocturne palette: 35mm reflections, warm tungsten, and rain-washed stone.',
  'Four o’clock geometry before the streetlamps take over.',
];

const AUDIO_OPTIONS: (AudioTrack | null)[] = [
  null,
  { artist: 'M83', title: 'Midnight City', label: 'Selected track' },
  { artist: 'ODESZA', title: 'The Last Goodbye', label: 'Original audio' },
  { artist: 'Nils Frahm', title: 'Says', label: 'Ambient score' },
];

const LOCATIONS = ['Tokyo, Japan', 'Paris, France', 'Berlin, Germany', 'Dolomites, Italy'];

export const CreatePostView: React.FC<CreatePostViewProps> = ({
  user,
  onCancel,
  onPublishPost,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([RECENTS_GALLERY[0].id]);
  const [multiSelect, setMultiSelect] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1/1');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const [activeFilterId, setActiveFilterId] = useState('cyber-neon');
  const [intensity, setIntensity] = useState(75);

  const [caption, setCaption] = useState('');
  const [showCaptionAssistant, setShowCaptionAssistant] = useState(false);
  const [draftIdx, setDraftIdx] = useState(0);

  const [audioIdx, setAudioIdx] = useState(0);
  const [taggedPeople, setTaggedPeople] = useState<string[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [locationIdx, setLocationIdx] = useState(0);

  const primaryItem = useMemo(
    () => RECENTS_GALLERY.find((g) => g.id === selectedIds[0]) || RECENTS_GALLERY[0],
    [selectedIds]
  );

  const activeFilter = useMemo(
    () => FILTER_PRESETS.find((f) => f.id === activeFilterId) || FILTER_PRESETS[0],
    [activeFilterId]
  );

  const computedFilterStyle = useMemo(() => {
    if (activeFilter.css === 'none' || intensity === 0) return 'none';
    const opacityScale = 0.65 + (intensity / 100) * 0.35;
    return `${activeFilter.css} opacity(${opacityScale.toFixed(2)})`;
  }, [activeFilter, intensity]);

  const handleThumbClick = (item: (typeof RECENTS_GALLERY)[number]) => {
    if (!multiSelect) {
      setSelectedIds([item.id]);
      const locMatch = LOCATIONS.findIndex((loc) => loc.includes(item.location.split(',')[0]));
      if (locMatch >= 0) setLocationIdx(locMatch);
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.length > 1 ? prev.filter((id) => id !== item.id) : prev;
      }
      return [...prev.slice(-3), item.id];
    });
  };

  const handleToggleZoom = () => {
    setIsZoomed((z) => !z);
    setShowGrid(true);
    setTimeout(() => setShowGrid(false), 1200);
  };

  const handlePublish = () => {
    const selectedImages = selectedIds
      .map((id) => RECENTS_GALLERY.find((g) => g.id === id)?.src)
      .filter((src): src is string => Boolean(src));

    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      authorHandle: user.handle,
      authorName: user.name,
      authorAvatar: user.avatar,
      verified: true,
      location: LOCATIONS[locationIdx],
      images: selectedImages.length > 0 ? selectedImages : [primaryItem.src],
      aspectRatio,
      filterStyle: computedFilterStyle === 'none' ? undefined : computedFilterStyle,
      filterName: activeFilter.name,
      caption:
        caption.trim() ||
        CAPTION_SUGGESTIONS[draftIdx] ||
        'Captured in natural twilight on 35mm.',
      tags: ['lumina', activeFilter.name.toLowerCase().replace(/\s+/g, '')],
      likes: 1,
      isLiked: true,
      isSaved: false,
      comments: [],
      timestamp: 'Just now',
      exif: '35mm · f/1.4 · 1/125s · ISO 400',
      audio: AUDIO_OPTIONS[audioIdx] || undefined,
    };

    onPublishPost(newPost);
  };

  const tagCandidates = ['marcus_k', 'sophia.vibe', 'elena_art', 'kai_tokyo'];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Studio Sub-Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/95 dark:bg-[#1a1b22]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 sticky top-14 lg:top-0 z-20">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel post"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-[#292931] text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-[#34343c] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">New Post</h1>
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400">
            Studio Editor · {activeFilter.name}
          </span>
        </div>

        <button
          type="button"
          onClick={handlePublish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#ff516a] to-[#ca8100] text-white text-xs font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
        >
          <span>Publish</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Desktop Two-Column Studio / Mobile Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 pt-4">
        {/* Left Column: Canvas & Filter Strip */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Primary Media Canvas */}
          <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 flex items-center justify-center">
            <div
              className={`relative w-full overflow-hidden transition-all duration-300 ${
                aspectRatio === '1/1'
                  ? 'aspect-square max-h-[520px]'
                  : aspectRatio === '4/5'
                  ? 'aspect-[4/5] max-h-[540px]'
                  : 'aspect-video'
              }`}
            >
              <ImageWithFallback
                src={primaryItem.src}
                alt={primaryItem.alt}
                style={{ filter: computedFilterStyle }}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'scale-100'
                }`}
              />

              {/* Aspect Switcher */}
              <div className="absolute top-3 left-3 flex items-center bg-black/65 backdrop-blur-md rounded-full p-0.5 border border-white/10">
                {(['1/1', '4/5', '16/9'] as AspectRatio[]).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    {ratio.replace('/', ':')}
                  </button>
                ))}
              </div>

              {/* Multi-Select & Crop Zoom */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Toggle multi-photo carousel"
                  onClick={() => setMultiSelect((m) => !m)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors ${
                    multiSelect
                      ? 'bg-rose-600 text-white'
                      : 'bg-black/65 text-white hover:bg-black/80'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Toggle crop zoom"
                  onClick={handleToggleZoom}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors ${
                    isZoomed
                      ? 'bg-rose-600 text-white'
                      : 'bg-black/65 text-white hover:bg-black/80'
                  }`}
                >
                  <Expand className="w-4 h-4" />
                </button>
              </div>

              {/* Rule of Thirds Grid */}
              <div
                className={`absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none transition-opacity duration-200 ${
                  showGrid ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div key={idx} className="border border-white/25" />
                ))}
              </div>

              {/* Active Filter Label */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold">
                {activeFilter.name} · {intensity}%
              </div>
            </div>
          </div>

          {/* Filter Presets & Strength */}
          <div className="flex flex-col gap-2.5 bg-slate-50 dark:bg-[#1a1b22] rounded-2xl p-3.5 border border-slate-200/80 dark:border-white/5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-rose-500" />
                Cinematic Profiles
              </span>
              <div className="flex items-center gap-2.5">
                <label
                  htmlFor="filter-strength"
                  className="text-xs text-slate-500 dark:text-slate-400"
                >
                  Strength
                </label>
                <input
                  id="filter-strength"
                  type="range"
                  min={0}
                  max={100}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full accent-rose-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 w-9 text-right tabular-nums">
                  {intensity}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {FILTER_PRESETS.map((preset) => {
                const isActive = preset.id === activeFilterId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActiveFilterId(preset.id)}
                    className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                  >
                    <div
                      className={`w-16 h-16 rounded-xl overflow-hidden transition-transform group-hover:scale-105 ${
                        isActive
                          ? 'p-0.5 bg-gradient-to-tr from-[#ff516a] via-[#8455ef] to-[#ffb95f]'
                          : 'border border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <ImageWithFallback
                        src={primaryItem.src}
                        alt={preset.name}
                        style={{ filter: preset.css }}
                        className="w-full h-full object-cover rounded-[10px]"
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold ${
                        isActive
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Caption, Metadata & Recents Picker */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Caption Editor */}
          <div className="bg-slate-50 dark:bg-[#1a1b22] rounded-2xl p-3.5 border border-slate-200/80 dark:border-white/5 flex flex-col gap-2.5">
            <label
              htmlFor="post-caption"
              className="text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Caption & Story
            </label>
            <textarea
              id="post-caption"
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a note about the lens, light, or moment..."
              className="w-full bg-white dark:bg-[#12131a] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 resize-none"
            />

            {/* Quick Metadata Actions */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              <button
                type="button"
                onClick={() => setShowCaptionAssistant((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 text-xs font-semibold flex-shrink-0 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Draft Caption</span>
              </button>

              <button
                type="button"
                onClick={() => setAudioIdx((i) => (i + 1) % AUDIO_OPTIONS.length)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0 whitespace-nowrap transition-colors ${
                  AUDIO_OPTIONS[audioIdx]
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                    : 'bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>
                  {AUDIO_OPTIONS[audioIdx]
                    ? `${AUDIO_OPTIONS[audioIdx]!.title} · ${AUDIO_OPTIONS[audioIdx]!.artist}`
                    : 'Add Track'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowTagPicker((s) => !s)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold flex-shrink-0 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 text-rose-500" />
                <span>Tag ({taggedPeople.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setLocationIdx((i) => (i + 1) % LOCATIONS.length)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold flex-shrink-0 whitespace-nowrap"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{LOCATIONS[locationIdx]}</span>
              </button>
            </div>

            {/* Caption Draft Card */}
            {showCaptionAssistant && (
              <div className="p-3 rounded-xl bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-violet-600 dark:text-violet-300">
                    Suggested Caption
                  </span>
                  <button
                    type="button"
                    aria-label="Close caption suggestions"
                    onClick={() => setShowCaptionAssistant(false)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 italic">
                  "{CAPTION_SUGGESTIONS[draftIdx]}"
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCaption(CAPTION_SUGGESTIONS[draftIdx]);
                      setShowCaptionAssistant(false);
                    }}
                    className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Use Caption
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftIdx((i) => (i + 1) % CAPTION_SUGGESTIONS.length)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              </div>
            )}

            {/* Tag People Picker */}
            {showTagPicker && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tagCandidates.map((handle) => {
                  const isTagged = taggedPeople.includes(handle);
                  return (
                    <button
                      key={handle}
                      type="button"
                      onClick={() =>
                        setTaggedPeople((prev) =>
                          prev.includes(handle)
                            ? prev.filter((h) => h !== handle)
                            : [...prev, handle]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        isTagged
                          ? 'bg-rose-600 text-white'
                          : 'bg-white dark:bg-[#292931] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      @{handle}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recents Gallery Picker */}
          <div className="bg-slate-50 dark:bg-[#1a1b22] rounded-2xl p-3.5 border border-slate-200/80 dark:border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Recents
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {selectedIds.length} selected · {RECENTS_GALLERY.length} rolls
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {RECENTS_GALLERY.map((item) => {
                const selectionOrder = selectedIds.indexOf(item.id);
                const isSelected = selectionOrder >= 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleThumbClick(item)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 group ${
                      isSelected ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1b22]' : ''
                    }`}
                  >
                    <ImageWithFallback
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                        {selectionOrder + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
