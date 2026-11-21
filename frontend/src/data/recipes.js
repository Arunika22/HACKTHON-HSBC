export const recipes = [
  { id: 'egg-roll', name: 'Kolkata egg roll', description: 'A quick, flaky roll with egg, onion and a little green chutney.', cuisine: 'Bengali', diet: 'egg', prep: 20, protein: 16, ingredients: ['paratha', 'eggs', 'onion'], tags: ['portable', 'breakfast'], emoji: '🌯' },
  { id: 'cornflakes-eggs', name: 'Cornflakes & boiled eggs', description: 'A no-fuss bowl with milk, plus two boiled eggs on the side.', cuisine: 'Everyday', diet: 'egg', prep: 10, protein: 18, ingredients: ['cornflakes', 'milk', 'eggs'], tags: ['breakfast'], emoji: '🥣' },
  { id: 'poha', name: 'Peanut poha', description: 'Light, lemony poha with peanuts and a handful of fresh coriander.', cuisine: 'Indian', diet: 'veg', spice: 'mild', prep: 20, protein: 9, ingredients: ['poha', 'peanuts', 'onion'], tags: ['breakfast'], emoji: '🍋' },
  { id: 'egg-paratha', name: 'Paratha with masala eggs', description: 'Soft parathas and gently spiced scrambled eggs for a filling start.', cuisine: 'Indian', diet: 'egg', prep: 25, protein: 22, ingredients: ['paratha', 'eggs', 'onion'], tags: ['breakfast'], emoji: '🍳' },
  { id: 'upma', name: 'Vegetable upma', description: 'Comforting semolina with seasonal vegetables and a squeeze of lime.', cuisine: 'Indian', diet: 'veg', prep: 25, protein: 8, ingredients: ['sooji', 'carrot', 'peas'], tags: ['breakfast'], emoji: '🥕' },
  { id: 'idli', name: 'Idli & sambar', description: 'Steamed idlis with a bowl of lentil-rich sambar.', cuisine: 'South Indian', diet: 'veg', prep: 15, protein: 13, ingredients: ['idli batter', 'toor dal', 'tomato'], tags: ['breakfast'], emoji: '🥥' },
  { id: 'bun-maska', name: 'Bun maska & chai', description: 'A relaxed Pune café breakfast for a slower morning.', cuisine: 'Pune café', diet: 'veg', prep: 10, protein: 8, ingredients: ['bun', 'butter', 'milk'], tags: ['breakfast', 'eatout'], emoji: '☕' },
  { id: 'dal-rice', name: 'Rice, dal & bhaja', description: 'A familiar Bengali plate with dal, rice and crisp potato bhaja.', cuisine: 'Bengali', diet: 'veg', prep: 35, protein: 17, ingredients: ['rice', 'masoor dal', 'potato'], tags: ['lunch', 'dinner', 'portable'], emoji: '🍚' },
  { id: 'egg-curry', name: 'Bengali egg curry & rice', description: 'Boiled eggs in a comforting tomato gravy with steamed rice.', cuisine: 'Bengali', diet: 'egg', prep: 35, protein: 23, ingredients: ['eggs', 'rice', 'tomato', 'onion'], tags: ['lunch', 'dinner', 'portable'], emoji: '🥚' },
  { id: 'chicken-curry', name: 'Home-style chicken curry', description: 'A simple, warming chicken curry with rice and everyday spices.', cuisine: 'Bengali', diet: 'chicken', prep: 50, protein: 32, ingredients: ['chicken', 'rice', 'onion', 'tomato'], tags: ['lunch', 'dinner', 'portable'], emoji: '🍗' },
  { id: 'chicken-bhuna', name: 'Chicken bhuna bowl', description: 'Slow-cooked onion and tomato masala, packed with rice for lunch.', cuisine: 'Indian', diet: 'chicken', spice: 'spicy', prep: 45, protein: 35, ingredients: ['chicken', 'rice', 'onion', 'tomato'], tags: ['lunch', 'dinner', 'portable'], emoji: '🍲' },
  { id: 'aloo-posto', name: 'Aloo posto & rice', description: 'Potatoes in a mellow poppy-seed paste, just like a Bengali home lunch.', cuisine: 'Bengali', diet: 'veg', prep: 35, protein: 10, ingredients: ['potato', 'poppy seeds', 'rice'], tags: ['lunch', 'dinner'], emoji: '🥔' },
  { id: 'cholar-dal', name: 'Cholar dal & luchi', description: 'Bengal gram dal with warm spices and a small stack of luchi.', cuisine: 'Bengali', diet: 'veg', prep: 40, protein: 17, ingredients: ['chana dal', 'luchi', 'coconut'], tags: ['lunch', 'dinner'], emoji: '🫓' },
  { id: 'khichuri', name: 'Moong dal khichuri', description: 'One-pot rice and lentils with vegetables; easy to make ahead.', cuisine: 'Bengali', diet: 'veg', prep: 40, protein: 16, ingredients: ['rice', 'moong dal', 'carrot', 'peas'], tags: ['lunch', 'dinner', 'portable'], emoji: '🍛' },
  { id: 'paneer-bowl', name: 'Paneer bhurji bowl', description: 'Crumbled paneer with tomatoes and roti for a protein-forward meal.', cuisine: 'Indian', diet: 'veg', prep: 25, protein: 25, ingredients: ['paneer', 'tomato', 'onion', 'roti'], tags: ['lunch', 'dinner', 'portable'], emoji: '🧀' },
  { id: 'chana-salad', name: 'Chana & cucumber salad', description: 'Chickpeas, crunchy cucumber and lemon in an easy lunch box.', cuisine: 'Indian', diet: 'veg', prep: 15, protein: 16, ingredients: ['chickpeas', 'cucumber', 'lemon'], tags: ['lunch', 'portable'], emoji: '🥗' },
  { id: 'fish-curry', name: 'Light Bengali fish curry', description: 'A mild tomato and turmeric fish jhol with rice. Fish is optional.', cuisine: 'Bengali', diet: 'fish', prep: 35, protein: 29, ingredients: ['fish', 'rice', 'tomato'], tags: ['lunch', 'dinner', 'portable'], emoji: '🐟' },
  { id: 'dal-roti', name: 'Dal, roti & cucumber raita', description: 'Everyday lentils with warm rotis and cool, quick raita.', cuisine: 'Indian', diet: 'veg', prep: 30, protein: 18, ingredients: ['masoor dal', 'roti', 'curd', 'cucumber'], tags: ['lunch', 'dinner', 'portable'], emoji: '🫓' },
  { id: 'paneer-tikka', name: 'Paneer tikka & roti', description: 'Spiced paneer with roti and a simple salad, made in one pan.', cuisine: 'Indian', diet: 'veg', prep: 30, protein: 27, ingredients: ['paneer', 'roti', 'curd'], tags: ['lunch', 'dinner', 'portable'], emoji: '🧀' },
  { id: 'dosa', name: 'Masala dosa', description: 'Crisp dosa filled with potato masala, with sambar on the side.', cuisine: 'South Indian', diet: 'veg', prep: 20, protein: 12, ingredients: ['dosa batter', 'potato', 'toor dal'], tags: ['lunch', 'dinner', 'eatout'], emoji: '🥞' },
  { id: 'thali', name: 'Neighbourhood thali', description: 'Keep it flexible with a sit-down meal out in Pune.', cuisine: 'Pune café', diet: 'veg', prep: 0, protein: 20, ingredients: [], tags: ['lunch', 'dinner', 'eatout'], emoji: '🍽️' },
  { id: 'chicken-tikka', name: 'Chicken tikka & roti', description: 'Marinated chicken with roti and crunchy salad; works well in a lunch box.', cuisine: 'Indian', diet: 'chicken', spice: 'spicy', prep: 35, protein: 34, ingredients: ['chicken', 'curd', 'roti'], tags: ['lunch', 'dinner', 'portable'], emoji: '🍢' },
  { id: 'curd-rice', name: 'Curd rice & roasted peanuts', description: 'A cooling, easy supper with tempering and a little crunch.', cuisine: 'South Indian', diet: 'veg', prep: 15, protein: 12, ingredients: ['rice', 'curd', 'peanuts'], tags: ['dinner', 'portable'], emoji: '🥣' },
  { id: 'egg-fried-rice', name: 'Egg & vegetable fried rice', description: 'A quick way to turn leftover rice into a satisfying meal.', cuisine: 'Indian', diet: 'egg', prep: 20, protein: 19, ingredients: ['rice', 'eggs', 'carrot', 'peas'], tags: ['lunch', 'dinner', 'portable'], emoji: '🍳' },
];

export const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const mealTypes = ['breakfast', 'lunch', 'dinner'];
export const ingredientCategories = ['Grains & pulses', 'Vegetables', 'Dairy & eggs', 'Meat & fish', 'Pantry', 'Other'];

export const defaultProfile = {
  officeDays: ['Tuesday', 'Thursday'],
  diet: 'non-vegetarian',
  cuisines: ['Bengali', 'Indian', 'Pune café'],
  preferredDishes: ['Bengali egg curry & rice'],
  dislikes: [],
  allergies: [],
  avoidDishes: [],
  includeFish: false,
  spice: 'Medium',
  cookTime: 45,
  proteinGoal: 75,
  mealsOut: 2,
  mealsToCook: 17,
};

const demoSlots = [
  ['cornflakes-eggs', 'egg-roll', 'chicken-curry'],
  ['poha', 'chicken-bhuna', 'aloo-posto'],
  ['egg-paratha', 'egg-curry', 'khichuri'],
  ['idli', 'paneer-bowl', 'dal-rice'],
  ['cornflakes-eggs', 'chana-salad', 'chicken-tikka'],
  ['bun-maska', 'thali', 'decide'],
  ['upma', 'paneer-tikka', 'dosa'],
];

export function createDemoState() {
  const plan = {};
  demoSlots.forEach((meals, day) => meals.forEach((recipeId, meal) => {
    const key = `${weekdays[day].toLowerCase()}-${mealTypes[meal]}`;
    plan[key] = { recipeId, accepted: false, reason: 'A good fit for your week and food preferences.' };
  }));
  const activeWeek = localDateKey(getWeekStart(0));
  return {
    profile: { ...defaultProfile },
    pantry: [
      { id: 'p-rice', name: 'Rice', quantity: '1', unit: 'kg', category: 'Grains & pulses', status: 'home' },
      { id: 'p-eggs', name: 'Eggs', quantity: '6', unit: 'pcs', category: 'Dairy & eggs', status: 'home' },
      { id: 'p-dal', name: 'Masoor dal', quantity: '500', unit: 'g', category: 'Grains & pulses', status: 'home' },
      { id: 'p-onion', name: 'Onion', quantity: '4', unit: 'pcs', category: 'Vegetables', status: 'home' },
      { id: 'p-potato', name: 'Potato', quantity: '5', unit: 'pcs', category: 'Vegetables', status: 'home' },
      { id: 'p-milk', name: 'Milk', quantity: '1', unit: 'L', category: 'Dairy & eggs', status: 'home' },
      { id: 'p-chicken', name: 'Chicken', quantity: '500', unit: 'g', category: 'Meat & fish', status: 'home' },
      { id: 'p-tomato', name: 'Tomato', quantity: '4', unit: 'pcs', category: 'Vegetables', status: 'home' },
      { id: 'p-curd', name: 'Curd', quantity: '400', unit: 'g', category: 'Dairy & eggs', status: 'home' },
      { id: 'p-cornflakes', name: 'Cornflakes', quantity: '1', unit: 'box', category: 'Grains & pulses', status: 'home' },
      { id: 'p-paneer', name: 'Paneer', quantity: '200', unit: 'g', category: 'Dairy & eggs', status: 'buy' },
      { id: 'p-roti', name: 'Roti', quantity: '1', unit: 'pack', category: 'Grains & pulses', status: 'buy' },
    ],
    plans: { [activeWeek]: plan },
    activeWeek,
    shopping: [],
    pinned: ['Bengali egg curry & rice'],
    rejected: [],
    weekOffset: 0,
    newIdeas: [],
  };
}

export function makeSlotKey(day, meal) {
  return `${day.toLowerCase()}-${meal}`;
}

export function rejectionKey(week, slotKey, recipeId) {
  return `${week}|${slotKey}:${recipeId}`;
}

export function getWeekStart(offset = 0) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const weekday = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - weekday + offset * 7);
  return date;
}

export function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatWeek(offset = 0) {
  const start = getWeekStart(offset);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const format = (date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${format(start)} – ${format(end)}`;
}

export function getRecipe(id) {
  return recipes.find((recipe) => recipe.id === id);
}

export function recipeAllowed(recipe, profile) {
  if (!recipe || recipe.id === 'decide') return false;
  if (profile.diet === 'vegetarian' && recipe.diet !== 'veg') return false;
  if (profile.diet === 'eggetarian' && ['chicken', 'fish'].includes(recipe.diet)) return false;
  if (recipe.diet === 'fish' && !profile.includeFish && !profile.pinned?.includes(recipe.name)) return false;
  if (profile.spice === 'Mild' && recipe.spice === 'spicy') return false;
  const avoidedDishes = (profile.avoidDishes || []).map((item) => item.toLowerCase());
  if (avoidedDishes.some((item) => recipe.name.toLowerCase().includes(item))) return false;
  const allergyAliases = {
    dairy: ['milk', 'curd', 'paneer', 'butter'],
    peanuts: ['peanuts'],
    nuts: ['peanuts', 'coconut'],
    gluten: ['paratha', 'roti', 'luchi', 'bun', 'sooji'],
  };
  const avoided = [...(profile.dislikes || []), ...(profile.allergies || [])].map((item) => item.trim().toLowerCase()).filter(Boolean);
  return !recipe.ingredients.some((ingredient) => avoided.some((item) =>
    ingredient.toLowerCase().includes(item) ||
    item.includes(ingredient.toLowerCase()) ||
    (allergyAliases[item] || []).includes(ingredient.toLowerCase()),
  ));
}

export function recipeFitsSlot(recipe, profile, pinned, day, meal) {
  const resolvedProfile = { ...defaultProfile, ...profile };
  const officeLunch = meal === 'lunch' && resolvedProfile.officeDays.includes(day);
  return recipeAllowed(recipe, { ...resolvedProfile, pinned }) &&
    recipe.tags.includes(meal) &&
    (!officeLunch || recipe.tags.includes('portable')) &&
    recipe.prep <= (meal === 'breakfast' ? Math.min(resolvedProfile.cookTime, 30) : resolvedProfile.cookTime);
}

export function generatePlan(state) {
  const result = {};
  const counts = {};
  const profile = { ...defaultProfile, ...state.profile };
  const home = new Set(state.pantry.filter((item) => item.status === 'home').map((item) => item.name.toLowerCase()));
  let eatOutCount = 0;
  let cookedCount = 0;
  const targetMealsOut = Math.min(7, Math.max(profile.mealsOut, 21 - profile.mealsToCook));
  weekdays.forEach((day) => {
    mealTypes.forEach((meal) => {
      const key = makeSlotKey(day, meal);
      const old = state.plan[key];
      const oldRecipe = getRecipe(old?.recipeId);
      const oldMealStillFits = recipeFitsSlot(oldRecipe, profile, state.pinned, day, meal);
      if (old?.accepted && oldMealStillFits) {
        result[key] = old;
        counts[oldRecipe.id] = (counts[oldRecipe.id] || 0) + 1;
        if (oldRecipe.tags.includes('eatout')) eatOutCount += 1;
        else cookedCount += 1;
        return;
      }
      const options = recipes.filter((recipe) =>
        recipeFitsSlot(recipe, profile, state.pinned, day, meal) &&
        !state.rejected.includes(rejectionKey(state.activeWeek || 'week', key, recipe.id)),
      );
      options.sort((a, b) => {
        const aPinned = state.pinned.includes(a.name) ? -30 : 0;
        const bPinned = state.pinned.includes(b.name) ? -30 : 0;
        const aCuisine = profile.cuisines.includes(a.cuisine) ? -8 : 0;
        const bCuisine = profile.cuisines.includes(b.cuisine) ? -8 : 0;
        const aOut = a.tags.includes('eatout') ? (eatOutCount < targetMealsOut ? -35 : 22) : 0;
        const bOut = b.tags.includes('eatout') ? (eatOutCount < targetMealsOut ? -35 : 22) : 0;
        const aCook = a.tags.includes('eatout') ? 0 : (cookedCount < profile.mealsToCook ? -6 : 20);
        const bCook = b.tags.includes('eatout') ? 0 : (cookedCount < profile.mealsToCook ? -6 : 20);
        const aPantry = a.ingredients.filter((ingredient) => home.has(ingredient)).length;
        const bPantry = b.ingredients.filter((ingredient) => home.has(ingredient)).length;
        const aRepeat = (counts[a.id] || 0) * 24;
        const bRepeat = (counts[b.id] || 0) * 24;
        return (aRepeat - bRepeat) + (bPantry - aPantry) * 2 + aPinned - bPinned + aCuisine - bCuisine + aOut - bOut + aCook - bCook + a.prep / 30 - b.prep / 30;
      });
      const recipe = options[0];
      if (recipe) {
        const missing = recipe.ingredients.filter((ingredient) => !home.has(ingredient));
        result[key] = {
          recipeId: recipe.id,
          accepted: false,
          reason: state.pinned.includes(recipe.name)
            ? 'One of your pinned picks, with ingredients that suit your week.'
            : missing.length
              ? `Fits your ${meal} routine; add ${missing.slice(0, 2).join(' and ')} to your list.`
              : 'Uses ingredients you already have and fits your preferences.',
        };
        counts[recipe.id] = (counts[recipe.id] || 0) + 1;
        if (recipe.tags.includes('eatout')) eatOutCount += 1;
        else cookedCount += 1;
      } else {
        result[key] = { recipeId: 'decide', accepted: false, reason: 'Keep this meal flexible or add more pantry options.' };
      }
    });
  });
  return result;
}
