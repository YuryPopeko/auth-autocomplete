import type { Suggestions } from '../types';

const normalizeSuggestions = (suggestions: Suggestions): string[] =>
  Object.values(suggestions)
    .flat()
    .filter(Boolean)
    .map(({ name }) => name);

export default normalizeSuggestions;
