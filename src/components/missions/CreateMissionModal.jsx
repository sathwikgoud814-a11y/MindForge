import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { analyzeCustomMission, generateRecommendedDirectives } from '../../shared/services/aiEngine';

export function CreateMissionModal() {
  const { character, missions, showCreateMissionModal, setShowCreateMissionModal, createMission, createReward } = useSystem();

  const [activeTab, setActiveTab] = useState('RECOMMENDED'); // 'RECOMMENDED' or 'CUSTOM_AI'
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  // Custom AI Form State
  const [category, setCategory] = useState('Design');
  const [customTitle, setCustomTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const activePendingMissions = (missions || []).filter(m => !m.completed);
  const activeCount = activePendingMissions.length;
  const isMaxReached = activeCount >= 5;

  useEffect(() => {
    let isMounted = true;
    if (showCreateMissionModal) {
      setLoadingRecs(true);
      generateRecommendedDirectives(character)
        .then(res => {
          if (isMounted && Array.isArray(res)) {
            // Filter out any directive titles that are already in active pending missions
            const activeTitles = activePendingMissions.map(m => m.name.toLowerCase());
            const filtered = res.filter(r => !activeTitles.includes(r.name.toLowerCase()));
            setRecommendations(filtered);
          }
        })
        .catch(err => console.warn('[Recommendations Load Error]:', err))
        .finally(() => {
          if (isMounted) setLoadingRecs(false);
        });
    }
    return () => { isMounted = false; };
  }, [showCreateMissionModal, character]);

  if (!showCreateMissionModal) return null;

  const handleAcceptRecommendation = (rec) => {
    if (isMaxReached) {
      alert('Maximum of 5 active directives reached! Please complete existing pending missions first.');
      return;
    }

    const success = createMission({
      name: rec.name,
      difficulty: rec.difficulty,
      estimatedDuration: rec.estimatedDuration,
      xpReward: rec.xpReward,
      dpReward: rec.dpReward,
      isMainMission: rec.isMainMission,
      relatedSkills: rec.relatedSkills,
    });

    if (success !== false) {
      // Remove selected mission from recommendations list and refresh with a fresh replacement
      setRecommendations(prev => {
        const filtered = prev.filter(r => r.id !== rec.id && r.name !== rec.name);
        const career = character?.primaryCareer || 'Software Engineer';
        const freshReplacements = [
          { id: 'rep_' + Date.now(), name: `45-Minute ${career} Technical Refactoring`, difficulty: 'A-Rank', estimatedDuration: '45 Mins', xpReward: 105, dpReward: 50, relatedSkills: [career], attributesImproved: ['Knowledge +10 XP', 'Focus +8 XP'] },
          { id: 'rep2_' + Date.now(), name: `60-Minute ${career} Modular Architecture Protocol`, difficulty: 'S-Rank', estimatedDuration: '60 Mins', xpReward: 130, dpReward: 65, relatedSkills: [career], attributesImproved: ['Knowledge +14 XP', 'Focus +10 XP'] },
          { id: 'rep3_' + Date.now(), name: `30-Minute ${career} Skill Conditioning Directive`, difficulty: 'B-Rank', estimatedDuration: '30 Mins', xpReward: 85, dpReward: 40, relatedSkills: [career], attributesImproved: ['Discipline +10 XP', 'Focus +8 XP'] },
        ];
        const existingNames = activePendingMissions.map(m => m.name.toLowerCase());
        const freshChoice = freshReplacements.find(r => !existingNames.includes(r.name.toLowerCase())) || freshReplacements[0];
        return [...filtered, freshChoice];
      });
    }
  };

  const handleReplaceRecommendation = (recId) => {
    const career = character?.primaryCareer || 'Software Engineer';
    const replacements = [
      { id: 'rep_' + Date.now(), name: `45-Minute ${career} Technical Refactoring`, difficulty: 'A-Rank', estimatedDuration: '45 Mins', xpReward: 105, dpReward: 50, relatedSkills: [career], attributesImproved: ['Knowledge +10 XP', 'Focus +8 XP'] },
      { id: 'rep2_' + Date.now(), name: `60-Minute ${career} Modular Architecture Protocol`, difficulty: 'S-Rank', estimatedDuration: '60 Mins', xpReward: 130, dpReward: 65, relatedSkills: [career], attributesImproved: ['Knowledge +14 XP', 'Focus +10 XP'] },
      { id: 'rep3_' + Date.now(), name: `30-Minute ${career} Skill Conditioning Directive`, difficulty: 'B-Rank', estimatedDuration: '30 Mins', xpReward: 85, dpReward: 40, relatedSkills: [career], attributesImproved: ['Discipline +10 XP', 'Focus +8 XP'] },
    ];
    const randomReplacement = replacements[Math.floor(Math.random() * replacements.length)];
    setRecommendations(prev => prev.map(r => r.id === recId ? randomReplacement : r));
  };

  const handleSkipRecommendation = (recId) => {
    setRecommendations(prev => prev.filter(r => r.id !== recId));
  };

  const handleRunAiAnalysis = () => {
    if (!customTitle.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeCustomMission(customTitle, category, character);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleDeployCustomMission = () => {
    if (!aiAnalysis || !aiAnalysis.isGrowth) return;
    if (isMaxReached) {
      alert('Maximum of 5 active directives reached! Please complete existing pending missions first.');
      return;
    }

    createMission({
      name: customTitle,
      difficulty: aiAnalysis.difficulty,
      estimatedDuration: aiAnalysis.estimatedDuration,
      xpReward: aiAnalysis.xpReward,
      dpReward: aiAnalysis.dpReward,
      isMainMission: false,
      relatedSkills: aiAnalysis.relatedSkills,
    });
    setCustomTitle('');
    setAiAnalysis(null);
  };

  const handleAddToRewardShop = () => {
    createReward({
      name: customTitle,
      category: 'Entertainment',
      costDP: 120,
      icon: 'sports_esports',
      description: 'Self-defined comfort reward redirected from Non-Growth Shield.',
    });
    setCustomTitle('');
    setAiAnalysis(null);
    setShowCreateMissionModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="apple-card p-6 md:p-8 max-w-2xl w-full flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
                System Directive Engine
              </span>
              <span className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full ${
                isMaxReached ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gold-light/60 text-gold border border-gold/30'
              }`}>
                Active Directives: {activeCount}/5 Max
              </span>
            </div>
            <h2 className="text-xl font-black text-primary mt-0.5">Deploy New Directive</h2>
          </div>
          <button
            onClick={() => setShowCreateMissionModal(false)}
            className="text-primary-muted hover:text-primary p-1.5 rounded-xl bg-surface-subtle"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Limit Warning Banner if 5 active reached */}
        {isMaxReached && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">warning</span>
            Maximum 5 active directives reached. Complete existing pending missions to accept new directives.
          </div>
        )}

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-subtle rounded-2xl border border-border-subtle text-xs font-extrabold">
          <button
            onClick={() => setActiveTab('RECOMMENDED')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'RECOMMENDED'
                ? 'bg-white text-primary shadow-sm'
                : 'text-primary-muted hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-gold text-base">auto_awesome</span>
            System Recommended Directives
          </button>
          <button
            onClick={() => setActiveTab('CUSTOM_AI')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'CUSTOM_AI'
                ? 'bg-white text-primary shadow-sm'
                : 'text-primary-muted hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-gold text-base">psychology</span>
            Custom AI Analyzer
          </button>
        </div>

        {/* TAB 1: SYSTEM RECOMMENDED DIRECTIVES */}
        {activeTab === 'RECOMMENDED' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-primary">Tailored Directives ({(recommendations || []).length})</span>
              <span className="text-primary-muted">Based on your {character?.primaryCareer || 'Career'} trajectory</span>
            </div>

            {loadingRecs ? (
              <div className="p-8 text-center bg-surface-subtle rounded-2xl border border-border-subtle flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
                <span className="text-xs font-bold text-gold">Synthesizing System Directives...</span>
              </div>
            ) : (recommendations || []).length === 0 ? (
              <div className="p-8 text-center bg-surface-subtle rounded-2xl border border-border-subtle text-xs text-primary-muted">
                All recommended directives deployed! Switch to Custom AI Analyzer to build bespoke missions.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                {(recommendations || []).map(rec => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3 hover:border-gold/40 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md gold-gradient text-white">
                            {rec.difficulty}
                          </span>
                          <span className="text-[10px] font-bold text-primary-muted">{rec.estimatedDuration}</span>
                        </div>
                        <h4 className="font-extrabold text-sm text-primary">{rec.name}</h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-black">
                        <span className="text-primary">+{rec.xpReward} XP</span>
                        <span className="text-gold">+{rec.dpReward} DP</span>
                      </div>
                    </div>

                    {/* Linked Skills & Attributes */}
                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                      <span className="font-bold text-primary-muted uppercase">Linked Impact:</span>
                      {(rec.relatedSkills || []).map(sk => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-white border border-border-subtle font-extrabold text-primary">
                          🎯 {sk}
                        </span>
                      ))}
                      {(rec.attributesImproved || []).map(attr => (
                        <span key={attr} className="px-2 py-0.5 rounded-md bg-gold-light border border-gold/30 font-extrabold text-gold">
                          ⚡ {attr}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border-subtle text-xs">
                      <button
                        onClick={() => handleSkipRecommendation(rec.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-border-subtle font-bold text-primary-muted hover:text-red-600"
                      >
                        Skip ✕
                      </button>
                      <button
                        onClick={() => handleReplaceRecommendation(rec.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-border-subtle font-bold text-primary-muted hover:text-primary"
                      >
                        Replace 🔄
                      </button>
                      <button
                        disabled={isMaxReached}
                        onClick={() => handleAcceptRecommendation(rec)}
                        className={`px-4 py-1.5 rounded-xl text-white font-extrabold shadow-sm transition-all ${
                          isMaxReached ? 'bg-gray-400 cursor-not-allowed' : 'gold-gradient hover:scale-105'
                        }`}
                      >
                        {isMaxReached ? 'Max 5 Reached' : 'Accept Directive ✓'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CUSTOM AI MISSION ANALYZER */}
        {activeTab === 'CUSTOM_AI' && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block font-bold text-primary mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle font-bold text-primary"
                >
                  <option value="Design">Design</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Academics">Academics</option>
                  <option value="Communication">Communication</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-primary mb-1">Directive Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Build responsive navigation bar in React..."
                    value={customTitle}
                    onChange={e => setCustomTitle(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-border-subtle bg-surface-subtle font-bold text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="button"
                    onClick={handleRunAiAnalysis}
                    className="px-4 py-3 rounded-xl gold-gradient text-white font-extrabold flex items-center gap-1 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">psychology</span>
                    Analyze
                  </button>
                </div>
              </div>
            </div>

            {/* AI Analysis Loading State */}
            {isAnalyzing && (
              <div className="p-6 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col items-center justify-center gap-2 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
                <span className="font-extrabold text-gold">System Neural Telemetry Scanning...</span>
              </div>
            )}

            {/* AI Analysis Result */}
            {aiAnalysis && !isAnalyzing && (
              <div className="animate-in fade-in duration-200">
                {!aiAnalysis.isGrowth ? (
                  /* NON-GROWTH SHIELD REJECTION CARD */
                  <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-red-700 font-black text-sm">
                      <span className="material-symbols-outlined">shield_lock</span>
                      Non-Growth Activity Shield Triggered
                    </div>
                    <p className="text-red-600 font-medium">{aiAnalysis.reason}</p>
                    <p className="text-red-500 font-bold">{aiAnalysis.recommendation}</p>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleAddToRewardShop}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-extrabold shadow-sm hover:bg-red-700"
                      >
                        + Add to Reward Shop Inventory
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiAnalysis(null)}
                        className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-700 font-bold"
                      >
                        Modify Input
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VALID GROWTH DIRECTIVE CARD */
                  <div className="p-5 rounded-2xl bg-surface-subtle border border-gold/40 flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md gold-gradient text-white">
                          {aiAnalysis.difficulty}
                        </span>
                        <span className="font-bold text-primary-muted">{aiAnalysis.estimatedDuration}</span>
                      </div>
                      <div className="flex items-center gap-2 font-black">
                        <span className="text-primary">+{aiAnalysis.xpReward} XP</span>
                        <span className="text-gold">+{aiAnalysis.dpReward} DP</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="font-extrabold text-primary uppercase text-[10px]">Linked Skills:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {(aiAnalysis.relatedSkills || []).map(sk => (
                          <span key={sk} className="px-2.5 py-1 rounded-xl bg-white border border-border-subtle font-extrabold text-primary">
                            🎯 {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="font-extrabold text-gold uppercase text-[10px]">Linked Attributes:</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {(aiAnalysis.attributesImproved || []).map(attr => (
                          <span key={attr} className="px-2.5 py-1 rounded-xl bg-gold-light border border-gold/30 font-extrabold text-gold">
                            ⚡ {attr}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={isMaxReached}
                      type="button"
                      onClick={handleDeployCustomMission}
                      className={`w-full py-3 rounded-2xl text-white font-extrabold text-xs shadow-md transition-transform mt-1 ${
                        isMaxReached ? 'bg-gray-400 cursor-not-allowed' : 'gold-gradient hover:scale-105'
                      }`}
                    >
                      {isMaxReached ? 'Max 5 Active Directives Reached' : 'Confirm & Deploy Directive →'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
