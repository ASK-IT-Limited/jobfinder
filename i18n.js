// Internationalization (i18n) support
// Simple translation system with minimal code changes

const TRANSLATIONS = {
    en: {
        // Logo
        'logo.text': 'Job Compass',
        'logo.version': 'v3.5',
        
        // Header & Navigation
        'nav.yourProfile': 'Your Profile',
        'nav.findJobs': 'Find Jobs',
        'nav.home': 'Home',
        'nav.ourServices': 'Our Services',
        'nav.contactUs': 'Contact Us',
        
        // Main Page
        'hero.title': 'Find Your Perfect Job',
        'hero.subtitle': 'Answer a few quick questions and we will match you with tailored job opportunities.',
        'step.quickSurvey': 'Quick Survey',
        'step.reviewAnswers': 'Review Answers',
        'step.reviewMatches': 'Review Matches',
        
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
        'review.title': 'Your Answers',
        'review.category.information': 'Information',
        'review.category.preferences': 'Preferences',
        
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
        'error.invalidFormat': 'Invalid Completion Code format. Please enter a 5-character code with uppercase letters, numbers, and special characters (@, #, $, %).',
        'error.incorrectCodes': 'Incorrect Codes. Please check and try again.',
        'error.noSurveyData': 'No survey data found for this Completion Code.',
        'error.loadError': 'Error loading data. Please check and try again.',
        'error.noJobs': 'No jobs found. Please try adjusting your search criteria.',
        'error.submitError': 'Error submitting your job search. Please try again.',
        'error.networkError': 'Network error. Please check your connection and try again.',
        'error.jobFunctionLimit': 'Select at most 3 job categories.',
        'error.rateLimit': 'Please wait {seconds} seconds before trying again.',
        
        // Language Switcher
        'lang.en': 'English',
        'lang.zh': '中文'
    },
    zh: {
        // Logo
        'logo.text': '工作指南針',
        'logo.version': 'v3.5',
        
        // Header & Navigation
        'nav.yourProfile': '您的個人資料',
        'nav.findJobs': '尋找工作',
        'nav.home': '首頁',
        'nav.ourServices': '我們的服務',
        'nav.contactUs': '聯絡我們',
        
        // Main Page
        'hero.title': '尋找您理想的工作',
        'hero.subtitle': '回答幾個簡單問題，我們將為您匹配合適的工作機會。',
        'step.quickSurvey': '快速問卷',
        'step.reviewAnswers': '檢視答案',
        'step.reviewMatches': '檢視匹配',
        
        // Form Labels
        'form.information': '個人資料',
        'form.preferences': '偏好設定',
        'form.name': '姓名',
        'form.email': '電郵',
        'form.age': '年齡',
        'form.phone': '電話',
        'form.education': '學歷',
        'form.availability': '可到職時間',
        'form.district': '地區',
        'form.experience': '工作經驗',
        'form.background': '背景',
        'form.jobFunctions': '職能',
        'form.expectedSalary': '期望薪金',
        
        // Form Placeholders & Options
        'form.backgroundPlaceholder': '簡要描述您的目標、個性、技能、經驗或任何關於您自己的資訊...',
        'form.backgroundHelper1': '幫助我們了解您的背景以找到更好的匹配。例如，您可以提及：',
        'form.backgroundHelper2': '1. 您的工作領域和專業',
        'form.backgroundHelper3': '2. 您的職業目標和抱負',
        'form.backgroundHelper4': '3. 用3個形容詞描述您的個性',
        'form.backgroundHelper5': '4. 您的3大技能和優勢',
        'form.districtHelper': '選擇您居住的地區以獲得更好的匹配。',
        'form.experienceHelper': '選擇您的工作經驗年數。',
        'form.jobFunctionHelper': '最多選擇3個職能類別。',
        'form.salaryHelper': '選擇每月稅前薪金期望。',
        
        // Dropdown Options - Age
        'option.age.default': '選擇年齡範圍',
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
        'option.availability.immediate': '即時',
        'option.availability.1week': '1週通知',
        'option.availability.1month': '1個月通知',
        'option.availability.moreThan1Month': '超過1個月通知',
        
        // Dropdown Options - Districts
        'option.district.default': '選擇地區',
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
        
        // Dropdown Options - Experience
        'option.experience.default': '選擇工作經驗',
        'option.experience.none': '無經驗',
        'option.experience.1-2years': '1 - 2年',
        'option.experience.3-4years': '3 - 4年',
        'option.experience.5-8years': '5 - 8年',
        'option.experience.9-10years': '9 - 10年',
        'option.experience.over10years': '超過10年',
        
        // Dropdown Options - Job Functions
        'option.jobFunction.default': '選擇職能',
        'option.jobFunction.administration': '行政',
        'option.jobFunction.accounting': '會計',
        'option.jobFunction.marketing': '市場推廣',
        'option.jobFunction.humanResources': '人力資源',
        'option.jobFunction.hospitality': '餐飲服務',
        'option.jobFunction.customerService': '客戶服務',
        'option.jobFunction.sales': '銷售 / 業務發展',
        'option.jobFunction.technicalTrades': '技術行業',
        'option.jobFunction.businessAnalysis': '業務分析',
        'option.jobFunction.dataAnalytics': '數據分析',
        'option.jobFunction.cybersecurity': '網絡安全',
        'option.jobFunction.itSupport': 'IT技術支援',
        'option.jobFunction.softwareEngineering': '軟件工程',
        'option.jobFunction.systemsEngineering': '系統工程',
        'option.jobFunction.networkEngineering': '網絡工程',
        'option.jobFunction.technologyManagement': '技術管理',
        'option.jobFunction.productManagement': '產品管理',
        'option.jobFunction.projectManagement': '項目管理',
        
        // Dropdown Options - Salary
        'option.salary.default': '選擇薪金範圍',
        'option.salary.below20k': '低於HK$20,000',
        'option.salary.20k-30k': 'HK$20,001 - HK$30,000',
        'option.salary.30k-50k': 'HK$30,001 - HK$50,000',
        'option.salary.50k-80k': 'HK$50,001 - HK$80,000',
        'option.salary.80k-100k': 'HK$80,001 - HK$100,000',
        'option.salary.above100k': '高於HK$100,000',
        
        // Form Actions
        'form.clearSession': '清除會話',
        'form.next': '下一步',
        'form.back': '返回',
        'form.newSearch': '新搜尋',
        
        // Review Page
        'review.title': '您的答案',
        'review.category.information': '個人資料',
        'review.category.preferences': '偏好設定',
        
        // Loading
        'loading.finding': '正在為您尋找合適的職位...',
        'loading.loading': '正在載入候選人資料...',
        'loading.waitTime': '這可能需要長達30秒',
        'loading.noRefresh': '請勿刷新此頁面',
        
        // Results
        'results.title': '您的工作匹配',
        'results.subtitle': '我們為您找到了 {count} 個匹配機會',
        'results.completionCode': '完成代碼',
        'results.completionCodeInstruction': '請在招聘會攤位向我們的工作人員出示此代碼，以獲取您的工作匹配詳細資訊和個人化建議。',
        'results.noMatches': '未找到匹配的工作。',
        'results.noMatchesProfile': '未找到此候選人的工作匹配。',
        
        // Profile Page
        'profile.title': '您的個人資料',
        'profile.subtitle': '查看您的個人資料和個人化工作匹配。',
        'profile.completionCode': '完成代碼',
        'profile.accessCode': '訪問代碼',
        'profile.viewProfile': '查看個人資料',
        'profile.jobMatches': '工作匹配',
        'profile.foundMatches': '找到 {count} 個匹配工作',
        
        // Job Details
        'job.whyMatches': '匹配原因：',
        'job.responsibilities': '工作職責',
        'job.requirements': '工作要求',
        
        // Footer
        'footer.address': '香港銅鑼灣摩頓台5號百富中心18樓',
        'footer.copyright': '© 2026 ASK IT Limited | 職業介紹所牌照號碼：76414',
        
        // Error Messages
        'error.requiredFields': '請填寫所有必填欄位。',
        'error.invalidFormat': '完成代碼格式無效。請輸入5個字符的代碼，包含大寫字母、數字和特殊字符（@、#、$、%）。',
        'error.incorrectCodes': '代碼錯誤。請檢查後重試。',
        'error.noSurveyData': '未找到此完成代碼的問卷資料。',
        'error.loadError': '載入資料時出錯。請檢查後重試。',
        'error.noJobs': '未找到工作。請嘗試調整您的搜尋條件。',
        'error.submitError': '提交工作搜尋時出錯。請重試。',
        'error.networkError': '網絡錯誤。請檢查您的連接後重試。',
        'error.jobFunctionLimit': '最多選擇3個職能類別。',
        'error.rateLimit': '請等待 {seconds} 秒後再試。',
        
        // Language Switcher
        'lang.en': 'English',
        'lang.zh': '中文'
    }
};

// Current language (default: English)
let currentLang = localStorage.getItem('preferredLanguage') || 'en';

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
        console.warn(`Language "${lang}" not supported`);
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Translate all elements with data-i18n attribute
    translatePage();
    
    // Update language switcher active state
    updateLanguageSwitcher();
}

// Translate the entire page
function translatePage() {
    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        // Handle different element types
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.type === 'text' || element.type === 'email' || element.type === 'password' || element.tagName === 'TEXTAREA') {
                // Only update placeholder, not value
                if (element.hasAttribute('data-i18n-placeholder')) {
                    element.placeholder = translation;
                }
            }
        } else {
            element.textContent = translation;
        }
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
    
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
    
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        element.setAttribute('aria-label', t(key));
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
