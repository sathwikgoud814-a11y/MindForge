import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../context/SystemContext';

export function GlobalOmniSearch() {
  const { setActiveTab, missions, customEvents, rewards } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K / /)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const siteMapIndex = [
    // Pages
    { id: 'p_cmd', title: 'Command Center Dashboard', path: 'Navigation > Command Center', icon: 'space_dashboard', tab: 'commandCenter' },
    { id: 'p_missions', title: 'Missions & Tactical Directives', path: 'Navigation > Missions', icon: 'task_alt', tab: 'missions' },
    { id: 'p_planner', title: 'Planner & Tactical Schedule', path: 'Navigation > Planner', icon: 'calendar_month', tab: 'planner' },
    { id: 'p_growth', title: 'Growth Report & Telemetry', path: 'Navigation > Growth Report', icon: 'show_chart', tab: 'growth' },
    { id: 'p_character', title: 'Character Profile & Skills', path: 'Navigation > Character Profile', icon: 'person', tab: 'character' },
    { id: 'p_shop', title: 'Reward Shop & Inventory', path: 'Navigation > Reward Shop', icon: 'shopping_bag', tab: 'shop' },
    { id: 'p_hunters', title: 'Hunters Network & Duels Arena', path: 'Navigation > Hunters Network', icon: 'sports_kabaddi', tab: 'hunters' },

    // Character Sections & Settings
    { id: 's_account', title: 'Account & Identity Settings', path: 'Character > Settings > Account', icon: 'manage_accounts', tab: 'character' },
    { id: 's_theme', title: 'System Appearance & Theme Mode', path: 'Character > Settings > Appearance', icon: 'contrast', tab: 'character' },
    { id: 's_calendar', title: 'Planner & Calendar Preferences', path: 'Character > Settings > Calendar', icon: 'event_note', tab: 'character' },
    { id: 's_attrs', title: 'Character Attribute Growth Matrix', path: 'Character > Attributes Matrix', icon: 'monitoring', tab: 'character' },
    { id: 's_tree', title: 'Career Skill Tree Visualization', path: 'Character > Skill Tree', icon: 'account_tree', tab: 'character' },

    // Planner Sections
    { id: 's_chamber', title: 'Deep Work Focus Chamber', path: 'Planner > Focus Chamber', icon: 'timer', tab: 'planner' },
    { id: 's_ai_opt', title: 'AI Schedule Optimizer', path: 'Planner > AI Optimizer', icon: 'psychology', tab: 'planner' },
    { id: 's_week_grid', title: 'Week Timeline Grid (Mon - Sun)', path: 'Planner > Week Grid', icon: 'date_range', tab: 'planner' },

    // Hunters Sections
    { id: 's_active_duels', title: 'Active Duels Arena', path: 'Hunters > Active Duels', icon: 'swords', tab: 'hunters' },
    { id: 's_network', title: 'Registered Hunters Directory', path: 'Hunters > Directory', icon: 'groups', tab: 'hunters' },
  ];

  // Dynamic Content (Missions, Events, Rewards)
  const safeMissions = Array.isArray(missions) ? missions : [];
  const safeEvents = Array.isArray(customEvents) ? customEvents : [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];

  const dynamicItems = [
    ...safeMissions.map(m => ({
      id: `m_${m.id}`,
      title: m.name,
      path: `Missions > Directives > ${m.difficulty || 'Directive'}`,
      icon: 'workspace_premium',
      tab: 'missions',
    })),
    ...safeEvents.map(e => ({
      id: `e_${e.id}`,
      title: e.title,
      path: `Planner > Custom Events > ${e.type || 'Event'}`,
      icon: 'event',
      tab: 'planner',
    })),
    ...safeRewards.map(r => ({
      id: `r_${r.id}`,
      title: r.name,
      path: `Reward Shop > Items > ${r.category || 'Reward'}`,
      icon: 'stars',
      tab: 'shop',
    })),
  ];

  const allSearchItems = [...siteMapIndex, ...dynamicItems];

  const searchResults = query.trim() === ''
    ? siteMapIndex.slice(0, 8)
    : allSearchItems.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.path.toLowerCase().includes(q)
        );
      });

  const handleSelectResult = (item) => {
    setActiveTab(item.tab);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Header Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3.5 py-2 rounded-2xl bg-surface-subtle hover:bg-surface-elevated border border-border-subtle hover:border-gold/40 text-primary-muted hover:text-primary font-bold text-xs transition-all flex items-center gap-3 shadow-2xs"
        title="Search pages, sections, and directives (Ctrl+K)"
      >
        <span className="material-symbols-outlined text-gold text-lg">search</span>
        <span className="hidden sm:inline">Search site...</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-black text-primary-muted bg-surface rounded border border-border-subtle">
          ⌘K
        </kbd>
      </button>

      {/* Global Search Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-200">
          <div className="apple-card p-4 sm:p-6 max-w-2xl w-full flex flex-col gap-4 shadow-2xl border-2 border-gold relative">
            {/* Input Bar */}
            <div className="flex items-center gap-3 pb-3 border-b border-border-subtle">
              <span className="material-symbols-outlined text-gold text-2xl">search</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, settings, sections, directives..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-extrabold text-primary focus:outline-none placeholder:text-primary-muted/60 font-sans"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-xl text-primary-muted hover:text-primary"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Search Results List */}
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="flex items-center justify-between text-[10px] font-black text-gold uppercase px-2 py-1">
                <span>{query.trim() === '' ? 'Suggested Navigation' : `Search Results (${searchResults.length})`}</span>
                <span>Press ESC to close</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-8 text-primary-muted font-bold">
                  No matching pages or sections found.
                </div>
              ) : (
                searchResults.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectResult(item)}
                    className="p-3 rounded-2xl bg-surface-subtle hover:bg-surface-elevated border border-border-subtle hover:border-gold/50 flex items-center justify-between gap-3 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-surface border border-border-subtle group-hover:border-gold/40">
                        <span className="material-symbols-outlined text-gold text-lg block">{item.icon}</span>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="font-extrabold text-xs text-primary group-hover:text-gold transition-colors">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono text-primary-muted font-semibold mt-0.5">
                          📍 {item.path}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-surface border border-border-subtle text-primary-muted group-hover:text-primary">
                      Go →
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
