// Headline capitalization. Every word starts with a capital except a few small words, which stay
// lowercase unless they open the headline (or follow a colon). Indonesian: only "di", "ke" and "dan"
// (client rule). English: the usual title-case small words (articles, coordinating conjunctions, short
// prepositions); these also stay lowercase inside Indonesian headlines that carry English names
// ("Operation and Maintenance"). Acronyms and words with inner capitals (GCG, PT, O&M) stay as written.
import type { Lang } from './index';

const EN_SMALL = [
  'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'as', 'at', 'by', 'in', 'of', 'off', 'on', 'per', 'to', 'up', 'via', 'with', 'from', 'into', 'onto', 'than', 'vs',
];
const SMALL: Record<Lang, Set<string>> = {
  id: new Set(['di', 'ke', 'dan', ...EN_SMALL]),
  en: new Set(EN_SMALL),
};

/** Capitalizes one part of a word (a run between hyphens or slashes), keeping leading punctuation. */
function capPart(part: string): string {
  const i = part.search(/\p{L}/u);
  if (i < 0) return part;
  const core = part.slice(i);
  // acronyms and words with inner capitals stay as written
  if (/\p{Lu}/u.test(core.slice(1))) return part;
  return part.slice(0, i) + core[0].toLocaleUpperCase() + core.slice(1);
}

const bare = (w: string) => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '').toLocaleLowerCase();

/**
 * Title-cases a run of text. `state.first` carries "the next word opens the headline" across several
 * text runs of one heading (a headline split over line spans), and is updated as words are written.
 */
export function titleCase(text: string, lang: Lang, state = { first: true }): string {
  return text.replace(/\S+/g, (word) => {
    const opens = state.first;
    // the word after a colon (or a dash on its own) opens a new phrase
    state.first = /[:–—]$/.test(word) || word === '-';
    if (!/\p{L}/u.test(word)) return word;
    const plain = bare(word);
    const isSmall = !opens && SMALL[lang].has(plain);
    // a small word written capitalized mid-headline goes back to lowercase (not acronyms like "DI")
    if (isSmall) return /\p{Lu}{2,}/u.test(word) ? word : word.toLocaleLowerCase();
    return word.split(/([-/])/).map((p) => (p === '-' || p === '/' ? p : capPart(p))).join('');
  });
}

/** Title-cases the text inside an HTML fragment (tags and entities untouched). */
export function titleCaseHtml(html: string, lang: Lang): string {
  const state = { first: true };
  return html.replace(/(<[^>]*>)|([^<]+)/g, (_m, tag: string, text: string) => {
    if (tag) return tag;
    // entities (&amp; &#39; …) are parked as private-use characters so they read as punctuation
    const ents: string[] = [];
    const parked = text.replace(/&#?\w+;/g, (e) => String.fromCharCode(0xe000 + ents.push(e) - 1));
    return titleCase(parked, lang, state).replace(/[\ue000-\uefff]/g, (c) => ents[c.charCodeAt(0) - 0xe000]);
  });
}
