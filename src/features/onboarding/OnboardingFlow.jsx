import React, { useState, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { auth } from '../../shared/config/firebase';
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithEmail,
  signUpWithEmail,
  sendVerificationEmail
} from '../../shared/services/authService';
import { getDynamicSkillTree, getCareerDefaults } from '../../shared/services/careerEngine';

export function OnboardingFlow() {
  const { completeOnboarding, setIsOnboarded, currentUser } = useSystem();

  // Saved step progress in localStorage
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('solo_onboarding_step');
    return saved ? Number(saved) : 1;
  });

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // Initial career defaults
  const initialCareerDefaults = getCareerDefaults('UI/UX Designer');

  // Onboarding Form Data state
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('solo_onboarding_data');
    return saved ? JSON.parse(saved) : {
      name: 'Vekta',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      career: 'UI/UX Designer',
      destinyIdentity: initialCareerDefaults.destinyIdentity,
      destinyGoals: initialCareerDefaults.destinyGoals,
      dailyHours: '6 Hours',
      occupation: 'Student / Freelancer',
      selectedImprovementAreas: ['Consistency', 'Focus', 'Time Management'],
      selectedObstacles: ['Procrastination & Distractions', 'Lack of Structured System'],
      rewardsList: [
        { name: 'Specialty Espresso Coffee', category: 'Food', costDP: 90, icon: 'coffee' },
        { name: '45 Minutes Guilt-Free Gaming', category: 'Entertainment', costDP: 180, icon: 'sports_esports' },
        { name: '1 Episode Sci-Fi Series', category: 'Entertainment', costDP: 140, icon: 'tv' },
      ],
      archetype: 'Creative Builder',
      strongestTraits: ['Creativity', 'Curiosity'],
      weakestTraits: ['Consistency', 'Focus', 'Time Management'],
    };
  });

  const [careerSearch, setCareerSearch] = useState('');
  const [customRewardInput, setCustomRewardInput] = useState('');
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Analyzing Career...');

  // Dynamic Skill Tree compiled from Career + Destiny
  const dynamicSkillTree = getDynamicSkillTree(formData.career, formData.destinyIdentity);

  // Auto-save onboarding state
  useEffect(() => {
    localStorage.setItem('solo_onboarding_step', currentStep);
    localStorage.setItem('solo_onboarding_data', JSON.stringify(formData));
  }, [currentStep, formData]);

  // Keep destiny vision & goals synchronized when career is selected
  const handleSelectCareer = (careerTitle) => {
    const defaults = getCareerDefaults(careerTitle);
    setFormData(prev => ({
      ...prev,
      career: careerTitle,
      destinyIdentity: defaults.destinyIdentity,
      destinyGoals: defaults.destinyGoals,
    }));
  };

  const totalSteps = 11;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 9) {
        // Trigger System Scanner in Step 10
        setCurrentStep(10);
        startSystemScan();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Google Authentication - NEVER skip on error!
  const handleGoogleAuth = async () => {
    try {
      setAuthError('');
      const user = await signInWithGoogle();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.displayName || 'Vekta',
          avatar: user.photoURL || prev.avatar
        }));
        nextStep();
      }
    } catch (e) {
      console.error('[Google Auth Error]:', e);
      setAuthError('Google sign in failed or popup was closed. Please authenticate to proceed.');
      // Strictly DO NOT call nextStep()
    }
  };

  // GitHub Authentication - NEVER skip on error!
  const handleGithubAuth = async () => {
    try {
      setAuthError('');
      const user = await signInWithGithub();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.displayName || 'Vekta',
          avatar: user.photoURL || prev.avatar
        }));
        nextStep();
      }
    } catch (e) {
      console.error('[GitHub Auth Error]:', e);
      setAuthError('GitHub sign in failed or popup was closed. Please authenticate to proceed.');
      // Strictly DO NOT call nextStep()
    }
  };

  // Email Authentication - Strictly enforce verification
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    try {
      setAuthError('');
      let user;
      try {
        user = await signInWithEmail(authEmail, authPassword || 'MindForgePass123!');
      } catch (signInErr) {
        // Fallback to Sign Up
        user = await signUpWithEmail(authEmail, authPassword || 'MindForgePass123!');
      }

      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.displayName || authEmail.split('@')[0] || 'Vekta'
        }));

        // Strict Email Verification Check
        if (!user.emailVerified) {
          setVerificationPending(true);
          try {
            await sendVerificationEmail(user);
            setVerificationSent(true);
          } catch (verr) {
            console.warn('Verification email link notice:', verr);
          }
        } else {
          nextStep();
        }
      }
    } catch (err) {
      console.error('[Email Auth Error]:', err);
      setAuthError(err.message || 'Authentication error. Please check your credentials.');
      // Strictly DO NOT call nextStep()
    }
  };

  const checkEmailVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setVerificationPending(false);
        setAuthError('');
        nextStep();
      } else {
        alert('Email is not verified yet. Please open your email inbox and click the verification link.');
      }
    } else if (currentUser) {
      alert('Verification pending. Please verify your email link.');
    }
  };

  const handleResendVerification = async () => {
    const userToVerify = auth.currentUser || currentUser;
    if (userToVerify) {
      try {
        await sendVerificationEmail(userToVerify);
        setVerificationSent(true);
        alert('Verification email re-sent to ' + userToVerify.email);
      } catch (e) {
        alert('Could not resend email: ' + e.message);
      }
    }
  };

  const toggleImprovementArea = (area) => {
    setFormData(prev => {
      const current = prev.selectedImprovementAreas || [];
      if (current.includes(area)) {
        const updated = current.filter(a => a !== area);
        return { ...prev, selectedImprovementAreas: updated, weakestTraits: updated };
      } else {
        if (current.length >= 3) return prev;
        const updated = [...current, area];
        return { ...prev, selectedImprovementAreas: updated, weakestTraits: updated };
      }
    });
  };

  const toggleObstacle = (obs) => {
    setFormData(prev => {
      const current = prev.selectedObstacles || [];
      if (current.includes(obs)) {
        return { ...prev, selectedObstacles: current.filter(o => o !== obs) };
      } else {
        return { ...prev, selectedObstacles: [...current, obs] };
      }
    });
  };

  const startSystemScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const statuses = [
      'Analyzing Career & Specialization...',
      'Analyzing Destiny Goals...',
      'Evaluating System Assessment...',
      'Inferring Character Strengths & Growth Areas...',
      'Generating Custom Skill Tree Architecture...',
      'Calculating Optimal Growth Path & Archetype...',
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx += 1;
      setScanProgress(Math.min(100, Math.round((stepIdx / statuses.length) * 100)));
      if (stepIdx < statuses.length) {
        setScanStatusText(statuses[stepIdx]);
      } else {
        clearInterval(interval);
        setIsScanning(false);
      }
    }, 600);
  };

  const careersList = [
    { title: 'UI/UX Designer', icon: 'palette', desc: 'Craft high-converting user experiences, design systems, and web layouts.' },
    { title: 'Frontend Developer', icon: 'web', desc: 'Build fast, responsive, and beautiful modern web applications.' },
    { title: 'Software Engineer', icon: 'code', desc: 'Build scalable full-stack applications, algorithms, and cloud systems.' },
    { title: 'Machine Learning Engineer', icon: 'psychology', desc: 'Develop AI models, PyTorch deep learning networks, and RAG pipelines.' },
    { title: 'Data Scientist', icon: 'analytics', desc: 'Extract insights from data, statistical models, and predictive analytics.' },
    { title: 'Content Creator', icon: 'videocam', desc: 'Produce high-impact videos, personal branding, and audience growth.' },
    { title: 'Entrepreneur', icon: 'domain', desc: 'Build venture-backed startups, scale SaaS products, and master sales.' },
    { title: 'Writer', icon: 'edit_note', desc: 'Author fiction, technical publications, blogs, and compelling lore.' },
    { title: 'Athlete', icon: 'fitness_center', desc: 'Build peak physical strength, endurance stamina, and athletic recovery.' },
    { title: 'Student', icon: 'school', desc: 'Accelerate academic performance, deep study focus, and subject mastery.' },
    { title: 'Doctor / Medical Specialist', icon: 'medical_services', desc: 'Master clinical diagnosis, medical research, and human anatomy.' },
  ];

  const filteredCareers = careersList.filter(c =>
    c.title.toLowerCase().includes(careerSearch.toLowerCase()) ||
    c.desc.toLowerCase().includes(careerSearch.toLowerCase())
  );

  const addCustomReward = () => {
    if (!customRewardInput.trim()) return;
    const newR = { name: customRewardInput, category: 'Comfort', costDP: 100, icon: 'card_giftcard' };
    setFormData(prev => ({ ...prev, rewardsList: [...prev.rewardsList, newR] }));
    setCustomRewardInput('');
  };

  const addCustomGoal = () => {
    if (!customGoalInput.trim()) return;
    setFormData(prev => ({ ...prev, destinyGoals: [...prev.destinyGoals, customGoalInput] }));
    setCustomGoalInput('');
  };

  const handleFinishOnboarding = () => {
    completeOnboarding(formData);
  };

  const improvementOptions = [
    'Consistency', 'Focus', 'Time Management', 'Deep Work', 'Exercise', 'Reading',
    'Confidence', 'Communication', 'Leadership', 'Organization', 'Sleep',
    'Phone Usage', 'Social Media', 'Stress Management', 'Decision Making', 'Motivation', 'Other'
  ];

  const obstacleOptions = [
    'Procrastination & Distractions',
    'Inconsistent Daily Habits',
    'Lack of Structured System',
    'Low Energy / Fatigue',
    'Overthinking & Perfectionism',
    'Difficulty Managing Time',
  ];

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between p-4 md:p-8 selection:bg-gold-light selection:text-gold">
      {/* Top Header & Progress Bar */}
      <header className="max-w-4xl mx-auto w-full flex flex-col gap-4 pb-4 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center font-black text-white text-sm shadow-sm">
              S
            </div>
            <span className="font-extrabold text-sm text-primary tracking-tight">System Awakening</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-primary-muted">Step {currentStep} of {totalSteps}</span>
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-3 py-1.5 rounded-xl bg-surface-subtle text-primary font-bold text-xs border border-border-subtle hover:bg-white"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Across Top */}
        <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-border-subtle">
          <div className="gold-gradient h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
        </div>
      </header>

      {/* Step Contents Container */}
      <main className="max-w-3xl mx-auto w-full my-auto py-8">
        {/* STEP 1: WELCOME */}
        {currentStep === 1 && (
          <div className="apple-card p-8 md:p-12 flex flex-col items-center text-center gap-8 shadow-md animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-3xl gold-gradient flex items-center justify-center font-black text-white text-4xl shadow-lg">
              S
            </div>
            <div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full gold-gradient text-white uppercase tracking-widest">
                Awakening Protocol
              </span>
              <h1 className="text-4xl font-black text-primary tracking-tight mt-3">Welcome to the System.</h1>
              <p className="text-base text-primary-muted font-medium mt-2 max-w-md">
                Every action shapes the character you become. Discipline is your only level requirement.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs">
              <button
                onClick={nextStep}
                className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-sm shadow-md hover:scale-105 transition-transform"
              >
                Get Started
              </button>
              <button
                onClick={() => setIsOnboarded(true)}
                className="w-full py-4 rounded-2xl bg-surface-subtle text-primary font-extrabold text-sm border border-border-subtle hover:bg-white"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AUTHENTICATION (Strict Google, GitHub, and Email Verification Lock) */}
        {currentStep === 2 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 2: Identity Verification</span>
              <h2 className="text-2xl font-black text-primary mt-1">Player Authentication</h2>
              <p className="text-xs text-primary-muted">Connect your Google, GitHub, or Email credentials to awaken your character.</p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-gold-light/60 border border-gold/30 text-xs font-bold text-primary">
                {authError}
              </div>
            )}

            {/* Email Verification Pending Guard Screen */}
            {verificationPending ? (
              <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col gap-4 text-xs animate-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl font-bold">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-900">Email Verification Required</h4>
                    <p className="text-amber-700 font-medium">We sent a verification link to <strong className="font-bold">{authEmail || auth.currentUser?.email}</strong>.</p>
                  </div>
                </div>

                <p className="text-amber-800 leading-relaxed font-medium">
                  Please open your email inbox, click the verification link, and then click <strong>"I've Verified My Email"</strong> below to proceed.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={checkEmailVerificationStatus}
                    className="flex-1 py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-sm hover:scale-105 transition-transform"
                  >
                    I've Verified My Email ✓
                  </button>
                  <button
                    onClick={handleResendVerification}
                    className="px-4 py-3.5 rounded-2xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100/50"
                  >
                    Resend Email
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleGoogleAuth}
                    className="w-full py-3.5 px-4 rounded-2xl bg-surface-subtle border border-border-subtle font-extrabold text-xs text-primary flex items-center justify-center gap-3 hover:bg-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-red-500">g_translate</span>
                    Continue with Google
                  </button>
                  <button
                    onClick={handleGithubAuth}
                    className="w-full py-3.5 px-4 rounded-2xl bg-primary text-white font-extrabold text-xs flex items-center justify-center gap-3 hover:bg-black transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">code</span>
                    Continue with GitHub
                  </button>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-border-subtle"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-primary-muted font-bold uppercase">Or Email & Password</span>
                  <div className="flex-grow border-t border-border-subtle"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="flex flex-col gap-3 text-xs">
                  <input
                    type="email"
                    required
                    placeholder="vekta@system.elite"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-1"
                  >
                    Awaken Account with Email
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* STEP 3: CREATE CHARACTER IDENTITY */}
        {currentStep === 3 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 3: Identity Setup</span>
              <h2 className="text-2xl font-black text-primary mt-1">Create Your Character</h2>
              <p className="text-xs text-primary-muted">Provide your character name. Ranks and Archetypes will be calculated automatically by the System.</p>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Character Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-2">Select Avatar Persona</label>
                <div className="flex items-center gap-4">
                  <img src={formData.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-gold shadow-sm" />
                  <div className="flex items-center gap-2">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
                    ].map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt="Preset"
                        onClick={() => setFormData({ ...formData, avatar: imgUrl })}
                        className={`w-12 h-12 rounded-xl object-cover cursor-pointer border ${formData.avatar === imgUrl ? 'border-gold ring-2 ring-gold/40' : 'border-border-subtle'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2"
              >
                Proceed to Career Path →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRIMARY CAREER SELECTION */}
        {currentStep === 4 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 4: Specialization</span>
              <h2 className="text-2xl font-black text-primary mt-1">Choose Your Primary Career</h2>
              <p className="text-xs text-primary-muted">Your primary career determines your initial Skill Tree & Destiny Vision.</p>
            </div>

            <div className="p-3 bg-surface-subtle rounded-2xl border border-border-subtle flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-primary-muted pl-1">search</span>
              <input
                type="text"
                placeholder="Search Career Path..."
                value={careerSearch}
                onChange={e => setCareerSearch(e.target.value)}
                className="w-full bg-transparent text-primary font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredCareers.map(c => {
                const isSelected = formData.career === c.title;
                return (
                  <div
                    key={c.title}
                    onClick={() => handleSelectCareer(c.title)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-gold bg-gold-light/60 shadow-sm'
                        : 'border-border-subtle hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        isSelected ? 'gold-gradient text-white font-bold' : 'bg-surface-subtle text-primary'
                      }`}>
                        <span className="material-symbols-outlined">{c.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-primary">{c.title}</h4>
                        <p className="text-xs text-primary-muted">{c.desc}</p>
                      </div>
                    </div>

                    <span className={`text-xs font-bold ${isSelected ? 'text-gold' : 'text-primary-muted'}`}>
                      {isSelected ? 'SELECTED ✓' : 'Select'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
            >
              Confirm Career Path →
            </button>
          </div>
        )}

        {/* STEP 5: DREAM IDENTITY & DESTINY GOALS */}
        {currentStep === 5 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 5: Vision</span>
              <h2 className="text-2xl font-black text-primary mt-1">Dream Identity & Destiny</h2>
              <p className="text-xs text-primary-muted">Who do you want to become? Tailored automatically for <strong className="text-primary">{formData.career}</strong>.</p>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Who do you want to become?</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Medical Officer, Senior Product Designer"
                  value={formData.destinyIdentity}
                  onChange={e => setFormData({ ...formData, destinyIdentity: e.target.value })}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Destiny Milestones & Goals</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add custom milestone goal..."
                    value={customGoalInput}
                    onChange={e => setCustomGoalInput(e.target.value)}
                    className="flex-1 p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomGoal}
                    className="px-4 py-3.5 rounded-2xl gold-gradient text-white font-bold"
                  >
                    + Add Goal
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {formData.destinyGoals.map((g, idx) => (
                    <span key={idx} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gold-light border border-gold/30 text-gold flex items-center gap-1.5">
                      <span>🎯 {g}</span>
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2"
              >
                Proceed to Situation Analysis →
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: CURRENT SITUATION */}
        {currentStep === 6 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 6: Telemetry</span>
              <h2 className="text-2xl font-black text-primary mt-1">Current Situation</h2>
              <p className="text-xs text-primary-muted">Help the System calculate your initial growth velocity and workload balancing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Daily Available Hours</label>
                <select
                  value={formData.dailyHours}
                  onChange={e => setFormData({ ...formData, dailyHours: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary font-bold"
                >
                  <option value="2 Hours">2 Hours / Day</option>
                  <option value="4 Hours">4 Hours / Day</option>
                  <option value="6 Hours">6 Hours / Day</option>
                  <option value="8+ Hours">8+ Hours / Day</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Current Occupation</label>
                <select
                  value={formData.occupation}
                  onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full p-3 rounded-xl border border-border-subtle bg-surface-subtle text-primary font-bold"
                >
                  <option value="Student">Student</option>
                  <option value="Freelancer">Freelancer</option>
                  <option value="Full-time Employee">Full-time Employee</option>
                  <option value="Founder / Self-Employed">Founder / Self-Employed</option>
                </select>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
            >
              Proceed to System Assessment →
            </button>
          </div>
        )}

        {/* STEP 7: SYSTEM ASSESSMENT */}
        {currentStep === 7 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 7: Telemetry Scan</span>
              <h2 className="text-2xl font-black text-primary mt-1">System Assessment</h2>
              <p className="text-xs text-primary-muted">Guided assessment to calibrate mission recommendations, AI coaching, and attribute growth.</p>
            </div>

            {/* Section 1: Areas to Improve */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-extrabold text-primary">Section 1: Which areas would you like to improve?</label>
                <span className="text-[10px] font-bold text-gold">Select up to 3 ({(formData.selectedImprovementAreas || []).length}/3)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {improvementOptions.map(opt => {
                  const isSelected = (formData.selectedImprovementAreas || []).includes(opt);
                  return (
                    <div
                      key={opt}
                      onClick={() => toggleImprovementArea(opt)}
                      className={`p-2.5 rounded-xl border font-bold flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-gold-light/60 text-primary shadow-sm'
                          : 'border-border-subtle bg-surface-subtle text-primary-muted hover:border-gold/40'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <span className="text-gold font-extrabold">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Preventative Factors & Obstacles */}
            <div className="flex flex-col gap-3 text-xs">
              <label className="font-extrabold text-primary">Section 2: What usually prevents you from making progress?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {obstacleOptions.map(obs => {
                  const isSelected = (formData.selectedObstacles || []).includes(obs);
                  return (
                    <div
                      key={obs}
                      onClick={() => toggleObstacle(obs)}
                      className={`p-3 rounded-xl border font-extrabold flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gold bg-gold-light/60 text-primary shadow-sm'
                          : 'border-border-subtle bg-surface-subtle text-primary-muted hover:border-gold/40'
                      }`}
                    >
                      <span>{obs}</span>
                      {isSelected && <span className="text-gold font-extrabold">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
            >
              Set Reward Preferences →
            </button>
          </div>
        )}

        {/* STEP 8: REWARD PREFERENCES */}
        {currentStep === 8 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 8: Discipline Exchange</span>
              <h2 className="text-2xl font-black text-primary mt-1">Reward Preferences</h2>
              <p className="text-xs text-primary-muted">What comforts motivate you? These populate your initial Reward Shop inventory.</p>
            </div>

            <div className="flex flex-col gap-4 text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Define custom reward (e.g. Espresso, Gaming, Movie)..."
                  value={customRewardInput}
                  onChange={e => setCustomRewardInput(e.target.value)}
                  className="flex-1 p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomReward}
                  className="px-4 py-3.5 rounded-2xl gold-gradient text-white font-bold"
                >
                  + Add Reward
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formData.rewardsList.map((r, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-gold">{r.icon}</span>
                      <span className="font-extrabold text-primary">{r.name}</span>
                    </div>
                    <span className="font-black text-gold text-xs">{r.costDP} DP</span>
                  </div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2"
              >
                Generate Dynamic Skill Tree →
              </button>
            </div>
          </div>
        )}

        {/* STEP 9: DYNAMIC SKILL TREE GENERATION (CAREER + DESTINY) */}
        {currentStep === 9 && (
          <div className="apple-card p-8 md:p-10 flex flex-col gap-6 shadow-md animate-in fade-in duration-300">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold uppercase tracking-wider">Step 9: Dynamic Skill Tree</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase">
                  Career + Destiny Engine
                </span>
              </div>
              <h2 className="text-2xl font-black text-primary mt-1">{dynamicSkillTree.career} Skill Architecture</h2>
              <p className="text-xs text-primary-muted">
                Compiled dynamically for <strong className="text-primary">{formData.career}</strong> targeting vision: <strong className="text-gold">"{formData.destinyIdentity}"</strong>.
              </p>
            </div>

            {/* Core Skills Section */}
            <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
              <span className="text-xs font-extrabold text-gold uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">stars</span>
                Core Skills ({dynamicSkillTree.tree.core.length})
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {dynamicSkillTree.tree.core.map(sk => (
                  <div key={sk.id} className="p-2.5 rounded-xl bg-white border border-border-subtle font-extrabold text-primary flex items-center justify-between shadow-2xs">
                    <span>{sk.name}</span>
                    <span className="text-gold text-[10px] font-black">Core</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting & Advanced Modules */}
            {dynamicSkillTree.tree.supporting.length > 0 && (
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-3">
                <span className="text-xs font-extrabold text-primary-muted uppercase flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">construction</span>
                  Supporting & Advanced ({dynamicSkillTree.tree.supporting.length + dynamicSkillTree.tree.advanced.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {dynamicSkillTree.tree.supporting.concat(dynamicSkillTree.tree.advanced).map(sk => (
                    <div key={sk.id} className="p-2.5 rounded-xl bg-white/70 border border-border-subtle font-bold text-primary-muted flex items-center justify-between">
                      <span>{sk.name}</span>
                      <span className="text-primary-muted text-[10px]">{sk.tier}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={nextStep}
              className="w-full py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
            >
              Run System Analysis Scan →
            </button>
          </div>
        )}

        {/* STEP 10: SYSTEM ANALYSIS SCANNER */}
        {currentStep === 10 && (
          <div className="apple-card p-8 md:p-10 flex flex-col items-center text-center gap-6 shadow-md animate-in fade-in duration-300">
            {isScanning ? (
              <div className="flex flex-col items-center gap-6 py-12">
                <div className="w-24 h-24 rounded-full border-4 border-gold border-t-transparent animate-spin flex items-center justify-center text-gold text-2xl font-black">
                  S
                </div>
                <div>
                  <span className="text-xs font-black text-gold uppercase tracking-widest">Neural Scanning</span>
                  <h3 className="text-xl font-black text-primary mt-1">{scanStatusText}</h3>
                  <span className="text-sm font-extrabold text-primary-muted mt-1">{scanProgress}% Completed</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 w-full text-left">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase">
                      System Analysis Complete
                    </span>
                    <h2 className="text-2xl font-black text-primary mt-1">Character Telemetry Summary</h2>
                  </div>
                  <span className="text-xs font-bold text-gold uppercase">System Telemetry</span>
                </div>

                <div className="p-6 rounded-3xl bg-gold-light/60 border border-gold/30 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl gold-gradient text-white flex items-center justify-center font-black text-xl">
                      S
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gold uppercase tracking-wider">Calculated Archetype</span>
                      <h3 className="text-xl font-black text-primary">{formData.archetype}</h3>
                    </div>
                  </div>

                  <p className="text-xs text-primary leading-relaxed font-medium mt-1">
                    "Creative Builders excel at turning ideas into real products. They naturally thrive in design and innovation but benefit from strengthening discipline and consistency."
                  </p>
                </div>

                {/* Structured Inferred Analysis Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-2">
                    <span className="font-extrabold text-emerald-600 uppercase text-[10px]">Strengths:</span>
                    <ul className="flex flex-col gap-1 font-extrabold text-primary">
                      {(formData.strongestTraits || ['Creativity', 'Curiosity']).map(str => (
                        <li key={str} className="flex items-center gap-1.5">
                          <span className="text-emerald-500">●</span> {str}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col gap-2">
                    <span className="font-extrabold text-amber-600 uppercase text-[10px]">Improvement Areas:</span>
                    <ul className="flex flex-col gap-1 font-extrabold text-primary">
                      {(formData.weakestTraits || ['Consistency', 'Focus', 'Time Management']).map(imp => (
                        <li key={imp} className="flex items-center gap-1.5">
                          <span className="text-amber-500">●</span> {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle text-[11px] text-primary-muted font-medium">
                  💡 Note: These improvement areas directly calibrate your System mission recommendations, AI coaching, and attribute progression.
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={startSystemScan}
                    className="w-1/3 py-3.5 rounded-2xl bg-surface-subtle text-primary-muted font-bold text-xs border border-border-subtle"
                  >
                    Recalculate
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-2/3 py-3.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
                  >
                    Accept Analysis & Awaken →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 11: CHARACTER AWAKENING CINEMATIC SUMMARY */}
        {currentStep === 11 && (
          <div className="apple-card p-8 md:p-12 flex flex-col items-center text-center gap-8 shadow-xl border-2 border-gold animate-in zoom-in-95 duration-400">
            <div className="w-24 h-24 rounded-3xl gold-gradient flex items-center justify-center font-black text-white text-5xl shadow-2xl animate-pulse">
              S
            </div>

            <div>
              <span className="text-xs font-black tracking-widest text-gold uppercase">Awakening Complete</span>
              <h1 className="text-3xl font-black text-primary tracking-tight mt-1">{formData.name}</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-xs font-extrabold px-3 py-0.5 rounded-full gold-gradient text-white uppercase">
                  Recruit Rank
                </span>
                <span className="text-xs font-bold text-primary-muted">Level 0 • 0 XP • 0 DP</span>
              </div>
            </div>

            {/* RPG Status Summary */}
            <div className="w-full bg-surface-subtle p-6 rounded-3xl border border-border-subtle flex flex-col gap-4 text-xs text-left">
              <div className="flex justify-between items-center pb-2 border-b border-border-subtle font-extrabold">
                <span className="text-primary-muted">Primary Career</span>
                <span className="text-primary">{formData.career}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-border-subtle font-extrabold">
                <span className="text-primary-muted">Generated Archetype</span>
                <span className="text-gold">{formData.archetype}</span>
              </div>

              <div className="flex justify-between items-center font-extrabold">
                <span className="text-primary-muted">Destiny Vision</span>
                <span className="text-primary">{formData.destinyIdentity}</span>
              </div>
            </div>

            <div className="w-full p-4 rounded-2xl bg-gold-light/60 border border-gold/30 text-xs font-medium text-primary">
              "Character Created Successfully. Your journey begins now."
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-sm shadow-xl hover:scale-105 transition-transform"
            >
              Enter Command Center
            </button>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-primary-muted font-medium pt-4">
        © 2026 System Elite • Character Creation Protocol
      </footer>
    </div>
  );
}
