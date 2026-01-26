// Internationalization (i18n) support
// Simple translation system with minimal code changes

const TRANSLATIONS = {
    en: {
        // Logo
        'logo.text': 'Job Compass',
        'logo.version': 'v4.0',
        
        // Header & Navigation
        'nav.yourProfile': 'Your Profile',
        'nav.findJobs': 'Find Jobs',
        'nav.ourServices': 'Our Services',
        'nav.contactUs': 'Contact Us',
        
        // Main Page
        'hero.title': 'Looking for a job?',
        'hero.subtitle': 'Answer a few quick questions here and we will match you with tailored job opportunities.',
        'step.quickSurvey': 'Quick Survey',
        'step.reviewAnswers': 'Confirmation',
        'step.reviewMatches': 'Job Matches',
        
        // Form Labels
        'form.information': 'Information',
        'form.preferences': 'Preferences',
        'form.name': 'Name',
        'form.email': 'Email',
        'form.age': 'Age',
        'form.phone': 'Phone',
        'form.education': 'Education',
        'form.availability': 'Availability',
        'form.district': 'District',
        'form.experience': 'Experience',
        'form.background': 'Background',
        'form.jobFunctions': 'Job Functions',
        'form.expectedSalary': 'Expected Salary',
        
        // Form Placeholders & Options
        'form.backgroundPlaceholder': 'Briefly describe your goals, personalities, skillsets, experiences, or anything about yourself...',
        'form.backgroundHelper1': 'Help us understand your background to find better matches. For example, you may mention:',
        'form.backgroundHelper2': '1. Your work areas and specialisations',
        'form.backgroundHelper3': '2. Your career goals and aspirations',
        'form.backgroundHelper4': '3. Your personality in 3 adjectives',
        'form.backgroundHelper5': '4. Your top 3 skills and strengths',
        'form.districtHelper': 'Select your living district for better matches.',
        'form.experienceHelper': 'Choose your years of experience.',
        'form.jobFunctionHelper': 'Select up to 3 job categories.',
        'form.salaryHelper': 'Select monthly, pre-tax salary expectation.',
        
        // Dropdown Options - Age
        'option.age.default': 'Select age range',
        'option.age.18-24': '18 - 24',
        'option.age.25-34': '25 - 34',
        'option.age.35-44': '35 - 44',
        'option.age.45-54': '45 - 54',
        'option.age.55-64': '55 - 64',
        'option.age.65+': '65+',
        
        // Dropdown Options - Education
        'option.education.default': 'Select education',
        'option.education.highSchool': 'High School',
        'option.education.diploma': 'Diploma',
        'option.education.associateDegree': 'Associate Degree',
        'option.education.bachelorsDegree': 'Bachelor\'s Degree',
        'option.education.mastersDegree': 'Master\'s Degree',
        'option.education.phd': 'PhD / Doctorate',
        
        // Dropdown Options - Availability
        'option.availability.default': 'Select availability',
        'option.availability.immediate': 'Immediate',
        'option.availability.1week': '1 week notice',
        'option.availability.1month': '1 month notice',
        'option.availability.moreThan1Month': 'More than 1 month notice',
        
        // Dropdown Options - Districts
        'option.district.default': 'Select district',
        'option.district.centralWestern': 'Central and Western',
        'option.district.eastern': 'Eastern',
        'option.district.southern': 'Southern',
        'option.district.wanChai': 'Wan Chai',
        'option.district.kowloonCity': 'Kowloon City',
        'option.district.yauTsimMong': 'Yau Tsim Mong',
        'option.district.shamShuiPo': 'Sham Shui Po',
        'option.district.wongTaiSin': 'Wong Tai Sin',
        'option.district.kwunTong': 'Kwun Tong',
        'option.district.taiPo': 'Tai Po',
        'option.district.yuenLong': 'Yuen Long',
        'option.district.tuenMun': 'Tuen Mun',
        'option.district.north': 'North',
        'option.district.saiKung': 'Sai Kung',
        'option.district.shaTin': 'Sha Tin',
        'option.district.tsuenWan': 'Tsuen Wan',
        'option.district.kwaiTsing': 'Kwai Tsing',
        'option.district.islands': 'Islands',
        'option.district.anyLocation': 'Open to any work location',
        
        // Dropdown Options - Experience
        'option.experience.default': 'Select experience',
        'option.experience.none': 'No experience',
        'option.experience.1-2years': '1 - 2 years',
        'option.experience.3-4years': '3 - 4 years',
        'option.experience.5-8years': '5 - 8 years',
        'option.experience.9-10years': '9 - 10 years',
        'option.experience.over10years': 'Over 10 years',
        
        // Dropdown Options - Job Functions
        'option.jobFunction.default': 'Select job functions',
        'option.jobFunction.administration': 'Administration',
        'option.jobFunction.accounting': 'Accounting',
        'option.jobFunction.marketing': 'Marketing',
        'option.jobFunction.humanResources': 'Human Resources',
        'option.jobFunction.hospitality': 'Hospitality (F&B)',
        'option.jobFunction.customerService': 'Customer Service',
        'option.jobFunction.sales': 'Sales / Business Development',
        'option.jobFunction.technicalTrades': 'Technical Trades',
        'option.jobFunction.businessAnalysis': 'Business Analysis',
        'option.jobFunction.dataAnalytics': 'Data Analytics',
        'option.jobFunction.cybersecurity': 'Cybersecurity',
        'option.jobFunction.itSupport': 'IT Technical Support',
        'option.jobFunction.softwareEngineering': 'Software Engineering',
        'option.jobFunction.systemsEngineering': 'Systems Engineering',
        'option.jobFunction.networkEngineering': 'Network Engineering',
        'option.jobFunction.technologyManagement': 'Technology Management',
        'option.jobFunction.productManagement': 'Product Management',
        'option.jobFunction.projectManagement': 'Project Management',
        
        // Dropdown Options - Salary
        'option.salary.default': 'Select salary range',
        'option.salary.below20k': 'Below HK$20,000',
        'option.salary.20k-30k': 'HK$20,001 - HK$30,000',
        'option.salary.30k-50k': 'HK$30,001 - HK$50,000',
        'option.salary.50k-80k': 'HK$50,001 - HK$80,000',
        'option.salary.80k-100k': 'HK$80,001 - HK$100,000',
        'option.salary.above100k': 'Above HK$100,000',
        
        // Form Actions
        'form.clearSession': 'Clear Session',
        'form.next': 'Next',
        'form.back': 'Back',
        'form.newSearch': 'New Search',
        
        // Review Page
        'review.title': 'Your Responses',
        'review.category.information': 'Information',
        'review.category.preferences': 'Preferences',
        'review.consent': 'By clicking next, you consent ASK IT to use your data for job matching. If you do not agree, do not proceed.',
        
        // Loading
        'loading.finding': 'Finding tailored roles for you...',
        'loading.loading': 'Loading candidate profile...',
        'loading.waitTime': 'This may take up to 30 seconds',
        'loading.noRefresh': 'Please do not refresh this page',
        
        // Results
        'results.title': 'Your Job Matches',
        'results.subtitle': 'We found {count} matching opportunities for you',
        'results.completionCode': 'Completion Code',
        'results.completionCodeInstruction': 'Present this code to our staff at the job fair booth to receive detailed information about your job matches and personalised recommendations.',
        'results.noMatches': 'No matching jobs found.',
        'results.noMatchesProfile': 'No job matches found for this candidate.',
        
        // Profile Page
        'profile.title': 'Your Profile',
        'profile.subtitle': 'View your profile and personalised job matches.',
        'profile.completionCode': 'Completion Code',
        'profile.accessCode': 'Access Code',
        'profile.completionCodePlaceholder': 'e.g., A1B2C',
        'profile.accessCodePlaceholder': 'Enter access code',
        'profile.viewProfile': 'View Profile',
        'profile.jobMatches': 'Job Matches',
        'profile.foundMatches': 'Found {count} matching job(s)',
        
        // Job Details
        'job.whyMatches': 'Why this matches:',
        'job.responsibilities': 'Job Responsibilities',
        'job.requirements': 'Job Requirements',
        
        // Footer
        'footer.address': '18/F Park Avenue Tower, 5 Moreton Terrace, Causeway Bay, Hong Kong',
        'footer.copyright': '© 2026 ASK IT Limited | EA License No.: 76414',
        
        // Error Messages
        'error.requiredFields': 'Please fill in all required fields.',
        'error.invalidFormat': 'Invalid Completion Code format. Please enter a 5-character code with uppercase letters and numbers.',
        'error.incorrectCodes': 'Incorrect Codes. Please check and try again.',
        'error.noSurveyData': 'No survey data found for this Completion Code.',
        'error.loadError': 'Error loading data. Please check and try again.',
        'error.noJobs': 'No jobs found. Please try adjusting your search criteria.',
        'error.submitError': 'Error submitting your job search. Please try again.',
        'error.networkError': 'Network error. Please check your connection and try again.',
        'error.jobFunctionLimit': 'Select at most 3 job categories.',
        'error.rateLimit': 'Please retry after {seconds} seconds.',
        
        // Language Switcher
        'lang.en': 'EN',
        'lang.zh': '中文'
    },
    zh: {
        // Logo
        'logo.text': '搵工啦',
        'logo.version': 'v4.0',
        
        // Header & Navigation
        'nav.yourProfile': '您的配對結果',
        'nav.findJobs': '尋找工作機會',
        'nav.ourServices': '我們的服務',
        'nav.contactUs': '聯絡我們',
        
        // Main Page
        'hero.title': '想搵一份合適嘅工作？',
        'hero.subtitle': '回答以下幾個簡單嘅問題，我哋會為你配對合適嘅工作機會。',
        'step.quickSurvey': '填寫問卷',
        'step.reviewAnswers': '確認回答',
        'step.reviewMatches': '查看結果',
        
        // Form Labels
        'form.information': '個人資料',
        'form.preferences': '職位偏好',
        'form.name': '姓名',
        'form.email': '電郵地址',
        'form.age': '年齡',
        'form.phone': '聯絡電話',
        'form.education': '學歷',
        'form.availability': '可到職時間',
        'form.district': '居住地區',
        'form.experience': '工作經驗',
        'form.background': '個人背景',
        'form.jobFunctions': '職能類別',
        'form.expectedSalary': '期望薪金',
        
        // Form Placeholders & Options
        'form.backgroundPlaceholder': '請簡要描述您的職業目標、個人特質、技能專長、工作經驗或其他相關資訊...',
        'form.backgroundHelper1': '請協助我們了解您的背景，以便為您配對更合適的職位。例如，您可以提及：',
        'form.backgroundHelper2': '1. 您的工作領域和專業範疇',
        'form.backgroundHelper3': '2. 您的職業目標和發展方向',
        'form.backgroundHelper4': '3. 以三個形容詞描述您的個人特質',
        'form.backgroundHelper5': '4. 您的三大核心技能和優勢',
        'form.districtHelper': '請選擇您的居住地區，以便為您配對更合適的職位。',
        'form.experienceHelper': '請選擇您的工作經驗年資。',
        'form.jobFunctionHelper': '請選擇最多 3 個職能類別。',
        'form.salaryHelper': '請選擇您的每月稅前薪金期望。',
        
        // Dropdown Options - Age
        'option.age.default': '選擇年齡組別',
        'option.age.18-24': '18 - 24',
        'option.age.25-34': '25 - 34',
        'option.age.35-44': '35 - 44',
        'option.age.45-54': '45 - 54',
        'option.age.55-64': '55 - 64',
        'option.age.65+': '65+',
        
        // Dropdown Options - Education
        'option.education.default': '選擇學歷',
        'option.education.highSchool': '中學',
        'option.education.diploma': '文憑',
        'option.education.associateDegree': '副學士學位',
        'option.education.bachelorsDegree': '學士學位',
        'option.education.mastersDegree': '碩士學位',
        'option.education.phd': '博士學位',
        
        // Dropdown Options - Availability
        'option.availability.default': '選擇可到職時間',
        'option.availability.immediate': '可即時到職',
        'option.availability.1week': '1 週通知期',
        'option.availability.1month': '1 個月通知期',
        'option.availability.moreThan1Month': '超過 1 個月通知期',
        
        // Dropdown Options - Districts
        'option.district.default': '選擇居住地區',
        'option.district.centralWestern': '中西區',
        'option.district.eastern': '東區',
        'option.district.southern': '南區',
        'option.district.wanChai': '灣仔',
        'option.district.kowloonCity': '九龍城',
        'option.district.yauTsimMong': '油尖旺',
        'option.district.shamShuiPo': '深水埗',
        'option.district.wongTaiSin': '黃大仙',
        'option.district.kwunTong': '觀塘',
        'option.district.taiPo': '大埔',
        'option.district.yuenLong': '元朗',
        'option.district.tuenMun': '屯門',
        'option.district.north': '北區',
        'option.district.saiKung': '西貢',
        'option.district.shaTin': '沙田',
        'option.district.tsuenWan': '荃灣',
        'option.district.kwaiTsing': '葵青',
        'option.district.islands': '離島',
        'option.district.anyLocation': '任何工作地點均可',
        
        // Dropdown Options - Experience
        'option.experience.default': '選擇工作經驗',
        'option.experience.none': '無相關工作經驗',
        'option.experience.1-2years': '1 - 2 年',
        'option.experience.3-4years': '3 - 4 年',
        'option.experience.5-8years': '5 - 8 年',
        'option.experience.9-10years': '9 - 10 年',
        'option.experience.over10years': '超過 10 年',
        
        // Dropdown Options - Job Functions
        'option.jobFunction.default': '請選擇職能類別',
        'option.jobFunction.administration': '行政 (Admin)',
        'option.jobFunction.accounting': '會計 (Accounting)',
        'option.jobFunction.marketing': '市場推廣 (Marketing)',
        'option.jobFunction.humanResources': '人力資源 (HR)',
        'option.jobFunction.hospitality': '餐飲服務 (F&B)',
        'option.jobFunction.customerService': '客戶服務 (CS)',
        'option.jobFunction.sales': '銷售 / 業務發展 (Sales / BD)',
        'option.jobFunction.technicalTrades': '技術行業',
        'option.jobFunction.businessAnalysis': '業務分析 (BA)',
        'option.jobFunction.dataAnalytics': '數據分析 (DA)',
        'option.jobFunction.cybersecurity': '網絡安全',
        'option.jobFunction.itSupport': 'IT 技術支援',
        'option.jobFunction.softwareEngineering': '軟件工程',
        'option.jobFunction.systemsEngineering': '系統工程',
        'option.jobFunction.networkEngineering': '網絡工程',
        'option.jobFunction.technologyManagement': '技術管理',
        'option.jobFunction.productManagement': '產品管理',
        'option.jobFunction.projectManagement': '項目管理 (PM)',
        
        // Dropdown Options - Salary
        'option.salary.default': '選擇薪金範圍',
        'option.salary.below20k': '低於HK$20,000',
        'option.salary.20k-30k': 'HK$20,001 - HK$30,000',
        'option.salary.30k-50k': 'HK$30,001 - HK$50,000',
        'option.salary.50k-80k': 'HK$50,001 - HK$80,000',
        'option.salary.80k-100k': 'HK$80,001 - HK$100,000',
        'option.salary.above100k': '高於HK$100,000',
        
        // Form Actions
        'form.clearSession': '清除資料',
        'form.next': '下一步',
        'form.back': '返回',
        'form.newSearch': '重新搜尋',
        
        // Review Page
        'review.title': '您的回答',
        'review.category.information': '個人資料',
        'review.category.preferences': '職位偏好',
        'review.consent': '點擊下一步即表示您同意 ASK IT 使用您的資料進行職位配對。如不同意，請勿繼續。',
        
        // Loading
        'loading.finding': '正在為您配對合適的職位...',
        'loading.loading': '正在載入用戶資料...',
        'loading.waitTime': '此過程可能需要長達 30 秒',
        'loading.noRefresh': '請勿重新整理此頁面',
        
        // Results
        'results.title': '您的配對結果',
        'results.subtitle': '我們為您找到 {count} 個工作機會',
        'results.completionCode': '完成代碼',
        'results.completionCodeInstruction': '請於招聘會攤位向我們的工作人員出示此代碼，以獲取您的職位配對詳細資訊及個人化建議。',
        'results.noMatches': '未能找到合適的工作機會。',
        'results.noMatchesProfile': '未能找到此用戶的配對結果。',
        
        // Profile Page
        'profile.title': '您的配對結果',
        'profile.subtitle': '查看您的用戶資料及個人化職位配對結果。',
        'profile.completionCode': '完成代碼',
        'profile.accessCode': '存取代碼',
        'profile.completionCodePlaceholder': '例如：A1B2C',
        'profile.accessCodePlaceholder': '請輸入存取代碼',
        'profile.viewProfile': '查看配對結果',
        'profile.jobMatches': '職位配對',
        'profile.foundMatches': '找到 {count} 個配對職位',
        
        // Job Details
        'job.whyMatches': '配對原因：',
        'job.responsibilities': '工作職責',
        'job.requirements': '職位要求',
        
        // Footer
        'footer.address': '香港銅鑼灣摩頓台 5 號百富中心 18 樓',
        'footer.copyright': '© 2026 ASK IT Limited | 職業介紹所牌照號碼：76414',
        
        // Error Messages
        'error.requiredFields': '請填寫所有必填欄位。',
        'error.invalidFormat': '完成代碼格式無效。請輸入5個字符的代碼，包含大寫字母及數字。',
        'error.incorrectCodes': '代碼錯誤。請檢查後重新嘗試。',
        'error.noSurveyData': '未能找到此完成代碼的問卷資料。',
        'error.loadError': '載入資料時發生錯誤。請檢查後重新嘗試。',
        'error.noJobs': '未能找到合適的職位。請嘗試調整您的搜尋條件。',
        'error.submitError': '提交職位搜尋時發生錯誤。請重新嘗試。',
        'error.networkError': '網絡連接錯誤。請檢查您的網絡連接後重新嘗試。',
        'error.jobFunctionLimit': '請選擇最多 3 個職能類別。',
        'error.rateLimit': '請稍候 {seconds} 秒後再試。',
        
        // Language Switcher
        'lang.en': 'EN',
        'lang.zh': '中文'
    }
};

// Current language (default: English)
let currentLang = localStorage.getItem('preferredLanguage') || 'en';

// Apply early language hint and preload class to prevent flash
document.documentElement.lang = currentLang;

// Get translation for a key
function t(key, params = {}) {
    const translation = TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
    
    // Replace placeholders like {count}
    return translation.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
    });
}

// Set language and update UI
function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) {
        console.warn(`Language "${lang}" not supported, falling back to English`);
        lang = 'en'; // Fallback to English
    }
    
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Translate all elements with data-i18n attribute
    translatePage();
    
    // Update language switcher active state
    updateLanguageSwitcher();

    // Reveal page after translation completes (always remove preload class)
    document.documentElement.classList.remove('i18n-preload');
}

// Translate the entire page
function translatePage() {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        element.textContent = translation;
    });
    
    // Translate option elements with data-i18n-option attribute
    document.querySelectorAll('option[data-i18n-option]').forEach(option => {
        const key = option.getAttribute('data-i18n-option');
        const translation = t(key);
        if (translation && translation !== key) {
            option.textContent = translation;
        }
    });
    
    // Translate attributes like placeholder, title, aria-label
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // Translate dynamic content (call this from your JS files)
    translateDynamicContent();
}

// Translate dynamic content (called after page updates)
function translateDynamicContent() {
    // Can be extended to translate dynamically added content
}

// Initialize language switcher
function initLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    if (!switcher) return;
    
    const buttons = switcher.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
    
    updateLanguageSwitcher();
}

// Update language switcher active state
function updateLanguageSwitcher() {
    const switcher = document.getElementById('language-switcher');
    if (!switcher) return;
    
    const buttons = switcher.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
        const lang = button.getAttribute('data-lang');
        if (lang === currentLang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Initialize i18n on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    initLanguageSwitcher();
});

// Export for use in other scripts
window.i18n = {
    t,
    setLanguage,
    translatePage,
    currentLang: () => currentLang
};
