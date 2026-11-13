// Page data per locale. Indonesian modules are the source; each English module (src/data/en/*) reuses
// the Indonesian one and replaces only the words, so images, numbers and structure stay in one place.
import type { Lang } from './index';
import * as site from '../data/site';
import * as about from '../data/about';
import * as business from '../data/business';
import * as gcg from '../data/gcg';
import * as investor from '../data/investor';
import * as pages from '../data/pages';
import * as siteEn from '../data/en/site';
import * as aboutEn from '../data/en/about';
import * as businessEn from '../data/en/business';
import * as gcgEn from '../data/en/gcg';
import * as investorEn from '../data/en/investor';
import * as pagesEn from '../data/en/pages';

const ID = { ...site, ...about, ...business, ...gcg, ...investor, ...pages };
export type Content = typeof ID;
const EN: Content = { ...ID, ...siteEn, ...aboutEn, ...businessEn, ...gcgEn, ...investorEn, ...pagesEn };

export const content = (lang: Lang): Content => (lang === 'en' ? EN : ID);
