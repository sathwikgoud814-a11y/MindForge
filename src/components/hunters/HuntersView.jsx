import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../shared/config/firebase';
import { useSystem } from '../../context/SystemContext';

export function HuntersView() {
  const {
    currentUser,
    character,
    hunters,
    friendRequests,
    activeDuels,
    setActiveDuels,
    addHunter,
    acceptFriendRequest,
    rejectFriendRequest,
    setSelectedHunterProfile,
    setCompareHunter,
    setChallengeHunter,
    setViewingDuel,
  } = useSystem();

  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [incomingDuels, setIncomingDuels] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHunterName, setNewHunterName] = useState('');
  const [newHunterCareer, setNewHunterCareer] = useState('Software Engineer');

  // Fetch Real Network Hunters from Firestore `users/` collection directly
  useEffect(() => {
    let isMounted = true;
    async function fetchNetworkHunters() {
      try {
        const snap = await getDocs(collection(db, 'users'));
        if (!isMounted) return;
        const myEmail = (currentUser?.email || '').toLowerCase();
        const myName = (character?.name || '').toLowerCase();
        const myUid = currentUser?.uid || '';
        const myHandle = (character?.userIdTag || `@${(character?.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`).toLowerCase();

        const dedupMap = new Map();
        snap.forEach(docSnap => {
          const h = docSnap.data();
          const hEmail = (h.email || '').toLowerCase();
          const hName = (h.displayName || h.name || '').toLowerCase();
          const hUid = h.uid || docSnap.id;
          const hHandle = (h.userIdTag || h.handle || `@${hName.replace(/[^a-z0-9]/g, '')}`).toLowerCase();
          if (hEmail.includes('@system.elite')) return;
          if (myUid && hUid === myUid) return;
          if (myEmail && hEmail === myEmail) return;
          if (myName && hName === myName) return;
          if (myHandle && hHandle === myHandle) return;
          const key = hHandle || hName || hUid;
          if (!dedupMap.has(key)) {
            dedupMap.set(key, {
              id: hUid,
              name: h.displayName || h.name || 'Hunter',
              handle: h.userIdTag || h.handle || `@${(h.displayName || h.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              email: h.email || '',
              avatar: h.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${hUid}`,
              rank: h.rank || 'Recruit Rank',
              level: h.level || 1,
              career: h.career || 'Adventurer',
              xp: h.xp || 0,
            });
          }
        });
        if (isMounted) setRegisteredUsers(Array.from(dedupMap.values()));
      } catch (err) {
        // Quiet catch
      } finally {
        if (isMounted) setLoadingUsers(false);
      }
    }

    fetchNetworkHunters();
    return () => { isMounted = false; };
  }, [currentUser, character]);

  // Fetch Live Incoming & Active Duels from Firestore `duels/` directly
  useEffect(() => {
    let isMounted = true;
    async function fetchMyDuels() {
      const email = (currentUser?.email || '').toLowerCase().trim();
      const uid = currentUser?.uid || '';
      const charName = (character?.name || '').toLowerCase().trim();
      const myHandle = (character?.userIdTag || `@${(character?.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`).toLowerCase().trim();
      if (!email && !uid && !myHandle) return;

      try {
        const snap = await getDocs(collection(db, 'duels'));
        if (!isMounted) return;

        const pending = [];
        const activeServerDuels = [];

        snap.forEach(docSnap => {
          const d = { id: docSnap.id, ...docSnap.data() };
          const chEmail = (d.challengerEmail || '').toLowerCase().trim();
          const oppEmail = (d.opponentEmail || '').toLowerCase().trim();
          const chName = (d.challengerName || '').toLowerCase().trim();
          const oppName = (d.opponentName || '').toLowerCase().trim();
          const chHandle = (d.challengerHandle || '').toLowerCase().trim();
          const oppHandle = (d.opponentHandle || '').toLowerCase().trim();

          const isInvolved = (chHandle && chHandle === myHandle) || (oppHandle && oppHandle === myHandle) ||
            chEmail === email || oppEmail === email ||
            d.challengerId === uid || d.opponentId === uid ||
            (charName && (chName.includes(charName) || oppName.includes(charName)));

          if (!isInvolved) return;

          if (d.status === 'pending') {
            const isOpponent = (oppHandle && oppHandle === myHandle) || oppEmail === email || d.opponentId === uid || (charName && oppName.includes(charName));
            if (isOpponent) pending.push(d);
          } else if (d.status === 'active') {
            const isChallenger = (chHandle && chHandle === myHandle) || chEmail === email || d.challengerId === uid || (charName && chName.includes(charName));
            activeServerDuels.push({
              id: d.id,
              opponent: {
                name: isChallenger ? (d.opponentName || 'Opponent') : (d.challengerName || 'Challenger'),
                rank: 'Recruit Rank',
                avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${isChallenger ? d.opponentName : d.challengerName}`,
                career: 'Software Engineer',
                level: 1,
              },
              duration: d.duration || '24 Hours',
              category: d.category || 'General Discipline',
              status: 'active',
              userScore: isChallenger ? (d.userScore || 0) : (d.opponentScore || 0),
              opponentScore: isChallenger ? (d.opponentScore || 0) : (d.userScore || 0),
              timeRemaining: d.duration || '24 Hours',
              userMissions: isChallenger ? (d.userMissions || 0) : (d.opponentMissions || 0),
              opponentMissions: isChallenger ? (d.opponentMissions || 0) : (d.userMissions || 0),
              currentLeader: d.currentLeader || character?.name || 'Vekta',
              liveFeed: d.liveFeed || [],
              createdAt: d.createdAt || new Date().toISOString(),
            });
          }
        });

        if (isMounted) {
          setIncomingDuels(pending);
          if (activeServerDuels.length > 0) {
            setActiveDuels(prev => {
              const map = new Map();
              (prev || []).forEach(item => map.set(item.id, item));
              activeServerDuels.forEach(item => map.set(item.id, { ...map.get(item.id), ...item }));
              return Array.from(map.values());
            });
          }
        }
      } catch (err) {
        // Quiet catch
      }
    }

    if (currentUser?.email || currentUser?.uid) {
      fetchMyDuels();
      const interval = setInterval(fetchMyDuels, 15000);
      return () => { isMounted = false; clearInterval(interval); };
    }
  }, [currentUser, character]);

  const handleRespondDuel = async (duelId, action) => {
    try {
      const duelRef = doc(db, 'duels', duelId);

      if (action === 'accept') {
        await updateDoc(duelRef, { status: 'active', acceptedAt: new Date().toISOString() });

        // Immediately add duel to activeDuels state and navigate
        const d = incomingDuels.find(item => item.id === duelId);
        if (d) {
          const formatted = {
            id: d.id,
            opponent: {
              name: d.challengerName || 'Challenger',
              rank: 'Recruit Rank',
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${d.challengerName || d.id}`,
              career: 'Software Engineer',
              level: 1,
            },
            duration: d.duration || '24 Hours',
            category: d.category || 'General Discipline',
            status: 'active',
            userScore: 0,
            opponentScore: 0,
            timeRemaining: d.duration || '24 Hours',
            userMissions: 0,
            opponentMissions: 0,
            userFocusHours: 0,
            opponentFocusHours: 0,
            currentLeader: d.challengerName || character?.name || 'Vekta',
            liveFeed: [
              { id: 'lf_init', hunterName: 'System', text: `Duel Accepted! ${d.challengerName} vs ${character?.name || 'Vekta'}`, time: 'Just now' }
            ]
          };
          setActiveDuels(prev => [formatted, ...(prev || [])]);
          setViewingDuel(formatted);
        }
      } else if (action === 'decline') {
        await updateDoc(duelRef, { status: 'declined', declinedAt: new Date().toISOString() });
      }

      setIncomingDuels(prev => prev.filter(d => d.id !== duelId));
    } catch (e) {
      console.warn('[Respond Duel Error]:', e);
    }
  };

  // Deduplicate users strictly by unique email address
  const localHunters = hunters || [];
  const combinedMap = new Map();
  const currentEmail = (currentUser?.email || '').toLowerCase().trim();

  // Add backend registered users first (deduplicated by unique email)
  registeredUsers.forEach(u => {
    const emailKey = (u.email || '').toLowerCase().trim();
    const idKey = u.id || u.name;
    const key = emailKey || idKey;

    // Filter out currently logged-in user
    if (emailKey && currentEmail && emailKey === currentEmail) return;
    if (u.id === currentUser?.uid) return;

    if (key && !combinedMap.has(key)) {
      combinedMap.set(key, u);
    }
  });

  // Add local manual partners
  localHunters.forEach(h => {
    const emailKey = (h.email || '').toLowerCase().trim();
    const idKey = h.id || h.name;
    const key = emailKey || idKey;

    if (emailKey && currentEmail && emailKey === currentEmail) return;
    if (h.id === currentUser?.uid) return;

    if (key && !combinedMap.has(key)) {
      combinedMap.set(key, h);
    }
  });

  const allHunters = Array.from(combinedMap.values());
  const safeRequests = friendRequests || [];
  const safeDuels = activeDuels || [];

  const filteredHunters = allHunters.filter(h => {
    const term = searchTerm.toLowerCase().trim();
    return (
      h.name.toLowerCase().includes(term) ||
      h.career.toLowerCase().includes(term) ||
      (h.handle && h.handle.toLowerCase().includes(term)) ||
      (h.email && h.email.toLowerCase().includes(term))
    );
  });

  // Demo cleanup is handled automatically on server startup

  const handleAddHunter = async (e) => {
    e.preventDefault();
    const cleanName = newHunterName.trim();
    const handleTag = cleanName.startsWith('@') ? cleanName : `@${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const target = {
      id: `h_${Date.now()}`,
      name: cleanName.replace(/^@/, ''),
      handle: handleTag,
      email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '')}@system.elite`,
      rank: 'E-Rank Hunter',
      level: 1,
      career: newHunterCareer,
    };

    addHunter(target);

    try {
      await addDoc(collection(db, 'connections'), {
        senderId: currentUser?.uid || character?.id || 'user_local',
        senderName: character?.name || 'Vekta',
        senderHandle: character?.userIdTag || `@${(character?.name || 'hunter').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        senderEmail: currentUser?.email || character?.email || '',
        targetId: target.id,
        targetName: target.name,
        targetHandle: target.handle,
        targetEmail: target.email,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      // Quiet catch — local hunter added to state regardless
    }

    setNewHunterName('');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-16">
      {/* 1. Top Section - Header & Key Metrics */}
      <section className="apple-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase tracking-wider">
              Real Firebase Firestore Arena
            </span>
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Real Hunters Network</h1>
          <p className="text-sm font-medium text-primary-muted mt-1">
            Live database of unique registered players signed up on MindForge. Compete, duel, and grow together.
          </p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Signed-Up Hunters</span>
            <span className="text-xl font-black text-primary">{allHunters.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Active Duels</span>
            <span className="text-xl font-black text-gold">{safeDuels.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Win Rate</span>
            <span className="text-xl font-black text-emerald-600">0%</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-border-subtle flex flex-col">
            <span className="text-[10px] font-bold text-primary-muted uppercase">Weekly Rank</span>
            <span className="text-xl font-black text-primary">Unranked</span>
          </div>
        </div>
      </section>

      {/* 2. Active Duels Arena Section (If any active duels exist) */}
      {safeDuels.length > 0 && (
        <section className="apple-card p-6 border-2 border-gold flex flex-col gap-4 shadow-md bg-gold-light/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gold text-2xl animate-pulse">swords</span>
              <h3 className="text-base font-black text-primary uppercase tracking-wider">
                Active Duels Arena ({safeDuels.length})
              </h3>
            </div>
            <span className="text-xs font-bold text-gold">LIVE COMPETITION IN PROGRESS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeDuels.map(d => (
              <div key={d.id} className="p-5 rounded-2xl bg-surface-card border border-gold/40 flex flex-col justify-between gap-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase">
                    {d.category || 'General'}
                  </span>
                  <span className="text-xs font-bold text-gold">⏱ {d.timeRemaining} Left</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-primary-muted uppercase">YOU</span>
                    <h4 className="font-black text-base text-primary">{d.userScore} PTS</h4>
                  </div>
                  <div className="text-center font-black text-gold text-sm">VS</div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-primary-muted uppercase">{d.opponent?.name || 'Opponent'}</span>
                    <h4 className="font-black text-base text-primary">{d.opponentScore || 0} PTS</h4>
                  </div>
                </div>

                <button
                  onClick={() => setViewingDuel(d)}
                  className="w-full py-3 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">sports_score</span>
                  Enter Active Duel Arena ⚔️
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Incoming Live Duel Challenges Alert Section */}
      {incomingDuels.length > 0 && (
        <section className="apple-card p-6 border-2 border-gold/60 bg-gold-light/60 flex flex-col gap-4 shadow-md animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gold animate-ping"></span>
            <h3 className="text-base font-black text-primary uppercase tracking-wider">
              ⚔️ Incoming Live Duel Challenges ({incomingDuels.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingDuels.map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-surface-card border border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full gold-gradient text-white uppercase">
                      {d.duration || '24h'} {d.category || 'Discipline'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-primary mt-1">
                    Challenged by <strong className="text-gold">{d.challengerName || 'A Hunter'}</strong>
                  </h4>
                  <p className="text-xs text-primary-muted font-medium mt-0.5">
                    Category: {d.category || 'General Discipline'} • Duration: {d.duration || '24 Hours'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespondDuel(d.id, 'accept')}
                    className="px-4 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
                  >
                    Accept Challenge ⚔️
                  </button>
                  <button
                    onClick={() => handleRespondDuel(d.id, 'decline')}
                    className="px-3.5 py-2.5 rounded-xl bg-surface-subtle text-primary-muted font-bold text-xs border border-border-subtle hover:text-primary"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Large Search Bar & Add Hunter Action */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="apple-card p-4 flex-1 flex items-center gap-3 shadow-sm">
          <span className="material-symbols-outlined text-primary-muted text-2xl pl-2">search</span>
          <input
            type="text"
            placeholder="Search real registered Hunters or Career..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm text-primary font-bold focus:outline-none placeholder:text-primary-muted/70"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg text-primary-muted hover:bg-surface-subtle"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-4 rounded-3xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          + Add Real Hunter Partner
        </button>
      </section>

      {/* 5. Friend Requests Section */}
      {safeRequests.length > 0 && (
        <section className="apple-card p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-gold">person_add</span>
            Incoming Friend Requests ({safeRequests.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeRequests.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={req.hunter.avatar} alt={req.hunter.name} className="w-12 h-12 rounded-2xl object-cover border border-border-subtle" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-primary">{req.hunter.name}</h4>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded gold-gradient text-white uppercase">{req.hunter.rank}</span>
                    </div>
                    <p className="text-xs text-primary-muted">{req.hunter.career}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptFriendRequest(req.id)}
                    className="px-3.5 py-2 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-sm hover:scale-105 transition-transform"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(req.id)}
                    className="px-3.5 py-2 rounded-xl bg-surface text-primary-muted font-bold text-xs border border-border-subtle hover:text-primary"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Connected Hunters Grid (Real Unique Firestore Users) */}
      <section className="apple-card p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-gold">groups</span>
              Real Registered Hunters ({filteredHunters.length})
            </h3>
            <p className="text-xs text-primary-muted font-medium">Unique real accounts registered in Firebase Cloud Firestore database.</p>
          </div>
        </div>

        {loadingUsers ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 rounded-full border-4 border-gold border-t-transparent animate-spin"></div>
          </div>
        ) : filteredHunters.length === 0 ? (
          <div className="p-12 rounded-3xl bg-surface-subtle border border-border-subtle flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-gold-light/60 border border-gold/30 text-gold flex items-center justify-center text-3xl shadow-sm">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <h4 className="font-extrabold text-base text-primary">No Other Hunters Found</h4>
            <p className="text-xs text-primary-muted max-w-sm">
              When new players register on MindForge (via Google, GitHub, or Email), their profiles will automatically appear here.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2.5 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
            >
              + Add First Real Hunter Partner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHunters.map(h => (
              <div key={h.id} className="apple-card p-6 flex flex-col justify-between gap-5 border border-border-subtle apple-card-hover">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={h.avatar} alt={h.name} className="w-14 h-14 rounded-2xl object-cover border border-border-subtle shadow-sm" />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      h.onlineStatus === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} title={h.onlineStatus}></span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded gold-gradient text-white uppercase">{h.rank}</span>
                      <span className="text-xs font-semibold text-primary-muted">Lvl {h.level}</span>
                    </div>
                    <h4 className="font-extrabold text-base text-primary mt-0.5">{h.name}</h4>
                    {h.handle && <p className="text-xs font-mono font-bold text-gold">{h.handle}</p>}
                    <p className="text-xs text-primary-muted font-medium">{h.career}</p>
                    {h.email && <p className="text-[10px] text-primary-muted/70 font-mono mt-0.5">{h.email}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedHunterProfile(h)}
                    className="flex-1 py-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-primary font-bold text-xs hover:bg-white transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setCompareHunter(h)}
                    className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle text-gold hover:bg-gold-light/40 transition-colors"
                    title="Compare Mode"
                  >
                    <span className="material-symbols-outlined text-base">compare_arrows</span>
                  </button>
                  <button
                    onClick={() => setChallengeHunter(h)}
                    className="flex-1 py-2.5 rounded-xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform"
                  >
                    Challenge ⚔️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Hunter Partner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-surface w-full max-w-md rounded-3xl p-6 shadow-2xl border border-border-subtle flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-black text-lg text-primary">Connect Real Hunter Partner</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl text-primary-muted">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddHunter} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-bold text-primary mb-1">Partner's Real Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={newHunterName}
                  onChange={e => setNewHunterName(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-primary mb-1">Primary Career / Discipline</label>
                <select
                  value={newHunterCareer}
                  onChange={e => setNewHunterCareer(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-border-subtle bg-surface-subtle text-primary font-bold"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Entrepreneur">Entrepreneur</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Doctor / Medical Specialist">Doctor / Medical Specialist</option>
                  <option value="Student">Student</option>
                  <option value="Athlete">Athlete</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl gold-gradient text-white font-extrabold text-xs shadow-md hover:scale-105 transition-transform mt-2"
              >
                + Connect Partner to Network
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
