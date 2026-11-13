// English copy for src/data/pages.ts (Partnership, Articles, Careers, Contact), following the original
// English pages where they exist (/en/partnership, /en/information, /en/career, /en/contact). Addresses of
// the operational areas are proper names and stay as published.
import * as id from '../pages';
import type { Job } from '../pages';

// "Pedoman Pendaftaran" is labelled "Goods & Services Procurement Policy" on the original English page,
// but the file is the vendor registration guideline; named after the document here.
const procTitles = ['Goods/Services Vendor Registration', 'Registration Guidelines', 'Pgas Procurement Integrated System', 'CHSEMS Prequalification Guidelines', 'CHSEMS Prequalification Registration'];
const procActions: Record<string, string> = { Download: 'Download', Detail: 'Details', Link: 'Link' };

export const partnership: typeof id.partnership = {
  ...id.partnership,
  hero: {
    ...id.partnership.hero,
    title: 'Partnership',
    text: 'Let’s create value for customers together. Collaboration helps us in many different ways. We are very interested in building trust with the many different stakeholders who have an interest in our company.',
  },
  summary: 'PT PGAS Solution opens opportunities for all parties to work with PGAS Solution and support its work according to their competence.',
  procedureTitle: 'Procedures',
  procedures: id.partnership.procedures.map((p, i) => ({ ...p, title: procTitles[i], action: procActions[p.action] ?? p.action })),
  procedureGroups: [
    { title: 'Goods/Services Vendors', items: [0, 1] },
    { title: 'Pgas Procurement Integrated System', items: [2] },
    { title: 'CHSEMS Prequalification', items: [3, 4] },
  ],
  announcementTitle: 'Announcements',
};

export const articlesPage: typeof id.articlesPage = {
  ...id.articlesPage,
  hero: {
    ...id.articlesPage.hero,
    title: 'Information',
    text: 'We provide access to information about our activities and meet the information needs of our community. You can keep up to date with us by subscribing to our email alerts or following us on social media.',
  },
  social: {
    title: 'Want to know our latest info?',
    text: 'Follow PT PGAS Solution through our various social media channels and see our latest activity',
  },
  pressTitle: 'Press Release',
  newsTitle: 'Latest News',
  galleryTitle: 'Gallery',
};

export const careers: typeof id.careers = {
  ...id.careers,
  hero: { ...id.careers.hero, title: 'Careers', text: 'We Bring Solution, We Are Solutionation' },
  workWith: {
    ...id.careers.workWith,
    eyebrow: 'Work with PT PGAS Solution',
    title: 'Believe in the Company’s values and be part of our team',
    text: 'At PT PGAS Solution, we uphold our “SOLUTION” values. We are a team of professionals who are ready to solve difficult tasks, developing and reaching new heights every single day.',
  },
  achievement: {
    title: 'Our achievements aren’t made by one person',
    text: 'We are a people-driven company. PGAS Solution’s business keeps growing, so we are always interested in retaining qualified and talented professionals.',
  },
  vacancy: {
    eyebrow: 'Vacancies',
    title: 'A place to explore innovative ideas, nurture and cultivate your talents',
    text: 'Start your career where you will get every opportunity to grow and improve your skills. Check out the available openings.',
  },
  // the original English form keeps the Indonesian options; translated here
  form: {
    education: ['Primary School', 'Junior High School', 'Senior/Vocational High School', 'Diploma (D3)', 'Bachelor’s (S1)', 'Master’s (S2)', 'Doctorate (S3)'],
    status: ['Internship', 'Permanent'],
    sex: ['Male', 'Female'],
  },
};

export const jobs: Job[] = id.jobs;

export const contact: typeof id.contact = {
  ...id.contact,
  hero: {
    ...id.contact.hero,
    title: 'Contact',
    text: 'We are always open for cooperation and welcome new interesting projects. Contact us in any way convenient for you and our team is ready to answer your queries.',
  },
  areasTitle: 'Branch Offices',
  hotline: {
    ...id.contact.hotline,
    title: 'Hotline Center',
    text: 'For a quick response, please contact our hotline center',
    note: '*Sorry, our hotline center is currently available by chat only. Thank you.',
  },
  formTitle: 'or leave a message',
};
