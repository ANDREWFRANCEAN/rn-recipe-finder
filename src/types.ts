export type Recipe = {
  id: string;
  title: string;
  totalTimeMinutes?: number;
  servings?: string;
  image?: string;
  ingredients: string[];
  steps: string[];
};

export type AIRecipeResponse = { recipes: Recipe[] };
