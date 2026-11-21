import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Clock3,
  Coffee, Heart, Leaf, ListChecks, Mail, Plus, RefreshCw,
  Search, Settings2, ShoppingBasket, Sparkles, UtensilsCrossed, X,
} from 'lucide-react';
import {
  createDemoState, defaultProfile, formatWeek, generatePlan, getRecipe, getWeekStart,
  ingredientCategories, localDateKey, makeSlotKey, mealTypes, recipeAllowed, recipes,
  recipeFitsSlot, rejectionKey, weekdays,
} from './data/recipes';
import { getSession, loadState, saveState, sendSignInLink, signOut, supabase, watchAuth } from './data/storage';

const navigation = [
  { id: 'planner', label: 'My week', icon: UtensilsCrossed },
  { id: 'pantry', label: 'My pantry', icon: Leaf },
  { id: 'shopping', label: 'Shopping list', icon: ShoppingBasket },
  { id: 'preferences', label: 'Preferences', icon: Settings2 },
];

const categoryFor = (name) => {
  const lower = name.toLowerCase();
  if (/rice|dal|poha|flour|roti|paratha|luchi|cornflakes|sooji|batter|chana|chickpea/.test(lower)) return 'Grains & pulses';
  if (/egg|milk|curd|paneer|butter/.test(lower)) return 'Dairy & eggs';
  if (/chicken|fish/.test(lower)) return 'Meat & fish';
  if (/onion|potato|tomato|carrot|peas|cucumber|lemon|coriander/.test(lower)) return 'Vegetables';
  return 'Pantry';
};

const titleCase = (value) => value.replace(/\b\w/g, (letter) => letter.toUpperCase());
const safeArray = (value) => Array.isArray(value) ? value : [];

function keepCompatibleSlots(plan, profile, pinned) {
  let updated = plan;
  weekdays.forEach((day) => mealTypes.forEach((meal) => {
    const key = makeSlotKey(day, meal);
    const slot = plan?.[key];
    const recipe = getRecipe(slot?.recipeId);
    if (recipe && !recipeFitsSlot(recipe, profile, pinned, day, meal)) {
      if (updated === plan) updated = { ...plan };
      updated[key] = { recipeId: 'decide', accepted: false, reason: 'Your preferences changed. Generate a fresh suggestion for this meal.' };
    }
  }));
  return updated;
}

function getShoppingItems(state, plan) {
  const home = new Set(state.pantry.filter((item) => item.status === 'home').map((item) => item.name.toLowerCase()));
  const buy = new Map(state.pantry.filter((item) => item.status === 'buy').map((item) => [item.name.toLowerCase(), item]));
  const used = new Set();
  Object.values(plan).forEach((slot) => {
    if (!slot?.accepted) return;
    const recipe = getRecipe(slot.recipeId);
    recipe?.ingredients.forEach((ingredient) => {
      if (!home.has(ingredient.toLowerCase()) && buy.has(ingredient.toLowerCase())) used.add(ingredient.toLowerCase());
    });
  });
  const automatic = [...used].map((name) => {
    const pantryItem = buy.get(name);
    return {
      id: `pantry-${state.activeWeek}-${pantryItem.id}`,
      name: pantryItem.name,
      detail: pantryItem.quantity ? `${pantryItem.quantity} ${pantryItem.unit}` : '',
      category: pantryItem.category,
      source: 'pantry',
    };
  });
  return [...automatic, ...state.shopping.filter((item) => item.source === 'custom')];
}

function createIdeaList(state, plan) {
  const inPlan = new Set(Object.values(plan).map((slot) => slot?.recipeId));
  const ideaPrefix = `idea:${state.activeWeek}:`;
  const existing = new Set(state.rejected.filter((id) => id.startsWith(ideaPrefix)).map((id) => id.slice(ideaPrefix.length)));
  return recipes.filter((recipe) =>
    !inPlan.has(recipe.id) &&
    recipeAllowed(recipe, { ...state.profile, pinned: state.pinned }) &&
    weekdays.some((day) => mealTypes.some((meal) =>
      !plan[makeSlotKey(day, meal)]?.accepted &&
      recipeFitsSlot(recipe, state.profile, state.pinned, day, meal),
    )) &&
    !existing.has(recipe.id),
  ).slice(0, 3);
}

function App() {
  const [state, setState] = useState(createDemoState);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const [page, setPage] = useState('planner');
  const [search, setSearch] = useState('');
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: 'pcs', status: 'home' });
  const [newShoppingItem, setNewShoppingItem] = useState('');
  const [accountOpen, setAccountOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const profile = { ...defaultProfile, ...state.profile };
  const plan = state.plans?.[state.activeWeek] || {};
  const shoppingItems = useMemo(() => getShoppingItems(state, plan), [state, plan]);

  useEffect(() => {
    let active = true;
    const initialize = async () => {
      try {
        const currentSession = await getSession();
        const loaded = await loadState(currentSession);
        if (active) {
          setSession(currentSession);
          setState(loaded);
          setReady(true);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
          setReady(true);
        }
      }
    };
    initialize();
    const unsubscribe = watchAuth(async (nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (nextSession) {
        try {
          const cloudState = await loadState(nextSession);
          if (active) setState(cloudState);
        } catch (loadError) {
          if (active) setError(loadError.message);
        }
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const timer = window.setTimeout(async () => {
      setSaving(true);
      try {
        await saveState(state, session);
        setError('');
      } catch (saveError) {
        setError(saveError.message);
      } finally {
        setSaving(false);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [state, session, ready]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setAccountOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [accountOpen]);

  const update = (patch) => setState((current) => ({ ...current, ...patch }));
  const updateProfile = (patch) => setState((current) => {
    const nextProfile = { ...defaultProfile, ...current.profile, ...patch };
    const activePlan = current.plans?.[current.activeWeek] || {};
    const nextPlan = keepCompatibleSlots(activePlan, nextProfile, current.pinned);
    return {
      ...current,
      profile: nextProfile,
      plans: nextPlan === activePlan ? current.plans : { ...current.plans, [current.activeWeek]: nextPlan },
    };
  });
  const updatePinned = (pinned) => setState((current) => {
    const activePlan = current.plans?.[current.activeWeek] || {};
    const nextPlan = keepCompatibleSlots(activePlan, { ...defaultProfile, ...current.profile }, pinned);
    return {
      ...current,
      pinned,
      plans: nextPlan === activePlan ? current.plans : { ...current.plans, [current.activeWeek]: nextPlan },
    };
  });
  const updateActivePlan = (nextPlan) => setState((current) => ({
    ...current,
    plans: { ...current.plans, [current.activeWeek]: nextPlan },
  }));
  const currentPlan = () => state.plans?.[state.activeWeek] || {};
  const setSlot = (key, value) => updateActivePlan({ ...currentPlan(), [key]: value });

  const generateWeek = () => {
    const oldPlan = currentPlan();
    const rejected = new Set(state.rejected);
    Object.entries(oldPlan).forEach(([key, slot]) => {
      if (slot?.recipeId && !slot.accepted && slot.recipeId !== 'decide') rejected.add(rejectionKey(state.activeWeek, key, slot.recipeId));
    });
    const seed = { ...state, plan: Object.fromEntries(Object.entries(oldPlan).filter(([, slot]) => slot?.accepted)), rejected: [...rejected] };
    const generated = generatePlan(seed);
    updateActivePlan(generated);
    update({ rejected: [...rejected] });
    setToast('Your fresh week is ready to review.');
  };

  const replaceMeal = (key) => {
    const oldPlan = currentPlan();
    const oldSlot = oldPlan[key];
    const rejected = new Set(state.rejected);
    if (oldSlot?.recipeId && oldSlot.recipeId !== 'decide') rejected.add(rejectionKey(state.activeWeek, key, oldSlot.recipeId));
    const fixedPlan = Object.fromEntries(Object.entries(oldPlan).filter(([slotKey, slot]) => slotKey !== key && slot?.accepted));
    const generated = generatePlan({ ...state, plan: fixedPlan, rejected: [...rejected] });
    if (!generated[key] || generated[key].recipeId === oldSlot?.recipeId) {
      setSlot(key, { recipeId: 'decide', accepted: false, reason: 'No more matches for this slot yet. Try adjusting your preferences.' });
    } else {
      setSlot(key, generated[key]);
    }
    update({ rejected: [...rejected] });
    setToast('Here is another idea for this meal.');
  };

  const navigateWeek = (delta) => {
    const nextOffset = (state.weekOffset || 0) + delta;
    update({
      weekOffset: nextOffset,
      activeWeek: localDateKey(getWeekStart(nextOffset)),
    });
  };

  const resetDemo = () => {
    if (!window.confirm('Reset your MealMate demo data? This replaces the profile, pantry and plans saved in this browser.')) return;
    setState(createDemoState());
    setPage('planner');
    setToast('Demo data restored.');
  };

  const acceptIdea = (recipe) => {
    const meal = recipe.tags.includes('breakfast') ? 'breakfast' : recipe.tags.includes('lunch') ? 'lunch' : 'dinner';
    const candidates = weekdays
      .filter((day) => meal !== 'lunch' || !profile.officeDays.includes(day) || recipe.tags.includes('portable'))
      .map((day) => makeSlotKey(day, meal))
      .filter((key) => {
        const day = weekdays.find((candidate) => makeSlotKey(candidate, meal) === key);
        return !currentPlan()[key]?.accepted && recipeFitsSlot(recipe, profile, state.pinned, day, meal);
      });
    const key = candidates.find((candidate) => currentPlan()[candidate]?.recipeId === 'decide') || candidates[0];
    if (!key) {
      setToast('Accept a meal in your plan first to make room for a new idea.');
      return;
    }
    const replaced = currentPlan()[key]?.recipeId;
    if (replaced && replaced !== 'decide') {
      update({ rejected: [...new Set([...state.rejected, rejectionKey(state.activeWeek, key, replaced)])] });
    }
    setSlot(key, { recipeId: recipe.id, accepted: true, reason: 'A new idea you chose for this week.' });
    setToast(`${recipe.name} added to your week.`);
  };

  const rejectIdea = (recipe) => {
    update({ rejected: [...new Set([...state.rejected, `idea:${state.activeWeek}:${recipe.id}`])] });
    setToast('We will leave that idea out for now.');
  };

  const submitIngredient = (event) => {
    event.preventDefault();
    const name = newIngredient.name.trim();
    if (!name || name.length > 50) {
      setError('Enter an ingredient name of 1–50 characters.');
      return;
    }
    if (state.pantry.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setError('That ingredient is already in your pantry.');
      return;
    }
    update({ pantry: [...state.pantry, {
      id: `custom-${Date.now()}`,
      name,
      quantity: newIngredient.quantity.trim(),
      unit: newIngredient.unit,
      category: categoryFor(name),
      status: newIngredient.status,
    }] });
    setNewIngredient({ name: '', quantity: '', unit: 'pcs', status: 'home' });
    setError('');
    setToast(`${name} added to your pantry.`);
  };

  const submitShoppingItem = (event) => {
    event.preventDefault();
    const name = newShoppingItem.trim();
    if (!name || name.length > 60) return;
    update({ shopping: [...state.shopping.filter((item) => item.source === 'custom'), {
      id: `custom-${Date.now()}`,
      name,
      category: categoryFor(name),
      source: 'custom',
      checked: false,
    }] });
    setNewShoppingItem('');
  };

  const sendLink = async (event) => {
    event.preventDefault();
    try {
      await sendSignInLink(email.trim());
      setToast('Check your inbox for a secure sign-in link.');
      setAccountOpen(false);
    } catch (authError) {
      setError(authError.message);
    }
  };

  const signOutAccount = async () => {
    try {
      await signOut();
      setSession(null);
      setAccountOpen(false);
      setToast('Signed out. Your local demo remains available.');
    } catch (authError) {
      setError(authError.message);
    }
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!ready) return <div className="loading-screen"><div className="loading-logo">M</div><p>Setting your table…</p></div>;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); changePage('planner'); }}>
          <span className="brand-mark"><UtensilsCrossed size={20} /></span>
          <span>meal<span>mate</span><small>YOUR WEEK, MADE EASIER</small></span>
        </a>
        <div className="side-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button type="button" className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => changePage(id)} key={id} aria-current={page === id ? 'page' : undefined}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {id === 'shopping' && shoppingItems.length > 0 && <span className="nav-count">{shoppingItems.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-icon"><Heart size={16} /></span>
          <p>Good food, less<br />weekday thinking.</p>
          <span>A little plan goes a long way.</span>
          <div className="note-spark">✳</div>
        </div>
        <div className="sidebar-bottom">
          <span className={`storage-dot ${supabase ? 'cloud' : ''}`} />
          <span>{session ? 'Synced to your account' : supabase ? 'Local demo · sign in to sync' : 'Saved on this device'}</span>
          <button type="button" className="text-button reset-link" onClick={resetDemo}>Reset demo</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark"><UtensilsCrossed size={17} /></span> mealmate</div>
          <div className="breadcrumb"><span>Your kitchen</span><ChevronRight size={14} /><strong>{navigation.find((item) => item.id === page)?.label}</strong></div>
          <div className="top-actions">
            {!session && <span className="demo-badge">DEMO</span>}
            <span className="save-status">{saving ? 'Saving…' : 'All changes saved'}<span className="save-dot" /></span>
            <button type="button" className="avatar-button" onClick={() => setAccountOpen(true)} aria-label="Open account and sign in">A</button>
          </div>
        </header>

        {error && <div className="alert-banner" role="alert"><CircleHelp size={17} /><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError('')}><X size={16} /></button></div>}

        {page === 'planner' && (
          <PlannerPage
            state={state}
            profile={profile}
            plan={plan}
            shoppingItems={shoppingItems}
            onNavigate={navigateWeek}
            onGenerate={generateWeek}
            onAccept={(key) => {
              const slot = currentPlan()[key];
              if (slot) setSlot(key, { ...slot, accepted: true });
            }}
            onReject={replaceMeal}
            onSwap={replaceMeal}
            onIdeaAccept={acceptIdea}
            onIdeaReject={rejectIdea}
          />
        )}
        {page === 'pantry' && (
          <PantryPage
            state={state}
            plan={plan}
            search={search}
            setSearch={setSearch}
            newIngredient={newIngredient}
            setNewIngredient={setNewIngredient}
            onSubmit={submitIngredient}
            onUpdate={(pantry) => update({ pantry })}
          />
        )}
        {page === 'shopping' && (
          <ShoppingPage
            items={shoppingItems}
            state={state}
            newItem={newShoppingItem}
            setNewItem={setNewShoppingItem}
            onSubmit={submitShoppingItem}
            onUpdate={(shopping) => update({ shopping })}
          />
        )}
        {page === 'preferences' && (
          <PreferencesPage
            profile={profile}
              pinned={state.pinned}
            onUpdate={updateProfile}
              onPinned={updatePinned}
            onReset={resetDemo}
            onAccount={() => setAccountOpen(true)}
            session={session}
            cloudEnabled={Boolean(supabase)}
          />
        )}
        <footer className="app-footer">
          <span>Made for real weeks, not perfect ones.</span>
          <span>Protein numbers are estimates, not nutrition advice.</span>
        </footer>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={page === id ? 'selected' : ''} onClick={() => changePage(id)} aria-current={page === id ? 'page' : undefined}>
            <Icon size={19} /><span>{id === 'planner' ? 'Week' : id === 'pantry' ? 'Pantry' : id === 'shopping' ? 'Shop' : 'You'}</span>
          </button>
        ))}
      </nav>

      {accountOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAccountOpen(false); }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="account-title">
            <button type="button" className="modal-close" onClick={() => setAccountOpen(false)} aria-label="Close dialog"><X size={19} /></button>
            <span className="modal-icon"><Mail size={20} /></span>
            <p className="eyebrow">YOUR MEALMATE ACCOUNT</p>
            <h2 id="account-title">{session ? 'Your plan is in sync' : 'Take your plan with you'}</h2>
            <p className="modal-copy">{session ? `Signed in as ${session.user.email}. Your plan syncs securely to your account.` : supabase ? 'Sign in with a secure email link to sync your pantry and meal plan across devices.' : 'Your plan is saved on this device. Add Supabase credentials to enable secure sign-in and cloud sync.'}</p>
            {!session && supabase && (
              <form className="account-form" onSubmit={sendLink}>
                <label htmlFor="account-email">Email address</label>
                <input id="account-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <button className="primary-button full-button" type="submit">Email me a sign-in link <ArrowRight size={16} /></button>
              </form>
            )}
            {session && <button className="secondary-button full-button" type="button" onClick={signOutAccount}>Sign out</button>}
            {!supabase && <div className="local-note"><CheckCircle2 size={16} /> Demo mode is ready. Nothing to configure to keep planning.</div>}
          </section>
        </div>
      )}
      {toast && <div className="toast-message" role="status"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}

function PlannerPage({ state, profile, plan, shoppingItems, onNavigate, onGenerate, onAccept, onReject, onSwap, onIdeaAccept, onIdeaReject }) {
  const weekOffset = state.weekOffset || 0;
  const allSlots = Object.values(plan);
  const acceptedCount = allSlots.filter((slot) => slot?.accepted).length;
  const dailyProtein = weekdays.map((day) => mealTypes.reduce((sum, meal) => {
    const slot = plan[makeSlotKey(day, meal)];
    return sum + (getRecipe(slot?.recipeId)?.protein || 0);
  }, 0));
  const averageProtein = dailyProtein.length ? Math.round(dailyProtein.reduce((sum, value) => sum + value, 0) / 7) : 0;
  const ideas = createIdeaList(state, plan);
  return (
    <>
      <div className="page-heading planner-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> A LITTLE MORE DELICIOUS</p>
          <h1>Your week, <em>well fed.</em></h1>
          <p className="heading-subtitle">A flexible meal plan shaped around what you like and what’s in your kitchen.</p>
        </div>
        <button type="button" className="primary-button generate-button" onClick={onGenerate}><Sparkles size={16} /> Generate this week’s plan</button>
      </div>
      <div className="week-controls">
        <div>
          <p className="section-kicker">WEEK OF</p>
          <h2>{formatWeek(weekOffset)}</h2>
        </div>
        <div className="week-nav">
          <button type="button" onClick={() => onNavigate(-1)} aria-label="Previous week"><ChevronLeft size={18} /></button>
          <button type="button" className="today-button" onClick={() => onNavigate(-weekOffset)}>This week</button>
          <button type="button" onClick={() => onNavigate(1)} aria-label="Next week"><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="planner-layout">
        <section className="week-grid" aria-label="Weekly meal plan">
          {weekdays.map((day, index) => (
            <DayCard
              key={day}
              day={day}
              date={new Date(getWeekStart(weekOffset).getFullYear(), getWeekStart(weekOffset).getMonth(), getWeekStart(weekOffset).getDate() + index).getDate()}
              office={profile.officeDays.includes(day)}
              plan={plan}
              pantry={state.pantry}
              onAccept={onAccept}
              onReject={onReject}
              onSwap={onSwap}
            />
          ))}
        </section>
        <aside className="week-aside">
          <section className="summary-card">
            <div className="summary-title"><span className="summary-icon"><ListChecks size={17} /></span><span>YOUR WEEK AT A GLANCE</span><ArrowUpRight size={15} /></div>
            <div className="summary-stat"><strong>{acceptedCount}<small> / 21</small></strong><span>meals decided</span></div>
            <div className="summary-progress"><span style={{ width: `${Math.min(acceptedCount / 21 * 100, 100)}%` }} /></div>
            <div className="summary-bottom"><span>🛍️ {shoppingItems.length} shopping {shoppingItems.length === 1 ? 'item' : 'items'}</span><span>🏢 {profile.officeDays.length} office days</span></div>
          </section>
          <section className={`protein-card ${averageProtein > 0 && averageProtein < (profile.proteinGoal || 0) ? 'protein-low' : ''}`}>
            <div className="protein-heading"><span className="protein-icon">↗</span><div><span>PROTEIN, APPROX.</span><strong>{averageProtein}<small> g / day</small></strong></div></div>
            {profile.proteinGoal ? (
              <>
                <div className="protein-track"><span style={{ width: `${Math.min(averageProtein / profile.proteinGoal * 100, 100)}%` }} /></div>
                <p>{averageProtein && averageProtein < profile.proteinGoal
                      ? `Suggestions average a little below your ${profile.proteinGoal}g preference. Eggs, dal, paneer or curd could help.`
                      : `Your optional preference is ${profile.proteinGoal}g a day. Estimates are approximate.`}</p>
              </>
            ) : <p>Add an optional protein preference in your profile to see a gentle guide.</p>}
            <span className="estimate-note">An estimate, not a medical measure.</span>
          </section>
          <section className="ideas-card">
            <div className="ideas-heading"><span><Sparkles size={17} /></span><div><h3>A little something new</h3><p>Ideas to mix into your week</p></div></div>
            {ideas.length ? ideas.map((recipe) => (
              <div className="idea-row" key={recipe.id}>
                <span className="idea-emoji">{recipe.emoji}</span>
                <div className="idea-info"><strong>{recipe.name}</strong><span>{recipe.prep} min · ~{recipe.protein}g protein</span></div>
                <button type="button" className="idea-add" onClick={() => onIdeaAccept(recipe)} aria-label={`Add ${recipe.name} to this week`}><Plus size={17} /></button>
                <button type="button" className="idea-reject" onClick={() => onIdeaReject(recipe)} aria-label={`Dismiss ${recipe.name}`}><X size={14} /></button>
              </div>
            )) : <p className="ideas-empty">You’ve explored all the current ideas. Generate a fresh plan to find more.</p>}
            <div className="rule-based-note"><Sparkles size={12} /> Curated suggestions · no AI used</div>
          </section>
          <div className="aside-tip"><span>✦</span><p><strong>A gentle reminder</strong>Plans can change. Swap, skip or eat out — this is here to make your week easier.</p></div>
        </aside>
      </div>
    </>
  );
}

function DayCard({ day, date, office, plan, pantry, onAccept, onReject, onSwap }) {
  const daySlots = mealTypes.map((meal) => ({ meal, slot: plan[makeSlotKey(day, meal)] }));
  const decided = daySlots.filter(({ slot }) => slot?.accepted).length;
  const protein = daySlots.reduce((sum, { slot }) => sum + (getRecipe(slot?.recipeId)?.protein || 0), 0);
  return (
    <article className={`day-card ${office ? 'office-day' : ''}`}>
      <header className="day-header">
        <div className="day-title"><span className="date-badge">{date}</span><div><h3>{day}</h3><span>{office ? 'OFFICE DAY' : day === 'Saturday' || day === 'Sunday' ? 'TAKE IT EASY' : 'AT HOME'}</span></div></div>
        <div className="day-header-right"><span className="day-protein">~{protein}g</span><span className={`day-status ${decided === 3 ? 'complete' : ''}`}>{decided === 3 ? <Check size={12} /> : `${decided}/3`}</span></div>
      </header>
      <div className="meal-list">
        {daySlots.map(({ meal, slot }) => (
          <MealCard key={meal} day={day} meal={meal} slot={slot} office={office && meal === 'lunch'} pantry={pantry} onAccept={onAccept} onReject={onReject} onSwap={onSwap} />
        ))}
      </div>
    </article>
  );
}

function MealCard({ day, meal, slot, office, pantry, onAccept, onReject, onSwap }) {
  const recipe = getRecipe(slot?.recipeId);
  const key = makeSlotKey(day, meal);
  const mealLabel = meal === 'breakfast' ? 'BREAKFAST' : meal === 'lunch' ? 'LUNCH' : 'DINNER';
  if (!recipe || recipe.id === 'decide') {
    return <div className="meal-slot empty-slot"><span className="meal-time">{mealLabel}</span><div className="empty-meal"><Coffee size={17} /><span>Decide later</span></div><p className="empty-meal-reason">{slot?.reason || 'Keep this meal flexible, or ask for an idea.'}</p><button type="button" className="tiny-action" onClick={() => onSwap(key)} aria-label={`Suggest ${meal} for ${day}`}><RefreshCw size={14} /></button></div>;
  }
  const pending = !slot?.accepted;
  const homeNames = new Set(pantry.filter((item) => item.status === 'home').map((item) => item.name.toLowerCase()));
  const buyNames = new Set(pantry.filter((item) => item.status === 'buy').map((item) => item.name.toLowerCase()));
  const missing = recipe.ingredients.filter((ingredient) => !homeNames.has(ingredient.toLowerCase()));
  const buyMissing = missing.filter((ingredient) => buyNames.has(ingredient.toLowerCase()));
  const dietLabel = recipe.diet === 'veg' ? 'VEG' : recipe.diet === 'egg' ? 'EGG' : recipe.diet === 'fish' ? 'FISH' : 'CHICKEN';
  const reason = office ? 'Packs well for your office lunch.' : recipe.id === 'bun-maska' ? 'An easy Pune café treat for the weekend.' : pending && missing.length ? `You may want to pick up ${missing.slice(0, 2).join(' & ')}.` : slot?.reason || 'A good fit for your week.';
  return (
    <div className={`meal-slot ${pending ? 'pending-meal' : ''}`}>
      <div className="meal-topline"><span className="meal-time">{mealLabel}</span>{office && <span className="pack-tag">PACKABLE</span>}</div>
      <div className="meal-main">
        <span className="meal-emoji" aria-hidden="true">{recipe.emoji}</span>
        <div className="meal-copy"><strong>{recipe.name}</strong><p>{recipe.description}</p></div>
      </div>
      <div className="meal-metadata"><span><Clock3 size={12} />{recipe.prep ? `${recipe.prep} min` : 'Eat out'}</span><span className={`diet-tag diet-${recipe.diet}`}>{dietLabel}</span><span><span className="protein-dot">↗</span>~{recipe.protein}g</span></div>
      {missing.length > 0 && <div className={`missing-tag ${buyMissing.length ? 'buy-missing' : ''}`}><ShoppingBasket size={12} /><span>{buyMissing.length ? `Can buy: ${buyMissing.slice(0, 2).join(', ')}${buyMissing.length > 2 ? ` +${buyMissing.length - 2}` : ''}` : `Check pantry: ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? ` +${missing.length - 2}` : ''}`}</span></div>}
      <p className="meal-reason">{recipe.tags.includes('eatout') ? 'A flexible meal out — no prep needed.' : reason}</p>
      <div className="meal-actions">
        {pending ? <button type="button" className="accept-button" onClick={() => onAccept(key)}><Check size={13} /> Looks good</button> : <span className="accepted-label"><CheckCircle2 size={14} /> In your plan</span>}
        <div className="meal-action-right">
          <button type="button" onClick={() => onSwap(key)} aria-label={`Swap ${recipe.name}`} title="Try another meal"><RefreshCw size={14} /></button>
          {pending && <button type="button" onClick={() => onReject(key)} aria-label={`Skip ${recipe.name}`} title="Skip this idea"><X size={15} /></button>}
        </div>
      </div>
    </div>
  );
}

function PantryPage({ state, plan, search, setSearch, newIngredient, setNewIngredient, onSubmit, onUpdate }) {
  const filtered = state.pantry.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const usedBy = (item) => Object.entries(plan).flatMap(([key, slot]) => {
    const recipe = slot?.recipeId && getRecipe(slot.recipeId);
    return recipe?.ingredients.some((ingredient) => ingredient.toLowerCase() === item.name.toLowerCase())
      ? [`${titleCase(key.split('-').slice(0, -1).join(' '))} · ${titleCase(key.split('-').at(-1))}`]
      : [];
  });
  const remove = (id) => onUpdate(state.pantry.filter((item) => item.id !== id));
  const updateItem = (id, patch) => onUpdate(state.pantry.map((item) => item.id === id ? { ...item, ...patch } : item));
  return (
    <>
      <div className="page-heading simple-heading">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> WHAT’S IN YOUR KITCHEN?</p><h1>Your pantry <em>list.</em></h1><p className="heading-subtitle">Only things you add show up here. We’ll use this list to make your plan fit.</p></div>
      </div>
      <section className="pantry-toolbar">
        <div className="search-field"><Search size={17} /><input type="search" aria-label="Search ingredients" placeholder="Search your ingredients" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="pantry-legend"><span><i className="status-dot home-dot" /> At home</span><span><i className="status-dot buy-dot" /> Can buy</span></div>
      </section>
      <section className="pantry-list-panel">
        <div className="panel-title-row"><div><h2>Ingredients <span>{filtered.length}</span></h2><p>Update quantities or change an item’s status anytime.</p></div></div>
        {filtered.length ? <div className="ingredient-list">
          {filtered.map((item) => {
            const uses = usedBy(item);
            return <div className="ingredient-row" key={item.id}>
              <span className={`ingredient-icon ${item.status === 'buy' ? 'buy-icon' : ''}`}>{item.status === 'buy' ? <ShoppingBasket size={17} /> : <Leaf size={17} />}</span>
              <div className="ingredient-name"><strong>{item.name}</strong><span>{item.category}</span>{uses.length > 0 && <small>Planned for: {uses.slice(0, 2).join(', ')}{uses.length > 2 ? ` +${uses.length - 2}` : ''}</small>}</div>
              <div className="ingredient-quantity"><input aria-label={`${item.name} quantity`} value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: event.target.value })} /><span>{item.unit}</span></div>
              <select aria-label={`${item.name} availability`} value={item.status} onChange={(event) => updateItem(item.id, { status: event.target.value })}><option value="home">At home</option><option value="buy">Can buy</option></select>
              <button type="button" className="remove-button" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}><X size={16} /></button>
            </div>;
          })}
        </div> : <div className="empty-state"><span>🧺</span><h3>{search ? 'Nothing found' : 'Your pantry is ready for a fresh start'}</h3><p>{search ? 'Try another search.' : 'Add what you have at home, or ingredients you’re happy to pick up.'}</p></div>}
      </section>
      <section className="add-ingredient-panel">
        <div className="add-panel-icon"><Plus size={18} /></div><div className="add-panel-heading"><h3>Add an ingredient</h3><p>Custom ingredients and quantities are welcome.</p></div>
        <form className="add-ingredient-form" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="ingredient-name">Ingredient name</label><input id="ingredient-name" placeholder="e.g. moong dal" value={newIngredient.name} onChange={(event) => setNewIngredient({ ...newIngredient, name: event.target.value })} required maxLength={50} />
          <label className="sr-only" htmlFor="ingredient-quantity">Quantity</label><input id="ingredient-quantity" className="quantity-input" placeholder="Qty" value={newIngredient.quantity} onChange={(event) => setNewIngredient({ ...newIngredient, quantity: event.target.value })} maxLength={20} />
          <label className="sr-only" htmlFor="ingredient-unit">Unit</label><select id="ingredient-unit" value={newIngredient.unit} onChange={(event) => setNewIngredient({ ...newIngredient, unit: event.target.value })}>{['pcs', 'g', 'kg', 'ml', 'L', 'pack', 'box', 'bunch'].map((unit) => <option key={unit}>{unit}</option>)}</select>
          <label className="sr-only" htmlFor="ingredient-status">Availability</label><select id="ingredient-status" value={newIngredient.status} onChange={(event) => setNewIngredient({ ...newIngredient, status: event.target.value })}><option value="home">At home</option><option value="buy">Can buy</option></select>
          <button type="submit" className="primary-button"><Plus size={16} /> Add</button>
        </form>
      </section>
      <p className="pantry-hint"><CircleHelp size={15} /> A recipe may use ingredients not in this list. We’ll flag them for a pantry check, never assume you have them.</p>
    </>
  );
}

function ShoppingPage({ items, state, newItem, setNewItem, onSubmit, onUpdate }) {
  const groups = ingredientCategories.map((category) => ({ category, items: items.filter((item) => item.category === category) })).filter((group) => group.items.length);
  const checkedCount = items.filter((item) => state.shopping.some((saved) => saved.id === item.id && saved.checked)).length;
  const toggle = (item) => {
    const existing = state.shopping.find((saved) => saved.id === item.id);
    const next = existing
      ? state.shopping.map((saved) => saved.id === item.id ? { ...saved, checked: !saved.checked } : saved)
      : [...state.shopping, { ...item, checked: true }];
    onUpdate(next);
  };
  const removeCustom = (id) => onUpdate(state.shopping.filter((item) => item.id !== id));
  return (
    <>
      <div className="page-heading simple-heading">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> YOUR MARKET RUN</p><h1>Shopping, <em>sorted.</em></h1><p className="heading-subtitle">Only “Can buy” ingredients used in meals you’ve accepted are added automatically.</p></div>
      </div>
      <section className="shopping-summary"><span className="shopping-big-icon"><ShoppingBasket size={21} /></span><div>      <strong>{items.length - checkedCount} {items.length - checkedCount === 1 ? 'thing' : 'things'} left</strong><span>{checkedCount} of {items.length} checked off · Based on this week’s accepted meals</span></div><button type="button" className="text-button" onClick={() => onUpdate(state.shopping.map((item) => ({ ...item, checked: false })))}>Clear checks</button></section>
      {items.length ? <div className="shopping-groups">{groups.map(({ category, items: groupItems }) => (
        <section className="shopping-group" key={category}><h2>{category}<span>{groupItems.length}</span></h2>
          {groupItems.map((item) => {
            const checked = Boolean(state.shopping.find((saved) => saved.id === item.id)?.checked);
            return <div className={`shopping-row ${checked ? 'is-checked' : ''}`} key={item.id}>
              <button type="button" className="check-box" onClick={() => toggle(item)} aria-label={`${checked ? 'Uncheck' : 'Check off'} ${item.name}`}>{checked && <Check size={14} />}</button>
              <span className="shopping-item-name">{item.name}</span><span className="shopping-item-detail">{item.detail || (item.source === 'custom' ? 'Added by you' : '')}</span>
              {item.source === 'custom' && <button type="button" className="remove-button" onClick={() => removeCustom(item.id)} aria-label={`Remove ${item.name}`}><X size={15} /></button>}
            </div>;
          })}
        </section>
      ))}</div> : <div className="empty-state shopping-empty"><span>🛍️</span><h3>Your list is looking light</h3><p>Accept a planned meal that uses an ingredient marked “Can buy”, or add something yourself below.</p></div>}
      <form className="add-shopping-form" onSubmit={onSubmit}><label className="sr-only" htmlFor="shopping-custom">Add your own item</label><input id="shopping-custom" placeholder="Add something else to your list…" value={newItem} onChange={(event) => setNewItem(event.target.value)} maxLength={60} /><button type="submit" className="secondary-button"><Plus size={16} /> Add item</button></form>
      <div className="shopping-note"><CircleHelp size={15} /> Shopping suggestions come only from ingredients you marked “Can buy”. Check pantry availability before you shop.</div>
    </>
  );
}

function PreferencesPage({ profile, pinned, onUpdate, onPinned, onReset, onAccount, session, cloudEnabled }) {
  const [dishInput, setDishInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');
  const [avoidInput, setAvoidInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const toggleArrayValue = (key, value) => {
    const list = safeArray(profile[key]);
    if (key === 'officeDays' && !list.includes(value) && list.length >= 2) return;
    onUpdate({ [key]: list.includes(value) ? list.filter((item) => item !== value) : [...list, value] });
  };
  const addTextValue = (event, key, value, setValue) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || text.length > 50 || safeArray(profile[key]).some((item) => item.toLowerCase() === text.toLowerCase())) return;
    onUpdate({ [key]: [...safeArray(profile[key]), text] });
    setValue('');
  };
  const removeValue = (key, value) => {
    onUpdate({ [key]: safeArray(profile[key]).filter((item) => item !== value) });
    if (key === 'preferredDishes') onPinned(safeArray(pinned).filter((item) => item !== value));
  };
  const addDish = (event) => {
    event.preventDefault();
    const text = dishInput.trim();
    if (!text || text.length > 50 || profile.preferredDishes.some((item) => item.toLowerCase() === text.toLowerCase())) return;
    onUpdate({ preferredDishes: [...profile.preferredDishes, text] });
    onPinned([...safeArray(pinned), text]);
    setDishInput('');
  };
  return (
    <>
      <div className="page-heading simple-heading">
        <div><p className="eyebrow"><span className="eyebrow-dot" /> IT’S YOUR TABLE</p><h1>Your kind of <em>food.</em></h1><p className="heading-subtitle">A few preferences help us suggest meals that actually fit. Change them anytime.</p></div>
      </div>
      <div className="preferences-layout">
        <div className="preferences-main">
          <section className="preference-card"><div className="preference-card-heading"><span>01</span><div><h2>Your week</h2><p>We’ll keep office lunches practical and packable.</p></div></div>
            <div className="field-block"><label>Which days do you usually go to the office?</label><div className="choice-row">{weekdays.map((day) => <button key={day} type="button" aria-pressed={profile.officeDays.includes(day)} className={`choice-chip ${profile.officeDays.includes(day) ? 'chosen' : ''}`} onClick={() => toggleArrayValue('officeDays', day)}>{day.slice(0, 3)}</button>)}</div><span className="field-hint">Choose up to two weekdays; office lunches will be packable.</span></div>
            <div className="field-grid">
              <label className="field-block"><span>Dietary pattern</span><select value={profile.diet} onChange={(event) => onUpdate({ diet: event.target.value })}><option value="non-vegetarian">Non-vegetarian</option><option value="eggetarian">Eggetarian</option><option value="vegetarian">Vegetarian</option></select></label>
              <label className="field-block"><span>Spice preference</span><select value={profile.spice} onChange={(event) => onUpdate({ spice: event.target.value })}><option>Mild</option><option>Medium</option><option>Spicy</option></select></label>
            </div>
          </section>
          <section className="preference-card"><div className="preference-card-heading"><span>02</span><div><h2>What you enjoy</h2><p>Choose your favourites or add dishes you’re craving.</p></div></div>
            <div className="field-block"><label>Favourite cuisines</label><div className="choice-row cuisine-chips">{['Bengali', 'Indian', 'South Indian', 'Pune café'].map((cuisine) => <button key={cuisine} type="button" aria-pressed={profile.cuisines.includes(cuisine)} className={`choice-chip ${profile.cuisines.includes(cuisine) ? 'chosen' : ''}`} onClick={() => toggleArrayValue('cuisines', cuisine)}>{cuisine}</button>)}</div></div>
            <div className="field-block"><label>Want to eat this week?</label><div className="tag-list">{profile.preferredDishes.map((dish) => <span className="user-tag" key={dish}>{dish}<button type="button" className={`pin-toggle ${pinned.includes(dish) ? 'is-pinned' : ''}`} aria-label={`${pinned.includes(dish) ? 'Unpin' : 'Pin'} ${dish}`} aria-pressed={pinned.includes(dish)} onClick={() => onPinned(pinned.includes(dish) ? pinned.filter((item) => item !== dish) : [...pinned, dish])}>★</button><button type="button" aria-label={`Remove ${dish}`} onClick={() => removeValue('preferredDishes', dish)}><X size={13} /></button></span>)}</div><form className="inline-add-form" onSubmit={addDish}><input placeholder="e.g. aloo posto" value={dishInput} onChange={(event) => setDishInput(event.target.value)} maxLength={50} /><button className="secondary-button" type="submit"><Plus size={15} /> Add & pin</button></form></div>
          </section>
          <section className="preference-card"><div className="preference-card-heading"><span>03</span><div><h2>Things to keep in mind</h2><p>Suggestions avoid anything you list here.</p></div></div>
            <div className="field-block"><label htmlFor="dislike-input">Disliked ingredients</label><div className="tag-list">{profile.dislikes.map((item) => <span className="user-tag muted-tag" key={item}>{item}<button type="button" aria-label={`Remove dislike ${item}`} onClick={() => removeValue('dislikes', item)}><X size={13} /></button></span>)}</div><form className="inline-add-form" onSubmit={(event) => addTextValue(event, 'dislikes', dislikeInput, setDislikeInput)}><input id="dislike-input" placeholder="e.g. mushrooms" value={dislikeInput} onChange={(event) => setDislikeInput(event.target.value)} maxLength={50} /><button className="secondary-button" type="submit"><Plus size={15} /> Add</button></form></div>
            <div className="field-block"><label htmlFor="avoid-dishes">Meals to avoid this week</label><div className="tag-list">{profile.avoidDishes.map((item) => <span className="user-tag muted-tag" key={item}>{item}<button type="button" aria-label={`Remove avoided meal ${item}`} onClick={() => removeValue('avoidDishes', item)}><X size={13} /></button></span>)}</div><form className="inline-add-form" onSubmit={(event) => addTextValue(event, 'avoidDishes', avoidInput, setAvoidInput)}><input id="avoid-dishes" placeholder="e.g. poha" value={avoidInput} onChange={(event) => setAvoidInput(event.target.value)} maxLength={50} /><button className="secondary-button" type="submit"><Plus size={15} /> Add</button></form></div>
            <div className="field-block"><label htmlFor="allergy-input">Allergies</label><div className="tag-list">{profile.allergies.map((item) => <span className="user-tag allergy-tag" key={item}>{item}<button type="button" aria-label={`Remove allergy ${item}`} onClick={() => removeValue('allergies', item)}><X size={13} /></button></span>)}</div><form className="inline-add-form" onSubmit={(event) => addTextValue(event, 'allergies', allergyInput, setAllergyInput)}><input id="allergy-input" placeholder="e.g. peanuts" value={allergyInput} onChange={(event) => setAllergyInput(event.target.value)} maxLength={50} /><button className="secondary-button" type="submit"><Plus size={15} /> Add</button></form></div>
            <div className="field-block"><label className="checkbox-setting"><input type="checkbox" checked={profile.includeFish} onChange={(event) => onUpdate({ includeFish: event.target.checked })} /><span>Include fish in meal suggestions <small>Off by default; fish is optional.</small></span></label></div>
          </section>
          <section className="preference-card"><div className="preference-card-heading"><span>04</span><div><h2>Your cooking rhythm</h2><p>Keep this flexible — there’s no perfect number.</p></div></div>
            <div className="field-grid">
              <label className="field-block"><span>Usually happy to cook up to</span><span className="range-value">{profile.cookTime} minutes</span><input type="range" min="10" max="90" step="5" value={profile.cookTime} onChange={(event) => onUpdate({ cookTime: Number(event.target.value) })} /></label>
              <label className="field-block"><span>Meals out or kept flexible</span><span className="range-value">{profile.mealsOut} per week</span><input type="range" min="0" max="7" value={profile.mealsOut} onChange={(event) => onUpdate({ mealsOut: Number(event.target.value) })} /></label>
              <label className="field-block"><span>Optional protein preference</span><span className="range-value">{profile.proteinGoal ? `${profile.proteinGoal}g / day` : 'Not set'}</span><input type="range" min="0" max="150" step="5" value={profile.proteinGoal} onChange={(event) => onUpdate({ proteinGoal: Number(event.target.value) })} /><span className="field-hint">Set to 0 to turn this guide off. Estimates are approximate.</span></label>
              <label className="field-block"><span>Meals you’d like to cook</span><span className="range-value">{profile.mealsToCook} per week</span><input type="range" min="0" max="21" value={profile.mealsToCook} onChange={(event) => onUpdate({ mealsToCook: Number(event.target.value) })} /></label>
            </div>
          </section>
        </div>
        <aside className="preferences-side">
          <div className="profile-summary"><div className="profile-avatar">A</div><p className="eyebrow">YOUR PROFILE</p><h3>A week that works for you.</h3><p>{profile.diet === 'vegetarian' ? 'Vegetarian' : profile.diet === 'eggetarian' ? 'Eggetarian' : 'Non-vegetarian'} · {profile.cuisines.slice(0, 2).join(' & ') || 'Pick your favourites'}</p><div className="profile-summary-line" /><span><Coffee size={15} /> Office {profile.officeDays.length ? `on ${profile.officeDays.join(' & ')}` : 'days vary week to week'}</span></div>
          <div className="account-settings-card"><h3>Save across devices</h3><p>{session ? `Signed in as ${session.user.email}.` : cloudEnabled ? 'Sign in to sync your plan securely.' : 'Your demo data is saved in this browser.'}</p><button className="secondary-button" type="button" onClick={onAccount}>{session ? 'Manage account' : 'Account settings'} <ArrowRight size={14} /></button></div>
          <div className="reset-card"><h3>Want a fresh start?</h3><p>Restore the sample pantry, profile and week plan.</p><button className="text-button reset-action" type="button" onClick={onReset}>Reset demo data <RefreshCw size={13} /></button></div>
        </aside>
      </div>
    </>
  );
}

export default App;
