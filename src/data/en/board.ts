// English for the BOD & BOC profiles (src/data/generated/board.json). The original English site shows these
// profiles in Indonesian; here the roles, field labels, degree levels, months and the appointment deeds are
// translated by rule. Names of institutions and earlier job titles stay as published.
const ROLES: Record<string, string> = {
  'Komisaris Utama': 'President Commissioner',
  'Komisaris Independen': 'Independent Commissioner',
  Komisaris: 'Commissioner',
  'Direktur Utama': 'President Director',
  'Direktur Keuangan dan Dukungan Bisnis': 'Director of Finance and Business Support',
  'Direktur Operasi': 'Director of Operations',
  'Direktur Teknik dan Pengembangan': 'Director of Engineering and Development',
};
export const roleEn = (role: string) => ROLES[role.trim()] ?? role;

const MONTHS: [RegExp, string][] = [
  [/\bJanuari\b/g, 'January'], [/\bFebruari\b/g, 'February'], [/\bMaret\b/g, 'March'], [/\bMei\b/g, 'May'], [/\bJuni\b/g, 'June'],
  [/\bJuli\b/g, 'July'], [/\bAgustus\b/g, 'August'], [/\bOktober\b/g, 'October'], [/\bDesember\b/g, 'December'], [/\bSept\b/g, 'Sep'],
];
const RULES: [RegExp, string][] = [
  [/Akta Pernyataan Keputusan Para Pemegang Saham Secara Sirkuler (PT PGAS Solution) Nomor (\d+) tanggal/g, 'Deed of Circular Resolutions of the Shareholders of $1 No. $2 dated'],
  [/Akta Pernyataan Keputusan Rapat Umum Pemegang Saham Tahunan (PT PGAS Solution) Nomor (\d+) tanggal/g, 'Deed of Resolutions of the Annual General Meeting of Shareholders of $1 No. $2 dated'],
  [/Dasar Penunjukan\s*:/g, 'Basis of Appointment:'],
  [/Tempat (?:&amp;|&) Tanggal Lahir\s*:/g, 'Place &amp; Date of Birth:'],
  [/Domisili\s*:/g, 'Domicile:'],
  [/Pendidikan\s*:/g, 'Education:'],
  [/Karir\s*:/g, 'Career:'],
  [/\bS1\b/g, 'Bachelor’s'], [/\bS2\b/g, 'Master’s'], [/\bS3\b/g, 'Doctorate'], [/\bD3\b/g, 'Diploma'],
  [/\b[Ss]ekarang\b/g, 'present'],
  [/jawa Barat|Jawa Barat/g, 'West Java'], [/Jawa Timur/g, 'East Java'],
];
export const bioEn = (bio: string) => [...RULES, ...MONTHS].reduce((s, [re, to]) => s.replace(re, to), bio);
