// Configuration
const API_URL = 'https://default53918e53d56f4a4dba205adc87bbc2.3f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a253fc5340ef46d0b59a23a1b63cf471/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HhMIpVO3FAEDS_UVqomxpWWUBLe-qTel2Yh7wgLI-eY';

// Constants
const STORAGE_KEY = 'staffPortalCredentials';
const COMPLETION_CODE_LENGTH = 5;
const COMPLETION_CODE_PATTERN = /^[A-Z0-9@#$%]{5}$/;
const ALLOWED_CHARS = /[A-Z0-9@#$%]/g;
const ERROR_MESSAGES = {
    REQUIRED_FIELDS: 'Please fill in all required fields.',
    INVALID_FORMAT: 'Invalid Completion Code format. Please enter a 5-character code with uppercase letters, numbers, and special characters (@, #, $, %).',
    INCORRECT_CODES: 'Incorrect Codes. Please check and try again.',
    NO_SURVEY_DATA: 'No survey data found for this Completion Code.',
    LOAD_ERROR: 'Error loading data. Please check and try again.'
};

// State
let views = {};
let currentCompletionCode = '';

// Cache DOM elements to avoid repeated queries
let completionCodeInput = null;
let accessCodeInput = null;
let errorDiv = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    views = {
        login: document.getElementById('login-view'),
        loading: document.getElementById('loading-view'),
        results: document.getElementById('results-view')
    };
    
    // Cache frequently accessed DOM elements
    completionCodeInput = document.getElementById('completion-code');
    accessCodeInput = document.getElementById('access-code');
    errorDiv = document.getElementById('login-error');
    
    initializeEventListeners();
    loadSavedCredentials();
});

// Save credentials to localStorage
function saveCredentials(completionCode, accessCode) {
    const credentials = {
        completionCode,
        accessCode
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

// Load saved credentials from localStorage
function loadSavedCredentials() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    try {
        const credentials = JSON.parse(saved);
        
        if (credentials.completionCode && completionCodeInput) {
            completionCodeInput.value = credentials.completionCode;
        }
        
        if (credentials.accessCode && accessCodeInput) {
            accessCodeInput.value = credentials.accessCode;
        }
    } catch (e) {
        console.error('Error loading saved credentials:', e);
    }
}

// Event Listeners
function initializeEventListeners() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
    
    // Auto-uppercase and filter completion code input as user types
    if (completionCodeInput) {
        completionCodeInput.addEventListener('input', (e) => {
            // Only allow uppercase letters, numbers, and special characters @, #, $, %
            const filteredValue = e.target.value.toUpperCase().match(ALLOWED_CHARS);
            e.target.value = filteredValue ? filteredValue.join('') : '';
            // Clear error state when user types
            e.target.classList.remove('required-error');
        });
    }
    
    if (accessCodeInput) {
        accessCodeInput.addEventListener('input', (e) => {
            // Clear error state when user types
            e.target.classList.remove('required-error');
        });
    }
    
    document.getElementById('back-to-login').addEventListener('click', () => {
        showView('login');
        // Reload saved credentials instead of clearing
        loadSavedCredentials();
    });
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    if (!completionCodeInput || !accessCodeInput || !errorDiv) {
        console.error('Required DOM elements not found');
        return;
    }
    
    const completionCode = completionCodeInput.value.trim().toUpperCase();
    const accessCode = accessCodeInput.value;
    
    // Save credentials to localStorage immediately when button is clicked
    saveCredentials(completionCode, accessCode);
    
    // Clear previous errors
    clearErrors();
    
    // Validate required fields
    if (!validateRequiredFields(completionCode, accessCode)) {
        return;
    }
    
    // Validate completion code format
    if (!validateCompletionCodeFormat(completionCode)) {
        return;
    }
    
    currentCompletionCode = completionCode;
    
    showView('loading');
    
    // Fetch candidate data
    try {
        await fetchCandidateData(completionCode);
    } catch (error) {
        console.error('Error fetching candidate data:', error);
        showView('login');
        
        // Handle specific error types
        handleLoginError(error);
    }
}

// Fetch candidate data by completion code
async function fetchCandidateData(completionCode) {
    const accessCode = accessCodeInput ? accessCodeInput.value : '';
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            completionCode,
            accessCode
        })
    });
    
    // Check for HTTP errors
    if (response.status === 500) {
        throw new Error('INCORRECT_CODES');
    }
    
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Parse response body
    const body = parseResponseBody(data);
    
    // Extract survey and matches arrays
    const surveyArray = body.survey || [];
    const matchesArray = body.matches || [];
    
    if (surveyArray.length === 0) {
        throw new Error('NO_SURVEY_DATA');
    }
    
    const surveyData = surveyArray[0];
    const jobMatches = matchesArray;
    
    // Display the data
    displayCandidateData(surveyData, jobMatches);
    showView('results');
}

// Display candidate data
function displayCandidateData(surveyData, jobMatches) {
    // Display completion code
    document.getElementById('display-code').textContent = currentCompletionCode;
    
    // Display survey answers from the first item in the response array
    document.getElementById('info-name').textContent = formatValue(surveyData.Name);
    document.getElementById('info-email').textContent = formatValue(surveyData.Email);
    document.getElementById('info-age-range').textContent = formatValue(surveyData.AgeRange);
    document.getElementById('info-education').textContent = formatValue(surveyData.Education);
    document.getElementById('info-phone').textContent = formatValue(surveyData.Phone);
    document.getElementById('info-availability').textContent = formatValue(surveyData.Availability);
    document.getElementById('info-living-district').textContent = formatValue(surveyData.LivingDistrict);
    document.getElementById('info-remarks').textContent = formatValue(surveyData.Remarks || surveyData.Skills);
    document.getElementById('info-job-function').textContent = formatValue(surveyData.JobFunction);
    document.getElementById('info-experience-level').textContent = formatValue(surveyData.ExperienceLevel);
    document.getElementById('info-salary-range').textContent = formatValue(surveyData.SalaryRange);
    
    // Display job matches (remaining items from the response array)
    const jobs = jobMatches || [];
    document.getElementById('results-count').textContent = jobs.length;
    
    displayJobMatches(jobs);
}

// Display job matches
function displayJobMatches(jobs) {
    displayJobs(jobs, {
        listElementId: 'jobs-list',
        noResultsMessage: 'No job matches found for this candidate.',
        propertyNames: {
            score: 'Score',
            jobTitle: 'JobTitle',
            jobID: 'JobID',
            jobDesc: 'JobDesc',
            reason: 'Reason'
        }
    });
}

// Helper Functions

// Clear all error states
function clearErrors() {
    if (!errorDiv) return;
    
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    completionCodeInput?.classList.remove('required-error');
    accessCodeInput?.classList.remove('required-error');
}

// Validate required fields
function validateRequiredFields(completionCode, accessCode) {
    let hasError = false;
    
    if (!completionCode || completionCode.length === 0) {
        completionCodeInput?.classList.add('required-error');
        hasError = true;
    }
    
    if (!accessCode || accessCode.length === 0) {
        accessCodeInput?.classList.add('required-error');
        hasError = true;
    }
    
    if (hasError) {
        showError(ERROR_MESSAGES.REQUIRED_FIELDS);
        // Focus on first error field
        (completionCode ? accessCodeInput : completionCodeInput)?.focus();
        return false;
    }
    
    return true;
}

// Validate completion code format
function validateCompletionCodeFormat(completionCode) {
    if (completionCode.length !== COMPLETION_CODE_LENGTH || !COMPLETION_CODE_PATTERN.test(completionCode)) {
        completionCodeInput?.classList.add('required-error');
        showError(ERROR_MESSAGES.INVALID_FORMAT);
        completionCodeInput?.focus();
        return false;
    }
    return true;
}

// Handle login errors
function handleLoginError(error) {
    if (!errorDiv) return;
    
    if (error.message === 'INCORRECT_CODES') {
        showError(ERROR_MESSAGES.INCORRECT_CODES);
        completionCodeInput?.classList.add('required-error');
        accessCodeInput?.classList.add('required-error');
        accessCodeInput?.focus();
    } else if (error.message === 'NO_SURVEY_DATA') {
        showError(ERROR_MESSAGES.NO_SURVEY_DATA);
        completionCodeInput?.classList.add('required-error');
        completionCodeInput?.focus();
    } else {
        showError(ERROR_MESSAGES.LOAD_ERROR);
    }
}

// Show error message
function showError(message) {
    if (!errorDiv) return;
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Parse API response body
function parseResponseBody(data) {
    if (data.body) {
        // If body is a string, parse it
        if (typeof data.body === 'string') {
            try {
                return JSON.parse(data.body);
            } catch (e) {
                console.error('Error parsing body string:', e);
                throw new Error('Invalid response format: body is not valid JSON');
            }
        }
        // Body is already an object
        return data.body;
    }
    
    if (data.survey || data.matches) {
        // Response might be directly the body object
        return data;
    }
    
    console.error('Unexpected response structure:', data);
    throw new Error('Unexpected response format: missing body or survey/matches');
}

// Show specific view (using shared function from script.js)
function showView(viewName) {
    showViewGeneric(views, viewName);
}
