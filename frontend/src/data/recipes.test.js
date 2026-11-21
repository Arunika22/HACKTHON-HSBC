import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoState, generatePlan, getRecipe, getWeekStart, makeSlotKey, rejectionKey, weekdays } from './recipes.js';

function blankWeek(overrides = {}) {
  const state = createDemoState();
  return {
    ...state,
    plan: {},
    profile: { ...state.profile, ...overrides },
  };
}

test('office-day lunches are packable and the planner avoids repeating the same dish', () => {
  const state = blankWeek({ officeDays: ['Tuesday', 'Thursday'] });
  const plan = generatePlan(state);
  for (const day of state.profile.officeDays) {
    const lunch = getRecipe(plan[makeSlotKey(day, 'lunch')].recipeId);
    assert.ok(lunch.tags.includes('portable'), `${day} lunch should be packable`);
  }
  for (const meal of ['breakfast', 'lunch', 'dinner']) {
    const counts = new Map();
    weekdays.forEach((day) => {
      const recipeId = plan[makeSlotKey(day, meal)]?.recipeId;
      if (recipeId) counts.set(recipeId, (counts.get(recipeId) || 0) + 1);
    });
    assert.ok([...counts.values()].every((count) => count <= 2), `${meal} should not repeat more than twice`);
  }
});

test('diet, allergy and fish preferences filter suggestions', () => {
  const state = blankWeek({ diet: 'vegetarian', allergies: ['peanuts'], includeFish: false, spice: 'Mild' });
  const plan = generatePlan(state);
  Object.values(plan).forEach((slot) => {
    const recipe = getRecipe(slot.recipeId);
    assert.equal(recipe.diet, 'veg');
    assert.ok(!recipe.ingredients.includes('peanuts'));
    assert.notEqual(recipe.diet, 'fish');
    assert.notEqual(recipe.spice, 'spicy');
  });
});

test('a rejected meal is not immediately suggested again for that slot', () => {
  const state = blankWeek();
  const first = generatePlan(state);
  const key = makeSlotKey('Monday', 'breakfast');
  const rejectedId = first[key].recipeId;
  const next = generatePlan({ ...state, rejected: [rejectionKey(state.activeWeek, key, rejectedId)] });
  assert.notEqual(next[key].recipeId, rejectedId);
  const followingWeek = generatePlan({
    ...state,
    activeWeek: '2030-01-07',
    rejected: [rejectionKey(state.activeWeek, key, rejectedId)],
  });
  assert.equal(followingWeek[key].recipeId, rejectedId);
});

test('regenerating replaces accepted meals that conflict with updated preferences', () => {
  const state = blankWeek({ diet: 'vegetarian' });
  const key = makeSlotKey('Monday', 'lunch');
  state.plan[key] = { recipeId: 'chicken-curry', accepted: true };
  const plan = generatePlan(state);
  assert.equal(getRecipe(plan[key].recipeId).diet, 'veg');
  assert.equal(plan[key].accepted, false);
});

test('week boundaries are Monday-based and navigate in seven-day steps', () => {
  const start = getWeekStart(0);
  const next = getWeekStart(1);
  assert.equal(start.getDay(), 1);
  assert.equal((next.getTime() - start.getTime()) / 86400000, 7);
});
