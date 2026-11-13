// English copy for src/data/about.ts. Headings, mission and the 2009–2020 history follow the original
// English page (/en/about; obvious typos fixed). The 2021–2023 history is Indonesian on the original
// English page too and is translated here. Figures follow the Indonesian page (the English one has a
// few older values, e.g. 704 M instead of 681 M for Mario Simag 2020).
import * as id from '../about';

export const aboutHero: typeof id.aboutHero = {
  ...id.aboutHero,
  title: 'Every effort for excellence',
  text: 'Our vast experience, cutting-edge equipment and qualified personnel make us the number one solution for energy and infrastructure',
};

export const vision = 'To become a world-class standardized national energy services company';

export const mission: typeof id.mission = {
  title: '5 things we always keep in mind',
  items: [
    'Provision of EPC, O&M, and Investment in Derivative Businesses.',
    'Prioritizing Customer Satisfaction as the Main Focus.',
    'Development of Competent and Certified Human Resources.',
    'Use of National and World Standards in Running the Company’s Business.',
    'Prioritizing QHSSE, GCG Principles, and Effective and Efficient Technology Implementation.',
  ],
};

const values = [
  ['Trustworthy', 'We hold firmly to the trust given to us'],
  ['Competent', 'We keep learning and developing our capabilities'],
  ['Harmonious', 'We care for one another and respect differences'],
  ['Loyal', 'We are dedicated and put the interests of the nation and state first'],
  ['Adaptive', 'We keep innovating and are enthusiastic in driving or facing change'],
  ['Collaborative', 'We build synergistic cooperation'],
];
export const culture: typeof id.culture = {
  ...id.culture,
  eyebrow: 'Our Culture',
  title: 'We do what we do because of our values',
  text: 'Never changing and never will, these values made our company today',
  values: id.culture.values.map((v, i) => ({ ...v, name: values[i][0], text: values[i][1] })),
};

export const history: typeof id.history = {
  eyebrow: 'Company History',
  title: 'Little step for a big leap',
  summary: 'Born from PGN’s technical division behind the South Sumatra–West Java pipeline, PT PGAS Solution focuses on the technical and operational side of gas.',
  text: 'PT PGAS Solution (PGAS Solution) is dedicated to focus on the technical and operational aspects in the field of gas. This company started from the technical division of PGN, which successfully completed the gas transmission and distribution network in the South Sumatera-West Java pipe installation project. This national scale project was the inspiration behind the establishment of PGAS Solution.',
  timeline: [
    { year: '2009', items: ['PT PGAS Solution was established on August 6, 2009'] },
    { year: '2010', items: ['Became the only Indonesian agent for Armatury, Czech products'] },
    {
      year: '2013',
      items: [
        'The birth of the "SOLUTION" culture',
        'Logo change from "PGAS Solution" to "PGN Solution"',
        'Formed a Trading Division; logo change from "PGAS Solution" to "PGN SOLUTION"',
      ],
    },
    {
      year: '2014',
      items: [
        'Tambak Lorok Offtake Station Project (Civil Works, Procurement of Main & Supporting Materials, and Marine Survey Service Cooperation) with a pipeline length of 202 km worth USD 113 thousand',
        'The company transformed into an EPC project executor in the PGN Group.',
        'Cooperation to Increase Network Reliability for Gas Distribution in Muara Karang-Muara Bekasi and Pasuruan-Mojokerto worth 360 M.',
      ],
    },
    {
      year: '2015',
      items: [
        'Natural gas-based "Food Truck" innovation',
        'Kalimantan-Java (Kalija) offshore gas pipeline project from Kepodang-Tambak Lorok',
        'Establishment of a subsidiary: PT Solusi Energy Nusantara (SENA)',
      ],
    },
    {
      year: '2016',
      items: [
        'Inauguration of the Competency Test Place (TUK)',
        'Became an agent of Fusion products, America',
        'New line of business: Workshop & Warehouse management.',
        'The company transformed into a pipeline network and facility asset manager in the PGN Group.',
      ],
    },
    {
      year: '2017',
      items: [
        'Dumai Regional Network Development Works worth 457 M',
        'Signing of the “Intelligent Pigging For Pemping Sakra Pipeline” project contract between PT PGAS Solution and PT Transportasi Gas Indonesia.',
        'Natural Gas Network Infrastructure Development for Households in Mojokerto City and Kemayoran Flats worth 108 M.',
        'Cooperation with PT Gagas Energi on the development of 2 SPBG Units in Banten, worth 30 M.',
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 887 M',
      ],
    },
    {
      year: '2018',
      items: [
        'Took part in building Asian Games 2018 infrastructure, including the eternal flame pipeline infrastructure.',
        'Operation and Maintenance of the Kepodang-Tambak Lorok Gas Distribution Facility and related Supports worth 108 M',
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 650 M',
        'Installation of Gas Infrastructure for Industrial Customers in the PGN Group.',
        'Company transformation expanding into projects outside the PGN Group.',
      ],
    },
    {
      year: '2019',
      items: [
        'Development of the East Java LNG Terminal Facility – Phase II (Teluk Lamong) worth 454 M',
        'Installation of the Umbulan SPAM Transmission Pipeline, total value 346.3 M',
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 707 M',
        'Construction of Natural Gas Networks for Households in Palembang City and Jambi City (8,000 SR)',
        'Manufacture of 50 Pertashop Units',
        'EPCC of the ORF Onshore Pipeline Tie-in for the Bukit Tua Development Project',
      ],
    },
    {
      year: '2020',
      items: [
        'Engineering, Procurement and Construction (EPC) of the Aroma Kopi Gas Distribution Infrastructure, 12” diameter, 4.4 km long, worth 58.8 M',
        'Engineering, Procurement and Construction (EPC) of the Cepu Receiving Facility, 24” diameter, 0.24 km long, worth 50.2 M',
        'POMA Pipeline Maintenance Services with a total pipeline length of 840 km Senipah-Handil-Kutai Lama-Badak-Santan-Bontang worth 40 M',
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 681 M',
        'Rokan Riau Oil Pipeline Project worth 1.050 T',
      ],
    },
    {
      year: '2021',
      items: [
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 539 M',
        'Construction of Natural Gas Networks for Households in Surabaya and Sidoarjo',
        'Construction of Natural Gas Networks for Households in Wajo and Banggai',
        'Construction of GasKita Mandiri COCO Household Natural Gas Networks in the Jakarta and Tangerang Areas',
      ],
    },
    {
      year: '2022',
      items: [
        'EPC Services for the Senipah - Balikpapan Gas Pipeline',
        'Sumatera Operation Construction Services Work Unit Rate Earthwork Package 1',
        'Provision of Sales Gas Jumperline',
        'Safety Equipment Maintenance & Services',
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 510 M',
        'Construction of GasKita Household Gas Networks',
      ],
    },
    {
      year: '2023',
      items: [
        'EPC Services for the Pengapon Boyolali Pipeline',
        'Asset Management and Reliability of Operating Infrastructure and Gas Management Systems (Mario Simag) with a Project Value of 447 M',
        'Jargas Asset Management Works 79.8 M',
        'Construction of GasKita Household Gas Networks',
      ],
    },
  ],
};

export const leadership: typeof id.leadership = {
  eyebrow: 'BOD & BOC',
  title: 'Move the company forward for a better service',
  text: 'PT PGAS Solution is primarily about people. We highly appreciate that the Company is managed by the most competent and in-demand professionals in the industry',
};

export const recognitionIntro: typeof id.recognitionIntro = {
  eyebrow: 'Awards and Certification',
  title: 'Always have a target in mind, always strive for the best',
  text: 'These are not our trophies for winning a competition, but our proof that we always give our best for your benefit',
};
