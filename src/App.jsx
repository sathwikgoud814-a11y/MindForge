import React, { Suspense, lazy } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SkeletonLoader } from './shared/components/SkeletonLoader';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';

// Helper to safely handle dynamic import chunk failures during new deployments
function safeLazy(importFn) {
  return lazy(() =>
    importFn().catch((err) => {
      console.warn('[Dynamic Import Notice]: New deployment asset chunk detected. Refreshing for latest version...', err);
      const reloaded = sessionStorage.getItem('solo_chunk_reloaded');
      if (!reloaded) {
        sessionStorage.setItem('solo_chunk_reloaded', 'true');
        window.location.reload();
      }
      return { default: () => <SkeletonLoader /> };
    })
  );
}

// Lazy Loaded Feature Pages with Deployment Chunk Resilience
const CommandCenter = safeLazy(() => import('./features/command-center/CommandCenter').then(m => ({ default: m.CommandCenter })));
const MissionsView = safeLazy(() => import('./components/missions/MissionsView').then(m => ({ default: m.MissionsView })));
const PlannerView = safeLazy(() => import('./components/planner/PlannerView').then(m => ({ default: m.PlannerView })));
const GrowthReportView = safeLazy(() => import('./components/growth/GrowthReportView').then(m => ({ default: m.GrowthReportView })));
const CharacterView = safeLazy(() => import('./components/character/CharacterView').then(m => ({ default: m.CharacterView })));
const RewardShopModal = safeLazy(() => import('./components/shop/RewardShopModal').then(m => ({ default: m.RewardShopModal })));
const HuntersView = safeLazy(() => import('./components/hunters/HuntersView').then(m => ({ default: m.HuntersView })));
const ActiveDuelView = safeLazy(() => import('./components/hunters/ActiveDuelView').then(m => ({ default: m.ActiveDuelView })));

import { PublicCharacterModal } from './components/hunters/PublicCharacterModal';
import { HunterCompareModal } from './components/hunters/HunterCompareModal';
import { CreateDuelModal } from './components/hunters/CreateDuelModal';
import { DuelResultModal } from './components/hunters/DuelResultModal';
import { MissionCompletionModal } from './components/common/MissionCompletionModal';
import { RewardRedemptionModal } from './components/common/RewardRedemptionModal';
import { MysteryBoxModal } from './components/shop/MysteryBoxModal';
import { LevelUpModal } from './components/common/LevelUpModal';
import { RankPromotionModal } from './components/common/RankPromotionModal';
import { CreateMissionModal } from './components/missions/CreateMissionModal';
import { AddRewardModal } from './components/shop/AddRewardModal';
import { EditRewardModal } from './components/shop/EditRewardModal';
import { CreateCustomSkillModal } from './components/character/CreateCustomSkillModal';
import { CareerSelectionModal } from './components/character/CareerSelectionModal';

function AppContent() {
  const { isOnboarded, activeTab, viewingDuel } = useSystem();

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  return (
    <div className="min-h-screen bg-background text-primary flex font-sans antialiased selection:bg-gold-light selection:text-gold">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Header />
        <main className="animate-in fade-in duration-200">
          <Suspense fallback={<SkeletonLoader />}>
            {activeTab === 'commandCenter' && <CommandCenter />}
            {activeTab === 'missions' && <MissionsView />}
            {activeTab === 'planner' && <PlannerView />}
            {activeTab === 'growth' && <GrowthReportView />}
            {activeTab === 'character' && <CharacterView />}
            {activeTab === 'shop' && <RewardShopModal />}
            {activeTab === 'hunters' && (viewingDuel ? <ActiveDuelView /> : <HuntersView />)}
          </Suspense>
        </main>
        <Footer />

        {/* Global Modals & Overlays */}
        <MissionCompletionModal />
        <RewardRedemptionModal />
        <MysteryBoxModal />
        <LevelUpModal />
        <RankPromotionModal />
        <CreateMissionModal />
        <AddRewardModal />
        <EditRewardModal />
        <CreateCustomSkillModal />
        <CareerSelectionModal />

        {/* Hunters Network Modals */}
        <PublicCharacterModal />
        <HunterCompareModal />
        <CreateDuelModal />
        <DuelResultModal />
      </div>
    </div>
  );
}

import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <SystemProvider>
        <AppContent />
      </SystemProvider>
    </ErrorBoundary>
  );
}
