import { createClient } from '@supabase/supabase-js';
import { createDemoState } from './recipes';

const STORAGE_KEY = 'mealmate.v1';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function watchAuth(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function sendSignInLink(email) {
  if (!supabase) throw new Error('Add Supabase credentials to enable account sign-in.');
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadState(session) {
  if (session && supabase) {
    const { data, error } = await supabase
      .from('mealmate_state')
      .select('state')
      .eq('user_id', session.user.id)
      .maybeSingle();
    if (error) throw error;
    if (data?.state) return data.state;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...createDemoState(), ...JSON.parse(saved) };
    const demo = createDemoState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
    return demo;
  } catch (error) {
    throw new Error(`Could not load your saved meal plan: ${error.message}`);
  }
}

export async function saveState(state, session) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    throw new Error(`Could not save your meal plan in this browser: ${error.message}`);
  }
  if (session && supabase) {
    const { error } = await supabase.from('mealmate_state').upsert({
      user_id: session.user.id,
      state,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }
}
