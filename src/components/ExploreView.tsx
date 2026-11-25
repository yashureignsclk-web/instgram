import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  ChevronRight,
  Film,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import type { CuratorProfile, ExploreTile } from '../types';
import { EXPLORE_CATEGORIES } from '../data/luminaData';
import { ImageWithFallback } from './ImageWithFallback';

interface ExploreViewProps {
  tiles: ExploreTile[];
  curators: CuratorProfile[];
  onToggleSaveTile: (id: string) => void;
  onSelectTile: (tile: ExploreTile) => void;
  onToggleFollowCurator: (id: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  tiles,
  curators,
  onToggleSaveTile,
  onSelectTile,
  onToggleFollowCurator,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('For You');
  const [showFilters, setShowFilters] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'reels' | 'stills'>('all');
  const [showAllCurators, setShowAllCurators] = useState(false);

  const filteredTiles = useMemo(() => {
    return tiles.filter((tile) => {
      const matchesCat =
        selectedCategory === 'For You' || tile.category === selectedCategory;
      const matchesMedia =
        mediaFilter === 'all' ||
        (mediaFilter === 'reels' && tile.isReel) ||
        (mediaFilter === 'stills' && !tile.isReel);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        tile.title.toLowerCase().includes(q) ||
        tile.creator.toLowerCase().includes(q) ||
        tile.category.toLowerCase().includes(q);
      return matchesCat && matchesMedia && matchesQuery;
    });
  }, [tiles, selectedCategory, mediaFilter, query]);

  const filteredCurators = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return curators;
    return curators.filter(
      (c) =>
        c.handle.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.specialty.toLowerCase().includes(q)
    );
  }, [curators, query]);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Search & Category Hub */}
      <div className="sticky top-14 lg:top-0 z-20 px-4 sm:px-6 py-3 bg-white/90 dark:bg-[#12131a]/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 flex items-center bg-slate-100 dark:bg-[#1a1b22] rounded-full px-4 py-2 border border-slate-200/80 dark:border-white/10 focus-within:border-rose-500 transition-colors">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators, aesthetics, tags..."
              className="w-full bg-transparent pl-2.5 pr-2 py-0.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Filter media type"
            onClick={() => setShowFilters((s) => !s)}
            className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full border transition-colors ${
              showFilters || mediaFilter !== 'all'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-slate-100 dark:bg-[#1a1b22] text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-[#292931]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Optional Media Type Segmented Filter */}
        {showFilters && (
          <div className="flex items-center gap-2 pt-2.5">
            {(['all', 'stills', 'reels'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMediaFilter(type)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  mediaFilter === type
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-[#1e1f26] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {type === 'all' ? 'All Media' : type === 'reels' ? 'Motion Reels' : '35mm & Stills'}
              </button>
            ))}
          </div>
        )}

        {/* Aesthetic Categories */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 pb-0.5">
          {EXPLORE_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'text-white bg-gradient-to-r from-[#ff516a] via-[#8455ef] to-[#ca8100] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1e1f26] hover:bg-slate-200 dark:hover:bg-[#292931]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Spotlight Header */}
      <div className="px-4 sm:px-6 pt-4 pb-3 flex items-center justify-between text-xs">
        <span className="font-semibold text-rose-600 dark:text-rose-400">
          Curated Pulse · {selectedCategory}
        </span>
        <span className="text-slate-500 dark:text-slate-400 tabular-nums">
          {filteredTiles.length} frame{filteredTiles.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Dynamic Exploration Bento Grid */}
      {filteredTiles.length === 0 ? (
        <div className="mx-4 sm:mx-6 py-14 rounded-2xl bg-slate-50 dark:bg-[#1a1b22] border border-slate-200/80 dark:border-white/5 flex flex-col items-center text-center px-4">
          <Sparkles className="w-8 h-8 text-slate-400 mb-2" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No matching frames
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Try clearing your search or switching back to For You.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory('For You');
              setMediaFilter('all');
            }}
            className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="px-3 sm:px-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 auto-rows-[120px] sm:auto-rows-[155px]">
          {filteredTiles.map((tile) => {
            const spanClass =
              tile.span === '2x2'
                ? 'col-span-2 row-span-2'
                : tile.span === '1x2'
                ? 'row-span-2'
                : 'row-span-1';

            return (
              <div
                key={tile.id}
                onClick={() => onSelectTile(tile)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTile(tile);
                  }
                }}
                className={`relative ${spanClass} rounded-xl overflow-hidden bg-slate-200 dark:bg-[#1e1f26] group cursor-pointer active:scale-[0.98] transition-transform focus-visible:outline-2 focus-visible:outline-rose-500`}
              >
                <ImageWithFallback
                  src={tile.image}
                  alt={tile.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                {tile.isReel ? (
                  <>
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold">
                      <Film className="w-3.5 h-3.5 text-rose-400" />
                      <span>Curator's Pick</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-rose-300 text-xs font-semibold tabular-nums">
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{tile.views}</span>
                        </div>
                        <h4 className="text-base font-bold text-white truncate mt-0.5">
                          {tile.title}
                        </h4>
                        <p className="text-xs text-slate-200 truncate">{tile.subtitle}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Save reel"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveTile(tile.id);
                        }}
                        className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-colors flex-shrink-0 ${
                          tile.isSaved
                            ? 'bg-amber-500 text-white'
                            : 'bg-black/50 text-white hover:bg-black/75'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${tile.isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold block truncate">{tile.title}</span>
                      {tile.subtitle && (
                        <span className="text-[11px] text-slate-300 block truncate">
                          {tile.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rising Curators Section */}
      <section className="px-4 sm:px-6 mt-6">
        <div className="bg-slate-50 dark:bg-[#1a1b22] border border-slate-200/80 dark:border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  Rising Curators
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nocturnal street & analog photography
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAllCurators((prev) => !prev)}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-0.5 hover:underline whitespace-nowrap"
            >
              <span>{showAllCurators ? 'Collapse' : 'See all'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            className={
              showAllCurators
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
                : 'flex items-center gap-4 overflow-x-auto no-scrollbar pb-1'
            }
          >
            {filteredCurators.map((curator) =>
              showAllCurators ? (
                <div
                  key={curator.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#292931] border border-slate-200/80 dark:border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-rose-500 via-violet-500 to-amber-500 flex-shrink-0">
                      <ImageWithFallback
                        src={curator.avatar}
                        alt={curator.handle}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        @{curator.handle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {curator.specialty} · {curator.followers}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleFollowCurator(curator.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0 ${
                      curator.isFollowing
                        ? 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {curator.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ) : (
                <button
                  key={curator.id}
                  type="button"
                  onClick={() => onToggleFollowCurator(curator.id)}
                  className="flex flex-col items-center flex-shrink-0 w-18 text-center group"
                >
                  <div
                    className={`relative w-14 h-14 rounded-full p-[2px] ${
                      curator.isFollowing
                        ? 'bg-slate-300 dark:bg-slate-700'
                        : 'bg-gradient-to-tr from-rose-500 via-violet-500 to-amber-500'
                    }`}
                  >
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                      <ImageWithFallback
                        src={curator.avatar}
                        alt={curator.handle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1.5 truncate w-full">
                    @{curator.handle}
                  </span>
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    {curator.isFollowing ? 'Following' : 'Follow'}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
