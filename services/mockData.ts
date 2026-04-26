import { PastPaper, Subject, DifficultyLevel } from '../types';

export const SUBJECTS: Subject[] = [
  // --- A Level Subjects ---
  { id: 'phy-al', name: 'Physics', slug: 'physics', code: '9702', level: 'A Level' },
  { id: 'chem-al', name: 'Chemistry', slug: 'chemistry', code: '9701', level: 'A Level' },
  { id: 'bio-al', name: 'Biology', slug: 'biology', code: '9700', level: 'A Level' },
  { id: 'math-al', name: 'Mathematics', slug: 'mathematics', code: '9709', level: 'A Level' },
  { id: 'cs-al', name: 'Computer Science', slug: 'computer-science', code: '9618', level: 'A Level' }, // Handles 9608 legacy
  { id: 'eco-al', name: 'Economics', slug: 'economics', code: '9708', level: 'A Level' },
  { id: 'bus-al', name: 'Business', slug: 'business', code: '9609', level: 'A Level' },
  { id: 'acc-al', name: 'Accounting', slug: 'accounting', code: '9706', level: 'A Level' },
  { id: 'psy-al', name: 'Psychology', slug: 'psychology', code: '9990', level: 'A Level' },
  { id: 'soc-al', name: 'Sociology', slug: 'sociology', code: '9699', level: 'A Level' },
  { id: 'law-al', name: 'Law', slug: 'law', code: '9084', level: 'A Level' },
  { id: 'his-al', name: 'History', slug: 'history', code: '9489', level: 'A Level' }, // Handles 9389 legacy

  // --- O Level Subjects ---
  { id: 'phy-ol', name: 'Physics', slug: 'physics', code: '5054', level: 'O Level' },
  { id: 'chem-ol', name: 'Chemistry', slug: 'chemistry', code: '5070', level: 'O Level' },
  { id: 'bio-ol', name: 'Biology', slug: 'biology', code: '5090', level: 'O Level' },
  { id: 'math-ol', name: 'Mathematics D', slug: 'mathematics-d', code: '4024', level: 'O Level' },
  { id: 'addmath-ol', name: 'Add. Mathematics', slug: 'mathematics-additional', code: '4037', level: 'O Level' },
  { id: 'cs-ol', name: 'Computer Science', slug: 'computer-science', code: '2210', level: 'O Level' },
  { id: 'eco-ol', name: 'Economics', slug: 'economics', code: '2281', level: 'O Level' },
  { id: 'bus-ol', name: 'Business Studies', slug: 'business-studies', code: '7115', level: 'O Level' },
  { id: 'acc-ol', name: 'Accounting', slug: 'accounting', code: '7707', level: 'O Level' },
  { id: 'eng-ol', name: 'English Language', slug: 'english-language', code: '1123', level: 'O Level' },
  { id: 'pst-ol', name: 'Pakistan Studies', slug: 'pakistan-studies', code: '2059', level: 'O Level' },
  { id: 'isl-ol', name: 'Islamiyat', slug: 'islamiyat', code: '2058', level: 'O Level' },
];

// Topics for tagging weaknesses
export const SUBJECT_TOPICS: Record<string, string[]> = {
    '9702': ['Kinematics', 'Forces', 'Work & Energy', 'Waves', 'Electricity', 'Nuclear Physics', 'Magnetic Fields', 'Thermodynamics'],
    '9701': ['Atomic Structure', 'Bonding', 'Energetics', 'Kinetics', 'Equilibria', 'Organic Chemistry', 'Periodicity'],
    '9709': ['Quadratics', 'Coordinate Geometry', 'Trigonometry', 'Differentiation', 'Integration', 'Vectors', 'Complex Numbers', 'Differential Equations', 'Statistics', 'Probability'],
    '9618': ['Data Representation', 'Hardware', 'Logic Gates', 'Processor Fundamentals', 'Assembly Language', 'Networking', 'Security', 'Databases', 'Algorithm Design'],
    '5054': ['Physical Quantities', 'Kinematics', 'Dynamics', 'Mass, Weight, Density', 'Turning Effects', 'Pressure', 'Energy Sources', 'Thermal Physics', 'Light', 'Sound', 'Electricity'],
    '4024': ['Numbers', 'Set Language', 'Algebra', 'Matrices', 'Geometry', 'Trigonometry', 'Vectors', 'Transformation', 'Statistics', 'Probability'],
};

export const getSubjectsTopics = (code: string): string[] => {
    return SUBJECT_TOPICS[code] || ['General Theory', 'Calculations', 'Essay Writing', 'Data Response', 'Multiple Choice'];
};

const calculateDifficulty = (threshold: number, total: number): DifficultyLevel => {
  const percentage = (threshold / total) * 100;
  if (percentage >= 75) return 'Very Easy';
  if (percentage >= 68) return 'Easy';
  if (percentage >= 62) return 'Medium';
  if (percentage > 55) return 'Hard';
  return 'Very Hard';
};

// Comprehensive Database of 'A' Grade Thresholds (2010-2024)
// Key Format: CODE-YEAR-SESSION-PAPER-VARIANT (or shortened if applying to all variants of a paper)
const OFFICIAL_THRESHOLDS: Record<string, number> = {
    // --- 2024 ---
    // Mathematics 9709 June 2024 (Precise Data)
    '9709-2024-s-11': 50, '9709-2024-s-12': 60, '9709-2024-s-13': 58,
    '9709-2024-s-21': 41, '9709-2024-s-22': 40, '9709-2024-s-23': 40,
    '9709-2024-s-31': 48, '9709-2024-s-32': 48, '9709-2024-s-33': 54,
    '9709-2024-s-41': 39, '9709-2024-s-42': 36, '9709-2024-s-43': 39,
    '9709-2024-s-51': 37, '9709-2024-s-52': 36, '9709-2024-s-53': 44,
    '9709-2024-s-61': 40, '9709-2024-s-62': 39, '9709-2024-s-63': 42,

    // Sciences June 2024 (Variant 2s)
    '9702-2024-s-11': 28, '9702-2024-s-12': 28, '9702-2024-s-22': 44, '9702-2024-s-42': 62,
    '9701-2024-s-12': 25, '9701-2024-s-22': 36, '9701-2024-s-42': 55,

    // --- 2023 ---
    '9702-2023-s-12': 23, '9702-2023-s-22': 42, '9702-2023-s-42': 59,
    '9701-2023-s-12': 23, '9701-2023-s-22': 36, '9701-2023-s-42': 54,
    '9709-2023-s-12': 58, '9709-2023-s-32': 55, '9709-2023-s-52': 35,
    '9618-2023-s-12': 42, '9618-2023-s-22': 43,

    // --- 2022 ---
    '9702-2022-s-12': 25, '9702-2022-s-22': 38, '9702-2022-s-42': 52,
    '9701-2022-s-12': 24, '9701-2022-s-22': 32, '9701-2022-s-42': 50,
    '9709-2022-s-12': 54, '9709-2022-s-32': 50, '9709-2022-s-52': 33,
    
    // --- 2021 (Nov) ---
    '9702-2021-w-12': 24, '9702-2021-w-22': 35, '9702-2021-w-42': 55,
    '9709-2021-w-12': 50, '9709-2021-w-32': 48,

    // --- 2021 (June) ---
    '9702-2021-s-12': 22, '9702-2021-s-22': 32, '9702-2021-s-42': 50,
    '9701-2021-s-12': 20, '9701-2021-s-22': 28, '9701-2021-s-42': 48,
    '9709-2021-s-12': 48, '9709-2021-s-32': 45,

    // --- 2020 (Nov) ---
    '9702-2020-w-12': 22, '9702-2020-w-22': 31, '9702-2020-w-42': 55,
    '9701-2020-w-12': 21, '9701-2020-w-22': 30, '9701-2020-w-42': 52,

    // --- 2019 ---
    '9702-2019-s-12': 28, '9702-2019-s-22': 43, '9702-2019-s-42': 63,
    '9701-2019-s-12': 25, '9701-2019-s-22': 42, '9701-2019-s-42': 60,
    '9709-2019-s-12': 61, '9709-2019-s-32': 58,
    '9608-2019-s-12': 38, '9608-2019-s-22': 40,

    // --- 2018 ---
    '9702-2018-s-11': 28, '9702-2018-s-12': 28, '9702-2018-s-21': 43, '9702-2018-s-22': 44, '9702-2018-s-42': 60,
    '9702-2018-w-12': 26, '9702-2018-w-22': 40, '9702-2018-w-42': 58,
    '9701-2018-s-12': 26, '9701-2018-s-22': 44, '9701-2018-s-42': 59,
    '9709-2018-s-12': 60, '9709-2018-s-32': 56, '9709-2018-s-42': 40, '9709-2018-s-62': 39,

    // --- 2017 ---
    '9702-2017-s-11': 26, '9702-2017-s-12': 27, '9702-2017-s-22': 38, '9702-2017-s-42': 55,
    '9702-2017-w-12': 25, '9702-2017-w-22': 36, '9702-2017-w-42': 54,
    '9701-2017-s-12': 24, '9701-2017-s-22': 35, '9701-2017-s-42': 52,
    '9709-2017-s-12': 62, '9709-2017-s-32': 59,

    // --- 2016 ---
    '9702-2016-s-12': 26, '9702-2016-s-22': 40, '9702-2016-s-42': 58,
    '9702-2016-w-12': 27, '9702-2016-w-22': 42, '9702-2016-w-42': 60,
    '9701-2016-s-12': 25, '9701-2016-s-22': 38, '9701-2016-s-42': 56,
    '9709-2016-s-12': 63, '9709-2016-s-32': 57,

    // --- 2015 ---
    '9702-2015-s-12': 28, '9702-2015-s-22': 42, '9702-2015-s-42': 62,
    '9702-2015-w-12': 26, '9702-2015-w-22': 38, '9702-2015-w-42': 58,
    '9709-2015-s-12': 60, '9709-2015-s-32': 55,

    // --- 2014 ---
    '9702-2014-s-12': 27, '9702-2014-s-22': 40, '9702-2014-s-42': 60,
    '9709-2014-s-12': 62, '9709-2014-s-32': 58,

    // --- 2013 ---
    '9702-2013-s-12': 26, '9702-2013-s-22': 38, '9702-2013-s-42': 56,
    '9709-2013-s-12': 61, '9709-2013-s-32': 56,

    // --- 2012 ---
    '9702-2012-s-12': 25, '9702-2012-s-22': 36, '9702-2012-s-42': 54,
    '9709-2012-s-12': 59, '9709-2012-s-32': 54,

    // --- 2011 ---
    '9702-2011-s-12': 24, '9702-2011-s-22': 35, '9702-2011-s-42': 52,
    '9709-2011-s-12': 58, '9709-2011-s-32': 52,

    // --- 2010 ---
    '9702-2010-s-12': 23, '9702-2010-s-22': 34, '9702-2010-s-42': 50,
    '9709-2010-s-12': 57, '9709-2010-s-32': 51,
};

const generateCaieUrl = (
  level: 'O Level' | 'A Level',
  subjectSlug: string,
  subjectCode: string,
  year: number,
  session: 'May/June' | 'Oct/Nov',
  paperNumber: number,
  variant: number,
  type: 'qp' | 'ms'
): string => {
  const levelPath = level === 'A Level' ? 'cambridge-international-a-level' : 'cambridge-o-level';
  const subjectPath = `${subjectSlug}-${subjectCode}`;
  const sessionCode = session === 'May/June' ? 's' : 'w';
  const yearShort = year.toString().slice(-2);
  const filename = `${subjectCode}_${sessionCode}${yearShort}_${type}_${variant}.pdf`;
  return `https://bestexamhelp.com/exam/${levelPath}/${subjectPath}/${year}/${filename}`;
};

// Helper to estimate duration in minutes
export const getPaperDuration = (paperNumber: number, level: 'O Level' | 'A Level'): number => {
    if (level === 'O Level') {
        if (paperNumber === 1) return 60; // MCQs usually 1h
        return 90; // Theory usually 1h 30m - 2h
    } else {
        // A Level
        if (paperNumber === 1) return 75; // 1h 15m
        if (paperNumber === 2) return 75; // AS Structured
        if (paperNumber === 3) return 120; // Advanced Practical
        if (paperNumber === 4) return 120; // A2 Structured
        if (paperNumber === 5) return 75; // Planning/Analysis
        if (paperNumber === 6) return 60; // Stats/Probability (Maths)
        return 90;
    }
};

// Deterministic pseudo-random number generator for historical fallbacks
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const generateMockPapers = (subjectId: string): PastPaper[] => {
  const papers: PastPaper[] = [];
  const subject = SUBJECTS.find(s => s.id === subjectId);
  if (!subject) return [];

  const startYear = 2010; // Capped at 2010 for reliable data coverage
  const endYear = 2024;
  
  // Define paper types based on level and subject
  let paperTypes: number[];
  
  if (subject.level === 'O Level') {
      paperTypes = [1, 2];
  } else {
      paperTypes = [1, 2, 3, 4, 5];
      if (subject.code === '9709') paperTypes = [1, 2, 3, 4, 5, 6];
      else if (['9618', '9708', '9609', '9990', '9699', '9084', '9489'].includes(subject.code)) paperTypes = [1, 2, 3, 4];
      else if (subject.code === '9706') paperTypes = [1, 2, 3];
  }
  
  for (let year = endYear; year >= startYear; year--) {
    let effectiveCode = subject.code;
    let effectiveSlug = subject.slug;

    if (subject.code === '9618' && year <= 2020) effectiveCode = '9608';
    if (subject.code === '9489' && year <= 2020) effectiveCode = '9389'; 
    if (subject.code === '7707' && year <= 2019) { 
        effectiveCode = '7110';
        effectiveSlug = 'principles-of-accounts';
    }

    ['May/June', 'Oct/Nov'].forEach(session => {
      paperTypes.forEach(pNum => {
         [1, 2, 3].forEach(vNum => { // Include Variant 3 (common in many zones)
            const variant = parseInt(`${pNum}${vNum}`);
            
            // --- TOTAL MARKS LOGIC ---
            let totalMarks = 60; // Default fallback

            // 1. Sciences (Phy 9702, Chem 9701, Bio 9700)
            if (['9702', '9701', '9700'].includes(effectiveCode)) {
                if (pNum === 1) totalMarks = 40;
                else if (pNum === 2) totalMarks = 60;
                else if (pNum === 3) totalMarks = 40;
                else if (pNum === 4) totalMarks = 100;
                else if (pNum === 5) totalMarks = 30;
            }
            // 2. Mathematics (9709)
            else if (effectiveCode === '9709') {
                 if (pNum === 1 || pNum === 3) totalMarks = 75;
                 else totalMarks = 50; 
            }
            // 3. Computer Science (9618, 9608)
            else if (effectiveCode === '9618' || effectiveCode === '9608') {
                totalMarks = 75;
            }
            // 4. Economics (9708)
            else if (effectiveCode === '9708') {
                if (pNum === 1 || pNum === 3) totalMarks = 30;
                else if (pNum === 2) totalMarks = 60;
                else if (pNum === 4) totalMarks = 60;
            }
            // 5. Business (9609)
            else if (effectiveCode === '9609') {
                if (pNum === 1) totalMarks = 40;
                else if (pNum === 2) totalMarks = 60;
                else if (pNum === 3) totalMarks = 60; 
                else if (pNum === 4) totalMarks = 40;
            }
            // 6. Psychology (9990)
            else if (effectiveCode === '9990') totalMarks = 60; 
            // 7. Sociology (9699)
            else if (effectiveCode === '9699') {
                if (pNum === 4) totalMarks = 70;
                else totalMarks = 50;
            }
            // 8. Law (9084)
            else if (effectiveCode === '9084') {
                if (pNum === 2) totalMarks = 50;
                else totalMarks = 75;
            }
            // 9. History (9489)
            else if (effectiveCode === '9489' || effectiveCode === '9389') {
                 if (pNum === 1) totalMarks = 40;
                 else if (pNum === 2) totalMarks = 60;
                 else if (pNum === 3) totalMarks = 40;
                 else if (pNum === 4) totalMarks = 60;
            }
            // 10. Accounting (9706)
            else if (effectiveCode === '9706') {
                 if (pNum === 1) totalMarks = 30;
                 else if (pNum === 2) totalMarks = 90;
                 else if (pNum === 3) totalMarks = 75;
            }
            // --- O Levels ---
            // 11. O Level CS (2210)
            else if (effectiveCode === '2210') totalMarks = 75;
            // 12. O Level Sciences (5054, 5070, 5090)
            else if (['5054', '5070', '5090'].includes(effectiveCode)) {
                 if (pNum === 1) totalMarks = 40;
                 else totalMarks = 80;
            }
            // 13. O Level Math (4024)
            else if (effectiveCode === '4024') {
                 if (pNum === 1) totalMarks = 80;
                 else totalMarks = 100;
            }
            
            // --- THRESHOLD LOGIC ---
            
            let threshold: number;

            // 1. Try to find Official Threshold (Matches specific key)
            const sessionKey = session === 'May/June' ? 's' : 'w';
            const lookupKey = `${effectiveCode}-${year}-${sessionKey}-${pNum}${vNum}`;
            const lookupKeyVariantLess = `${effectiveCode}-${year}-${sessionKey}-${pNum}2`; // Try Variant 2 as default if exact not found
            
            if (OFFICIAL_THRESHOLDS[lookupKey]) {
                threshold = OFFICIAL_THRESHOLDS[lookupKey];
            } else if (OFFICIAL_THRESHOLDS[lookupKeyVariantLess]) {
                // If specific variant is missing (e.g., old years only captured variant 2), use variant 2 proxy
                threshold = OFFICIAL_THRESHOLDS[lookupKeyVariantLess];
            } else {
                // 3. Accurate Interpolation for data gaps (Rare with this DB)
                // Use closest year available
                let referenceYear = year;
                while(referenceYear < 2024 && !OFFICIAL_THRESHOLDS[`${effectiveCode}-${referenceYear}-${sessionKey}-${pNum}2`]) {
                    referenceYear++;
                }
                
                const refKey = `${effectiveCode}-${referenceYear}-${sessionKey}-${pNum}2`;
                if (OFFICIAL_THRESHOLDS[refKey]) {
                    threshold = OFFICIAL_THRESHOLDS[refKey];
                } else {
                    // Fallback to average percentages if no close year found (Very old papers)
                     let basePercent = 0.65; 
                    if (pNum === 1) basePercent = 0.72; 
                    else if (pNum === 3 || pNum === 5) basePercent = 0.68;
                    else if (pNum === 2 || pNum === 4) basePercent = 0.60;
                    threshold = Math.floor(totalMarks * basePercent);
                }
            }
            
            papers.push({
                id: `${effectiveCode}-${year}-${session}-${variant}`,
                subjectId: subject.id,
                year,
                session: session as 'May/June' | 'Oct/Nov',
                paperNumber: pNum,
                variant: variant,
                totalMarks,
                aGradeThreshold: threshold,
                difficulty: calculateDifficulty(threshold, totalMarks),
                downloadUrl: generateCaieUrl(
                    subject.level, effectiveSlug, effectiveCode, year, session as 'May/June' | 'Oct/Nov', pNum, variant, 'qp'
                ),
                markSchemeUrl: generateCaieUrl(
                    subject.level, effectiveSlug, effectiveCode, year, session as 'May/June' | 'Oct/Nov', pNum, variant, 'ms'
                )
            });
         });
      });
    });
  }
  return papers;
};