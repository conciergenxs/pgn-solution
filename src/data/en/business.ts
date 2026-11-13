// English copy for src/data/business.ts. Hero, home block, EPC/TUK texts, the TUK page and the service
// packages intro follow the original English pages (/en/service, /en/tuk; obvious typos fixed). Product,
// portfolio and O&M/Supply Chain detail lines are Indonesian on the original English pages too; they are
// translated here. Images, videos and structure come from the Indonesian module.
import * as id from '../business';
import type { Portfolio } from '../business';

// The original English hero says "7 business field"; the site now presents 4 business lines.
export const businessHero: typeof id.businessHero = {
  ...id.businessHero,
  title: 'Work together, believe, and change the world',
  text: 'PT PGAS Solution provides a full range of services in the field of Supporting Services concentrating on 4 business fields',
};

export const homeBusiness: typeof id.homeBusiness = {
  eyebrow: 'Our Business',
  title: 'We Offer Works in the Field of Supporting Services',
  text: 'We are the only integrated service company in the field of energy and infrastructure, helping our clients to optimize their costs.',
};

const p = (line: string): Portfolio => {
  const m = line.match(/^(.*\S)\s*\(([^()]+)\)\s*$/);
  return m ? { text: m[1], client: m[2].trim() } : { text: line };
};

type Line = (typeof id.lines)[number];
const byId = (key: string) => id.lines.find((l) => l.id === key) as Line;

export const lines: typeof id.lines = [
  {
    ...byId('epc'),
    text: 'EPC Management provides construction services in Engineering, Procurement, Construction, Installation, and Commissioning (EPCIC) on a large scale.',
    imageAlt: 'Aerial photo of the Kalija offshore gas pipeline works',
    stats: [
      { value: '258', unit: 'projects', label: 'completed' },
      { value: '1', unit: 'company', label: 'as a subsidiary' },
      { value: '1315', unit: 'people', label: 'employed by the company' },
    ],
    portfolio: [
      'Tambak Lorok Offtake Station Project (Civil Works, Procurement of Main & Supporting Materials, and Marine Survey Service Cooperation) with a pipeline length of 202 km (PT Kalimantan Jawa Gas)',
      'Dumai Regional Network Development Works (PT Perusahaan Gas Negara Tbk)',
      'Engineering, Procurement, and Construction (EPC) of the Aroma Kopi Gas Distribution Infrastructure, 12” diameter, 4.4 km long (PT Pertamina Gas)',
    ].map(p),
  },
  {
    ...byId('om'),
    text: 'Management and maintenance of operating infrastructure and assets in natural gas distribution and transmission pipeline networks, their facilities and related supporting assets.',
    imageAlt: 'Support vessel for the subsea gas pipeline freespan rectification works',
    areas: [
      { title: 'Operations Project Delivery', text: 'Operation and maintenance of Facilities and Offshore & Onshore Networks' },
      { title: 'Integrity and Engineering', text: 'Pipeline integrity - Facility integrity - Assessment - Operation and Maintenance applications' },
      { title: 'Calibration and Manufacturing', text: 'Meter calibration, warehouse management and inventory, fabrication' },
    ],
    products: [
      'Maintenance of valves, Diesel Engine Generators, Gas Engine Generators, meters, transmitters and other facility assets.',
      'Offshore pipeline patrol, Navigational Buoy maintenance, Subsea Valve maintenance, Marine Radar Surveillance',
      'CIPS DCVG surveys, Intelligent Pigging, Freespan Correction, Acoustic Survey, Pipeline Reinforcement',
      'Risk Based Inspection, FMECA, Recertification of Installations and Equipment',
      'Risk Assessment, Corrosion Under Insulation',
      'Maintenance of valves, Diesel Engine Generators, Gas Engine Generators, meters, transmitters and other assets',
      'Pipeline/ROW patrol, leak checks, maintenance of signage, sectional valves and future connections, vegetation maintenance and more.',
      'Aerial patrol',
    ],
    portfolio: [
      'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (PT Perusahaan Gas Negara Tbk)',
      'Free Span Rectification of the 28” Subsea Gas Pipeline at 29 points and NCM along 290 km Pagerungan-Porong, PT Pertamina Gas Eastern Java Area (PT Pertamina Gas)',
      'Operation and Maintenance of the Kepodang-Tambak Lorok Gas Distribution Facility and related Supports (PT Kalimantan Jawa Gas)',
      'POMA Pipeline Maintenance Services with a total pipeline length of 840 km Senipah-Handil-Kutai Lama-Badak-Santan-Bontang (PT Pertamina Hulu Mahakam)',
      'Provision non-destructive test (NDT) & QA/QC service for Pangkah Onshore and Offshore Operation (PT Saka Energi Indonesia)',
      'Provision of Cathodic Protection Pipeline Survey and verifying Corrosion Coupon (PT Saka Energi Indonesia)',
      'Operation and Maintenance of Distribution Pipelines and SPBG Gas Meter Stations in the PT Pertamina Gas OWJA Area (PT Pertamina Gas)',
      'Subsea Pipeline and Floating Storage & Regasification Unit Surveillance Services (PT Nusantara Regas)',
      'Build Operate Transfer of Land, Installations and Natural Gas User Equipment at the Dumai Cement Mill (PT Semen Padang)',
      'Maintenance Services for the Fire Suppression System and Fire & Gas Detection System (PT Nusantara Regas)',
    ].map(p),
  },
  {
    ...byId('supply-chain'),
    imageAlt: 'Gas pipeline network at a power generation facility',
    areas: [
      { title: 'International Cooperation', text: 'Providing competitive, high-quality products made by leading companies around the world.' },
      { title: 'Calibration', text: 'Gas meter repair and calibration services.' },
      { title: 'PE Pipe Manufacturing', text: 'Polyethylene pipe fabrication' },
    ],
    products: [
      'Logistic and Trading: Oil and gas pipeline material, civil, chemical, lubricants, and other material',
      'MDPE 80/HDPE 100 gas pipes',
      'Calibration, Manufacturing and Warehousing (KMP): Gas meter calibration, Warehouse and Management, Gas Stakes',
      'HDPE 100 subduct pipes',
    ],
    portfolio: [
      'Procurement of 335 Electronic Volume Correctors (EVC) in 2020 (PT Perusahaan Gas Negara Tbk)',
      'Procurement of 19,244 G 1.6 Diaphragm Meters in 2020 (PT Perusahaan Gas Negara Tbk)',
    ].map(p),
    link: { label: 'Learn more', href: byId('supply-chain').link!.href },
  },
  {
    ...byId('tuk'),
    text: 'Providing training and certification to optimize human resource competencies in energy infrastructure and the utilization of Indonesian natural gas.',
    areas: [
      { title: 'Worker Training & Certification', text: 'Providing worker training and certification to meet the needs of running the company’s business' },
      { title: 'Cooperation', text: 'In cooperation with National Certification Bodies and the Ministry of Manpower' },
      { title: 'Offline & Online', text: 'Training that adapts to any situation' },
    ],
  },
];

export const tuk: typeof id.tuk = {
  ...id.tuk,
  heroTitle: 'Best Result, Greatest Outcome',
  heroText: 'The TUK PGAS Training Center is an institution that provides the Competency Test implementation facility, conducted by LSP, established by PT PGAS Solution',
  aboutTitle: 'About TUK PGAS Training Center',
  about: 'Tempat Uji Kompetensi (TUK) PGAS Training Center, owned by PT PGAS Solution, is present as the company’s commitment to optimizing human resource competencies in energy infrastructure and the utilization of Indonesian natural gas. The TUK PGAS Training Center obtained a license from LSP ENERGI on October 24, 2016, has worked with PGN’s LSP since 2017, and was established as an independent Competency Test Center by LSP PGN in 2020.',
  whyTitle: 'Why TUK PGAS Training Center?',
  why: [
    { title: 'Pioneer Test Place Provider for Competence in the Natural Gas Sector in Indonesia', text: 'We are the first TUK in the Indonesian natural gas sector' },
    { title: 'Adequate Facilities and Infrastructure', text: 'To support the training and certification process, we always pay attention to the comfort and completeness of theoretical and practical training participants.' },
    { title: 'Online and Offline Training', text: 'We have online and offline training methods, such as theory, practice, discussion, sharing experiences, games or role play, designed in line with the training objectives.' },
    { title: 'Competent Assessors and Trainers', text: 'TUK PGAS Training Center is supported by competent assessors and trainers in their respective fields. Its professional assessors and trainers provide participants with a wide range of knowledge and experience for facing the certification test.' },
  ],
  certTitle: 'Certification Services',
  certText: 'We offer certification services in various fields, as follows:',
  certGroups: [
    {
      title: 'Certification for Gas Infrastructure Services',
      items: [
        'Polyethylene (PE) Pipe Splicing Operator',
        'Galvanized Pipe Splicing Operator',
        'Checking the Quality of Polyethylene (PE) Pipe Installation in Natural Gas Distribution Network Systems and Pipeline Installation',
        'Operation of Gas Fuel Filling Station (SPBG) Equipment',
        'Inspection of Natural Gas Distribution Stations',
        'Implementing Commercialization of Natural Gas',
        'Multilayer Pipe Splicing Operator',
        'Natural Gas Pipe Installation Designer',
        'Operator Monitoring of the Cathodic Protection System',
        'Inspector of Natural Gas Custody Transfer Measurement Systems',
        'Customer and Non-customer Metering and Regulating Station (MRS) Maintenance Operator',
        'Operator Maintenance of Valve Tubes and Ball Valves in Natural Gas Distribution Networks',
        'Network Patrol Operator',
        'K3 Operator',
        'Floor Warden Operator',
      ],
    },
    {
      title: 'Certification Services in Other Fields',
      items: [
        'Young Project Management Expert - IAMPI',
        'K3 Expert Training and Certification',
        'P3K Training and Certification',
        'Fire Fighting Training and Certification',
        'MS Office Training and Certification',
        'HRD Supervisor Training and Certification',
        'Office Administration Training and Certification',
        'Financial and Procurement Training and Certification',
        'OB and Security Training and Certification',
        'Commercial Training and Certification',
        'Marketer Operational Workforce',
        'OHS Oil and Gas Industry Operators and Supervisors',
        'Oil and Gas Well Care (CRO)',
        'Certified Refueling Operator',
      ],
    },
  ],
  partnersTitle: 'Partners',
  partnersText: 'Over the years we have partnered with some of the best companies to enhance your learning experience and provide the best possible results for participants of TUK PGAS Training Center.',
  registrationTitle: 'Registration',
  registrationText: 'Interested in our services? Please download the registration form below and send it to info.tuk@pgn-solution.co.id. Our team will guide you after you send the email.',
  registrationForm: { ...id.tuk.registrationForm, label: 'Registration form' },
  contactText: 'For questions, criticisms or suggestions, please email info.tuk@pgn-solution.co.id or fill in the following form:',
};

// The original English page repeats the "1 Solution" text for all three packages; 2 and 3 are
// translated from the Indonesian.
export const packages: typeof id.packages = {
  ...id.packages,
  title: 'Service Packages: 3 Solutions',
  text: 'PT PGAS Solution offers three service packages under the name 3 Solution. All three packages provide service areas ranging from installation, maintenance and training to gas supply for consumers.',
  items: [
    { ...id.packages.items[0], text: 'Offers services as per the customer’s requirements. All services, from installation, operation and trading up to training, are selected by the customer.' },
    { ...id.packages.items[1], text: 'Offers infrastructure development services with an EPC and O&M bundling system, covering design, installation, and operation.' },
    { ...id.packages.items[2], text: 'Offers infrastructure development services using an EPC, O&M, and Energy Commodity bundling system, covering design, installation, operation, and gas commodity for use.' },
  ],
};

export const clientsBlock: typeof id.clientsBlock = {
  eyebrow: 'Our Clients',
  title: 'Reliable Partner Solution in Energy and Infrastructure',
  text: 'We are the most reliable partner to accomplish new ambitious projects in the field of energy & infrastructure',
};
