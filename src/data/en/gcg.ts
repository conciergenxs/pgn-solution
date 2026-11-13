// English copy for src/data/gcg.ts. The original English GCG page carries an older version of the
// governance text and leaves the Anti-Bribery, WBS and part of the CSR sections in Indonesian, so this
// translates the current Indonesian page, reusing the original English wording where the two match
// (hero, principles, adapted principles, shareholder, CSR, HSSE commitment).
import * as id from '../gcg';

export const gcgHero: typeof id.gcgHero = {
  ...id.gcgHero,
  title: 'Commitment to Transparency',
  text: 'We are committed to the idea of radical transparency. This means we are open, true and direct with information about our organization, procedures and outcomes',
};

export const governance: typeof id.governance = {
  title: 'Good Corporate Governance',
  paragraphs: [
    'PGAS Solution began pioneering Good Corporate Governance (GCG) in 2013. PGAS Solution always strives to realize Good Corporate Governance in all of its business activities, to keep its performance on the right track and in line with the applicable laws and regulations.',
    'These governance guidelines continue to be refined as they develop. The latest are set out in the Good Corporate Governance Guidelines of PT PGAS Solution Number: P-001/100.08 Revision 02 dated 27 September 2021.',
    'To complement the GCG regulations, the Company’s code of conduct prepared in 2016 was also ratified as the Business Ethics and Work Ethics Guidelines Number: P-002/100.08 dated 08 August 2018, which were later updated in the Business Ethics and Work Ethics Guidelines of PT PGAS Solution Number: P-002/100.08 Revision 02 dated 27 September 2021.',
    'Furthermore, on 12 February 2018, the Corporate Culture Committee was formed as a sign of PGAS Solution’s commitment to improving its governance system. The Company’s GCG implementation in 2019 was assessed through the GCG Soft Structure Self Assessment for Subsidiaries/Affiliates conducted by PGN as the holding, followed in 2020 and 2021 by a GCG Self Assessment using State-Owned Enterprise (BUMN) parameters. With these assessments, GCG implementation is expected to be further improved in the coming years.',
  ],
};

export const principles: typeof id.principles = {
  title: 'GCG Principles',
  intro: 'Based on Regulation of the Minister of State-Owned Enterprises Number PER-09/MBU/2012 dated 6 July 2012 on the Amendment to Regulation of the Minister of State-Owned Enterprises Number PER-01/MBU/2011 on the Implementation of Good Corporate Governance, the following are the GCG principles applied by PGAS Solution:',
  items: [
    { ...id.principles.items[0], name: 'Transparency', text: 'Openness in the decision-making process and in disclosing material and relevant information about the company.' },
    { ...id.principles.items[1], name: 'Accountability', text: 'Clarity of the functions, implementation and accountability of the Company’s Organs so that the company is managed effectively.' },
    { ...id.principles.items[2], name: 'Responsibility', text: 'The Company must comply with laws and regulations and carry out its responsibilities towards the community and the environment, so that business continuity is maintained in the long term and it is recognized for Good Corporate Governance.' },
    { ...id.principles.items[3], name: 'Independency', text: 'A condition in which the company is managed professionally, free from conflicts of interest and from influence or pressure by any party that is not in line with laws and regulations.' },
    { ...id.principles.items[4], name: 'Fairness', text: 'In carrying out its activities, the Company must always consider the interests of shareholders based on the principles of fairness and equality.' },
  ],
  adaptedIntro: 'GCG Principles in Practice',
  adaptedText: 'PGAS Solution translates these five principles into the following five working commitments.',
  adapted: [
    {
      title: 'Transparency in Tasks and Financial Reports',
      paragraphs: ['Information disclosure as part of Transparency is realized through clear task details and responsibilities for every PGAS Solution employee, set in line with the vision, mission, values and goals of PGAS Solution. Material information can be provided by PGAS Solution when needed in the annual report and financial statements, in accordance with the applicable regulations, plainly, clearly and objectively.'],
    },
    {
      title: 'Accountability through the Internal Control System',
      paragraphs: ['The internal control system at PGAS Solution is the process of controlling PGAS Solution’s activities. This control process applies to every unit within PGAS Solution. The internal control system covers, among others, authority, authorization, verification, reconciliation, performance evaluation, division of duties, and the security of company assets.'],
    },
    {
      title: 'Responsibility in Business Ethics and Work Ethics',
      paragraphs: [
        'Every member of the Company must strive to comply with the principles of business ethics and work ethics, or the Company’s code of conduct, which are the norms and values set as the standard of conduct for every employee of the Company. These norms and values help sustain the Company’s good name in the public eye.',
        'The Code of Conduct must be applied consistently in every activity of the Company. In preparing the code of conduct, the Company has aligned it with its Vision, Mission and Culture, to support the synergy between the Company’s activities, its Articles of Association and the applicable regulations. Compliance with the code of conduct will shape a good Corporate Culture and business integrity, strengthening the relationship between the Company and its Stakeholders.',
        'The Company has set guidelines on ethical conduct (Business Ethics and Work Ethics), which essentially contain the values of business ethics and work ethics. Business Ethics and Work Ethics are explained in detail in separate Guidelines.',
      ],
    },
    {
      title: 'Prevention of Conflicts of Interest',
      paragraphs: [
        'A conflict of interest is a situation where an individual or a company has the power to exploit a certain interest due to the position or authority of that individual or company. In relation to PGAS Solution’s business activities, a conflict of interest is a conflict between personal interest and general or professional obligations.',
        'Regarding conflicts of interest, members of the Board of Commissioners, the Board of Directors and all PGAS Solution personnel are not allowed to take any action that results in a conflict of interest with PGAS Solution, among others:',
      ],
      list: [
        'Obtaining and/or accepting gratification.',
        'Taking personal profit from decision-making and/or the implementation of the Company’s activities, other than legitimate income.',
        'Holding concurrent positions with a third party that has financial ties to PGAS Solution and that may cause material loss to PGAS Solution.',
      ],
    },
    {
      title: 'Upholding Integrity as a Means of Fairness',
      paragraphs: ['A quality company that displays the spirit of honesty or integrity is needed in maintaining good relations between PGAS Solution and its Shareholders and stakeholders. By maintaining a working environment that is professional, honest, open, caring, and responsive to change, a synergy between PGAS Solution, the Shareholders, and stakeholders will be created. To maintain integrity in the management of PGAS Solution, appropriate actions are required in running, directing, and controlling its business activities. Problems related to PGAS Solution’s business activities are resolved wisely and with high integrity.'],
    },
  ],
};

export const policyBasis: typeof id.policyBasis = {
  title: 'GCG Policy Basis',
  intro: 'In building good governance, the Company refers to the corporate governance policies in force in Indonesia, as a form of regulatory compliance. The Company refers to:',
  regulations: [
    'Law No. 40 of 2007 on Limited Liability Companies.',
    'Regulation of the Minister of State-Owned Enterprises Number PER-01/MBU/2011 on the Implementation of Good Corporate Governance (GCG) in State-Owned Enterprises.',
    'Regulation of the Minister of State-Owned Enterprises Number PER-09/MBU/2012 on the Amendment to Regulation Number PER-01/MBU/2011 on the Implementation of Good Corporate Governance (GCG) in State-Owned Enterprises.',
    'Indonesian GCG Guidelines 2016 of the National Committee on Governance Policy (KNKG).',
    'Circular Letter of the Minister of State-Owned Enterprises Number SE-7/MBU/07/2020 dated 01 July 2020 on the Core Values of Human Resources of State-Owned Enterprises.',
  ],
  internalIntro: 'GCG management is set out in the Decree of the Board of Directors of PT PGAS Solution on the applicable Organizational Structure and Work Procedures of PT PGAS Solution, and the implementation of the Company’s GCG policy refers to:',
  internal: [
    'The Articles of Association of PT PGAS Solution contained in the Deed of Establishment of PT PGAS Solution Number 2 dated 06 August 2009, drawn up before Fatiah Helmi, S.H., Notary in Jakarta, and its amendments.',
    'Good Corporate Governance Guidelines of PT PGAS Solution Number: P-001/100.08 Revision 02 dated 27 September 2021 and their amendments.',
    'Business Ethics and Work Ethics Guidelines of PT PGAS Solution Number: P-002/100.08 Revision 02 dated 27 September 2021 and their amendments.',
    'Risk Management Guidelines of PT PGAS Solution Number: P-001/100.07 Revision 02 dated 1 October 2021 and their amendments.',
    'Internal Audit Unit Audit Charter Guidelines Number: P-001/100.09 Revision 01 dated 1 July 2022 and their amendments.',
    'Whistleblowing System (WBS) Guidelines Number: P-002/100.09 Revision 01 dated 4 October 2021 and their amendments.',
    'Guidelines on Handling Conflicts of Interest and Controlling Gratification Number: P-003/100.09 dated 4 October 2021 and their amendments.',
  ],
};

export const roadmap: typeof id.roadmap = {
  title: 'GCG Roadmap',
  years: [
    { year: '2016', items: ['GCG socialization in line with the Organizational Structure and Work Procedures of PT PGAS Solution'] },
    { year: '2017', items: ['GCG implementation across all PGAS Solution operating areas'] },
    {
      year: '2018',
      items: [
        'Changes to the Company’s GCG policies, such as the GCG Guidelines (Revision 1)',
        'Changes to the Business Ethics and Work Ethics Guidelines (Revision 1)',
        'Changes to the Quality, HSSE Management System Guidelines (Revision 3)',
        'Establishment of the Operating Procedure for Preparing the Long-Term Plan (RJPP)',
      ],
    },
    { year: '2019', items: ['GCG Soft Structure Self Assessment by PGN (Holding) as the supervisor, and establishment of the Risk Management Guidelines'] },
    {
      year: '2020',
      items: [
        'Establishment of the Internal Audit Unit Audit Charter Guidelines',
        'Establishment of the Whistleblowing System (WBS) Guidelines',
        'Establishment of the Human Resource Management Guidelines',
        'Establishment of the Procurement of Goods/Services Guidelines',
        'Changes to the Strategic Initiative Maturity Governance Guidelines (Revision 1)',
        'Changes to the Operating Procedure for Reallocation and Changes to the Company Work Plan and Budget (Revision 1)',
        'GCG Self Assessment (State-Owned Enterprise parameters)',
        'GCG socialization for employees',
      ],
    },
    {
      year: '2021',
      items: [
        'Changes to the Good Corporate Governance Guidelines (Revision 2)',
        'Changes to the Business Ethics and Work Ethics Guidelines (Revision 2)',
        'Changes to the Whistleblowing System (WBS) Guidelines (Revision 1)',
        'Establishment of the Guidelines on Handling Conflicts of Interest and Controlling Gratification',
        'Changes to the Risk Management Guidelines (Revision 2)',
        'Establishment of the Business Development Cooperation Guidelines',
        'Establishment of the Operating Procedure for Controlling the Company Work Plan and Budget (RKAP)',
        'Changes to the Operating Procedure for Performance Measurement and Monitoring (Revision 1)',
        'New employee induction on the GCG Guidelines and Ethics Guidelines',
        'GCG Self Assessment (State-Owned Enterprise parameters)',
        'GCG socialization for employees',
      ],
    },
    {
      year: '2022',
      items: [
        'Establishment of the Board Manual',
        'Changes to the Internal Audit Unit Audit Charter Guidelines (Revision 1)',
        'Establishment of the Corporate Communication Management Guidelines',
        'Changes to the Operating Procedure for Internal Procurement of Goods/Services (Revision 4)',
        'Changes to the Operating Procedure for Project Procurement of Goods/Services (Revision 5)',
        'Changes to the Career System Operating Procedure',
        'Changes to the New Employee Induction Operating Procedure',
        'Establishment of the Work Instruction for Preparing and Assessing Work Unit KPIs',
        'Establishment of the RJPP Roadmap Work Instruction',
        'Establishment of the RJPP Evaluation Work Instruction',
        'Establishment of the Meeting Implementation Work Instruction',
        'New employee induction on the GCG Guidelines and Ethics Guidelines',
        'GCG assessment by a third party',
        'GCG socialization for employees',
      ],
    },
    {
      year: '2023',
      items: [
        'GCG awareness socialization for every employee',
        'New employee induction on the GCG Guidelines and Ethics Guidelines',
        'GCG assessment by a third party',
        'Establishment of the Anti-Bribery Management System (SMAP) Guidelines',
        'Establishment and implementation of ISO 37001:2016 Anti-Bribery Management System (SMAP)',
        'Changes to the Procurement of Goods/Services Operating Procedure (Revision 02)',
        'Changes to the Operating Procedure for Reallocation and Changes to the Company Work Plan and Budget (Revision 03)',
        'Changes to the Operating Procedure for Internal Procurement of Goods/Services (Revision 05)',
        'Changes to the Operating Procedure for Project Procurement of Goods/Services (Revision 06)',
        'Establishment of the Company Long-Term Plan Preparation Guidelines',
        'Establishment of the Meeting Management Guidelines',
        'Establishment of the Permit Management Guidelines',
        'Changes to the Investment Initiative Maturity Governance Guidelines (Revision 02)',
        'Changes to the Corporate Communication Management Guidelines (Revision 01)',
      ],
    },
  ],
};

export const antiBribery: typeof id.antiBribery = {
  title: 'Anti-Bribery Management System',
  intro: 'PT PGAS Solution is always committed to being a reliable partner in infrastructure development services. In carrying out this commitment, we are determined to apply the principles of Good Corporate Governance and the Anti-Bribery Management System consistently and in an integrated way across all business units, to achieve the Company’s goals, vision and mission through:',
  items: [
    'Providing the best service to all stakeholders and assuring clean business practices to stakeholders, including prohibiting bribery, gratification and similar practices within the Company, while always complying with laws, other regulations and applicable requirements.',
    'Improving performance, professionalism, synergy, ethics and anti-bribery awareness to achieve anti-bribery objectives and add value for stakeholders.',
    'Ensuring the implementation of the anti-bribery management system in line with business process needs, to serve partners and stakeholders in achieving the Company’s goals.',
    'Applying ethical behaviour as a work culture in every activity, including enforcing discipline and the law, as part of building Solutionation.',
    'Providing Corporate Governance that supports the anti-bribery management system, including assigning responsibility, authority and independence to the Anti-Bribery Compliance Function.',
    'Raising anti-bribery awareness at all functions and levels, together with care, good faith and confidence without fear of retaliation.',
    'Implementing an anti-bribery management system based on risk management principles.',
  ],
  closing: 'The management and all employees of PT PGAS Solution must understand and commit to carrying out these activities, continually evaluate their suitability, and accept the consequences that apply under Company regulations.',
};

export const wbs: typeof id.wbs = {
  title: 'Whistleblowing System',
  paragraphs: [
    'As an embodiment of the Good Corporate Governance principle, PGAS Solution is committed to building a Whistleblowing System that manages complaints or disclosures of unlawful conduct, unethical or improper acts, violations of policies and/or Company Regulations, and acts or conduct that may cause material or immaterial loss.',
    'The Whistleblowing System serves as a means of resolving and disclosing violations or fraud within the Company. Its purpose is to keep PGAS Solution’s performance on the right track, in accordance with the applicable laws and regulations.',
    'These Whistleblowing System Guidelines continue to be refined as they develop. The latest are set out in Whistleblowing System Guidelines Number P-002/100.09 Revision 01, in force since 4 October 2021.',
  ],
  legalTitle: 'Legal Basis',
  legal: [
    'Law Number 31 of 1999 in conjunction with Law Number 20 of 2001 on the Eradication of Corruption',
    'Law Number 13 of 2006 in conjunction with Law Number 31 of 2014 on the Protection of Witnesses and Victims',
    'Regulation of the Minister of State-Owned Enterprises Number Per-09/MBU/2012 in conjunction with Number Per-01/MBU/2011 on the Implementation of Good Corporate Governance',
    'Whistleblowing System Guidelines of PT Perusahaan Gas Negara Tbk Number P-002/A011',
    'Good Corporate Governance Guidelines of PT PGAS Solution Number P-001/100.08',
    'Business Ethics & Work Ethics Guidelines of PT PGAS Solution Number P-002/100.08',
  ],
  reportableTitle: 'Acts that can be reported include:',
  reportable: [
    'Corruption (including Gratification)',
    'Violations of tax provisions / other laws and regulations',
    'Fraud',
    'Abuse of position for interests outside the company',
    'Acts that violate the law & Company regulations (including violence, extortion, drug use / other criminal acts)',
    'Violations of the Business Ethics & Work Ethics Guidelines',
    'Acts that may cause financial / non-financial loss',
  ],
  channelsTitle: 'You can report to:',
  channels: [
    { ...id.wbs.channels[0], label: 'PGN Website' },
    { ...id.wbs.channels[1], label: 'WBS Ethics Committee Email' },
    { label: 'Official Letter', value: 'An official letter addressed to the Company c.q. the Ethics Committee, at: PT Perusahaan Gas Negara Tbk – Komite Etik, Graha PGAS 3rd Floor, Jl. K.H. Zainul Arifin No. 20 – Jakarta 11140.' },
  ],
  protectionTitle: 'Whistleblower Protection:',
  protection: 'The Whistleblowing System serves as a means of resolving and disclosing violations or fraud within the Company. PGAS Solution is therefore obliged to protect whistleblowers, including keeping their identity confidential and protecting the safety of the whistleblower and their family. PGAS Solution is also obliged to protect the Company’s internal whistleblowers from retaliation, including:',
  protectionList: ['Unfair dismissal', 'Demotion in position or rank', 'Harassment or discrimination', 'Adverse notes in the personal data record'],
};

export const shareholder: typeof id.shareholder = {
  ...id.shareholder,
  title: 'Shareholder',
  text: 'PT PGAS Solution is fully owned by PT Perusahaan Gas Negara (Persero), tbk.',
};

export const csr: typeof id.csr = {
  title: 'Corporate Social Responsibility',
  text: 'PGN Solution also actively contributes to the community through CSR, or Corporate Social Responsibility, programs. The CSR program is run as a form of caring for the environment and the community, as well as an effort to share happiness over the achievements of PGN Solution.',
  items: [
    { title: 'Employment CSR', text: 'Health, safety and security services for PGAS Solution employees are the embodiment of employment-related CSR.' },
    { title: 'Environment CSR', text: 'Together with PT PGN, the Company Performance Rating Program in Environmental Management (PROPER) achieved a blue rating through its implementation at PGN’s stations.' },
    { title: 'Social CSR', text: 'PGAS Solution also contributes to the BUMN Mengajar program of the Ministry of State-Owned Enterprises, as well as the Tali Kasih program, SOTR, and various financial assistance for community activities.' },
    { title: 'Customer CSR', text: 'For customers, PGAS Solution optimizes CSR through Service Enhancement. Through regular surveys, PGAS Solution strives to understand customer needs and build trust.' },
    { title: 'Medical Staff CSR', text: 'PGAS Solution contributed and showed care during the pandemic by providing masks and Personal Protective Equipment to the frontline Medical Staff treating COVID-19 patients.' },
  ],
  latestTitle: 'Latest CSR',
};

export const k3pl: typeof id.k3pl = {
  title: 'HSSE Commitment Pact',
  paragraphs: [
    'As a company engaged in Engineering, with a concentration in 3 (three) business fields including Engineering Procurement and Construction and Supply Chain.',
    'PT PGAS Solution is committed to prioritizing Occupational Safety and Health, Environment and Security in each of its business activities to minimize risks by preventing accidents, occupational diseases, environmental pollution, security disturbances and other impacts that can disrupt the smooth running of the Company’s business activities.',
  ],
  intro: 'To fulfill this, all employees of PT PGAS Solution, through the Company’s Management, are committed to:',
  items: [
    'Implementing and being directly involved in running the Occupational Safety and Health, Environment and Security Management System;',
    'Carrying out all business activities in a professional, effective, efficient and innovative way by identifying risks related to Occupational Safety and Health, Environment and Security as a control effort;',
    'Complying with applicable laws and regulations and using technology appropriately in accordance with national and international standards;',
    'Encouraging a culture of Occupational Safety and Health, Environmental Management and Security through the active participation of all employees in the Company;',
    'Making the achievement of Occupational Safety and Health, Environment and Security targets an important element in measuring performance and an important factor in increasing the company’s competitiveness;',
    'Increasing the awareness and competence of employees and work partners so that they can carry out work correctly, safely and in an environmentally sound way;',
    'Creating and maintaining a healthy, safe, secure and environmentally friendly work environment through preventive and proactive actions.',
  ],
};
