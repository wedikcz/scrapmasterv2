import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  Package,
  Wand2,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Plus,
  Zap,
  Globe,
  CornerDownLeft,
  Sparkles,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  ScrapComponent,
  ProjectRecipe,
  ExternalComponent,
  GlobalSearchResult,
  SearchResultType
} from '../types/scrap';
import { searchGlobalHardware } from '../services/globalSearchEngine';
import { EXTERNAL_HARDWARE_DATABASE } from '../data/externalHardwareDb';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface GlobalSearchBarProps {
  userInventory: ScrapComponent[];
  projectRecipes: ProjectRecipe[];
  lang: Language;
  onSelectInventoryPart: (part: ScrapComponent) => void;
  onSelectProjectRecipe: (recipe: ProjectRecipe) => void;
  onAddExternalPartToInventory: (part: ScrapComponent) => void;
  onSearchGroundingRequested: (query: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  userInventory,
  projectRecipes,
  lang,
  onSelectInventoryPart,
  onSelectProjectRecipe,
  onAddExternalPartToInventory,
  onSearchGroundingRequested,
  onNavigateToTab
}) => {
  const t = TRANSLATIONS[lang];
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | SearchResultType>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K / / shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      // Check for Slash '/' when not typing in another input
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Execute multi-target search
  const searchOutput = useMemo(() => {
    return searchGlobalHardware(query, userInventory, projectRecipes, EXTERNAL_HARDWARE_DATABASE);
  }, [query, userInventory, projectRecipes]);

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return searchOutput.results;
    return searchOutput.results.filter(r => r.type === activeFilter);
  }, [searchOutput.results, activeFilter]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleConvertExternalToScrap = (ext: ExternalComponent) => {
    const newScrap: ScrapComponent = {
      id: `salvaged-${ext.id}-${Date.now().toString(36)}`,
      name: ext.name,
      partNumber: ext.partNumber.split('/')[0].trim(),
      category: ext.category,
      packageType: ext.packageType,
      extractedFrom: ext.commonSources.split(',')[0].trim(),
      condition: 'working',
      quantity: 1,
      pinCount: ext.pinCount,
      pinout: ext.pinout,
      specs: ext.keySpecs,
      testProcedure: ext.salvageTips || 'Standard continuity & voltage test.',
      salvageValueEstimate: ext.typicalSalvagePrice,
      hazardLevel: 'safe',
      dateAdded: new Date().toISOString().split('T')[0],
      notes: `Získáno z externí hardware databáze. Ekvivalenty: ${ext.equivalents.join(', ')}`
    };
    onAddExternalPartToInventory(newScrap);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl mx-2">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-sky-400/80" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="w-full pl-9 pr-16 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-sans shadow-inner"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors"
              title="Vymazat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded shadow-xs">
              {t.searchShortcut}
            </kbd>
          )}
        </div>
      </div>

      {/* Floating Results Flyout Menu */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950/98 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-[82vh] flex flex-col">
          {/* Categorised Filter Bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/80 border-b border-slate-800/80 text-[11px] overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeFilter === 'all'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{t.searchAll}</span>
              <span className="opacity-80 text-[10px]">({searchOutput.totalMatches})</span>
            </button>

            <button
              onClick={() => setActiveFilter('inventory')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'inventory'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.searchInventoryTab}</span>
              <span className="opacity-80 text-[10px]">({searchOutput.inventoryCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('recipe')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'recipe'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.searchRecipesTab}</span>
              <span className="opacity-80 text-[10px]">({searchOutput.recipeCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('external_db')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'external_db'
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{t.searchExternalDbTab}</span>
              <span className="opacity-80 text-[10px]">({searchOutput.externalDbCount})</span>
            </button>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[58vh] divide-y divide-slate-900/60">
            {filteredResults.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Info className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  {t.searchNoResults} <span className="text-sky-400 font-semibold">"{query}"</span>
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      onSearchGroundingRequested(query);
                      setIsOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-800/80 rounded-xl text-xs font-mono text-sky-300 transition-colors cursor-pointer shadow-sm"
                  >
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.searchOnlineGrounding}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              filteredResults.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl hover:bg-slate-900/90 transition-all border border-transparent hover:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left: Info & Details */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-0.5 p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                      {item.type === 'inventory' && <Package className="w-4 h-4 text-emerald-400" />}
                      {item.type === 'recipe' && <Zap className="w-4 h-4 text-amber-400" />}
                      {item.type === 'external_db' && <Cpu className="w-4 h-4 text-purple-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                          {item.title}
                        </h4>

                        {/* Category & Badge */}
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                            item.type === 'inventory'
                              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
                              : item.type === 'recipe'
                              ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                              : 'bg-purple-950/70 border-purple-800 text-purple-300'
                          }`}
                        >
                          {item.badge}
                        </span>

                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>

                      {/* Matched Fields Tags */}
                      {item.matchedFields.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {item.matchedFields.slice(0, 3).map((field, i) => (
                            <span
                              key={i}
                              className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-900/90 text-sky-400/90 rounded border border-slate-800"
                            >
                              ✓ {field}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {/* INVENTORY ACTIONS */}
                    {item.type === 'inventory' && (
                      <>
                        <button
                          onClick={() => {
                            onSelectInventoryPart(item.data as ScrapComponent);
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/80 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Navrhnout zapojení s touto součástkou"
                        >
                          <Wand2 className="w-3 h-3 text-sky-400" />
                          <span>{t.searchBuildWithThis}</span>
                        </button>

                        {onNavigateToTab && (
                          <button
                            onClick={() => {
                              onNavigateToTab('inventory');
                              setIsOpen(false);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Otevřít v Šrotovišti"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}

                    {/* PROJECT RECIPE ACTIONS */}
                    {item.type === 'recipe' && (
                      <>
                        <button
                          onClick={() => {
                            onSelectProjectRecipe(item.data as ProjectRecipe);
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800/80 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Otevřít kompletní plány a firmware"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Otevřít stavbu</span>
                        </button>
                      </>
                    )}

                    {/* EXTERNAL DB ACTIONS */}
                    {item.type === 'external_db' && (
                      <>
                        <button
                          onClick={() => {
                            handleConvertExternalToScrap(item.data as ExternalComponent);
                            setIsOpen(false);
                          }}
                          className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          title="Přidat přímo do vašeho šrotoviště"
                        >
                          <Plus className="w-3 h-3 text-emerald-400" />
                          <span>{t.searchQuickAdd}</span>
                        </button>

                        {(item.data as ExternalComponent).datasheetUrl && (
                          <a
                            href={(item.data as ExternalComponent).datasheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-purple-300 hover:bg-slate-800 rounded-lg transition-colors"
                            title={t.searchViewDatasheet}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Bar: Online Grounding & Navigation Shortcuts */}
          <div className="px-3 py-2 bg-slate-900/95 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <button
              onClick={() => {
                onSearchGroundingRequested(query);
                setIsOpen(false);
              }}
              className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.searchOnlineGrounding}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>

            <div className="flex items-center gap-3 text-[10px]">
              <span>{t.searchHintNav}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded">Esc</kbd>
                <span>{t.searchHintEsc}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
