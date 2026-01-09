// Configuration
const API_URL = 'https://default53918e53d56f4a4dba205adc87bbc2.3f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a253fc5340ef46d0b59a23a1b63cf471/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HhMIpVO3FAEDS_UVqomxpWWUBLe-qTel2Yh7wgLI-eY';

// State
let views = {};
let currentKioskCode = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    views = {
        login: document.getElementById('login-view'),
        loading: document.getElementById('loading-view'),
        results: document.getElementById('results-view')
    };
    
    initializeEventListeners();
    loadSavedCredentials();
});

// Save credentials to localStorage
function saveCredentials(kioskCode, accessCode) {
    const credentials = {
        kioskCode: kioskCode,
        accessCode: accessCode
    };
    localStorage.setItem('staffPortalCredentials', JSON.stringify(credentials));
}

// Load saved credentials from localStorage
function loadSavedCredentials() {
    const saved = localStorage.getItem('staffPortalCredentials');
    if (saved) {
        try {
            const credentials = JSON.parse(saved);
            const kioskCodeInput = document.getElementById('kiosk-code');
            const accessCodeInput = document.getElementById('access-code');
            
            if (credentials.kioskCode && kioskCodeInput) {
                kioskCodeInput.value = credentials.kioskCode;
            }
            
            if (credentials.accessCode && accessCodeInput) {
                accessCodeInput.value = credentials.accessCode;
            }
        } catch (e) {
            console.error('Error loading saved credentials:', e);
        }
    }
}

// Event Listeners
function initializeEventListeners() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
    
    // Auto-uppercase and filter kiosk code input as user types
    const kioskCodeInput = document.getElementById('kiosk-code');
    const accessCodeInput = document.getElementById('access-code');
    
    kioskCodeInput.addEventListener('input', (e) => {
        // Only allow uppercase letters, numbers, and special characters @, #, $, %
        const allowedChars = /[A-Z0-9@#$%]/g;
        let filteredValue = e.target.value.toUpperCase().match(allowedChars);
        e.target.value = filteredValue ? filteredValue.join('') : '';
        // Clear error state when user types
        e.target.classList.remove('required-error');
    });
    
    accessCodeInput.addEventListener('input', (e) => {
        // Clear error state when user types
        e.target.classList.remove('required-error');
    });
    
    document.getElementById('back-to-login').addEventListener('click', () => {
        showView('login');
        // Reload saved credentials instead of clearing
        loadSavedCredentials();
    });
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const kioskCodeInput = document.getElementById('kiosk-code');
    const accessCodeInput = document.getElementById('access-code');
    const kioskCode = kioskCodeInput.value.trim().toUpperCase();
    const accessCode = accessCodeInput.value;
    const errorDiv = document.getElementById('login-error');
    
    // Save credentials to localStorage immediately when button is clicked
    saveCredentials(kioskCode, accessCode);
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    kioskCodeInput.classList.remove('required-error');
    accessCodeInput.classList.remove('required-error');
    
    // Validate required fields
    let hasError = false;
    
    if (!kioskCode || kioskCode.length === 0) {
        kioskCodeInput.classList.add('required-error');
        hasError = true;
    }
    
    if (!accessCode || accessCode.length === 0) {
        accessCodeInput.classList.add('required-error');
        hasError = true;
    }
    
    if (hasError) {
        errorDiv.textContent = 'Please fill in all required fields.';
        errorDiv.style.display = 'block';
        // Focus on first error field
        if (!kioskCode || kioskCode.length === 0) {
            kioskCodeInput.focus();
        } else {
            accessCodeInput.focus();
        }
        return;
    }
    
    // Validate kiosk code format (should be 7 characters with uppercase letters, numbers, and special characters)
    const kioskCodePattern = /^[A-Z0-9@#$%]{7}$/;
    if (kioskCode.length !== 7 || !kioskCodePattern.test(kioskCode)) {
        kioskCodeInput.classList.add('required-error');
        errorDiv.textContent = 'Invalid Kiosk Code format. Please enter a 7-character code with uppercase letters, numbers, and special characters (@, #, $, %).';
        errorDiv.style.display = 'block';
        kioskCodeInput.focus();
        return;
    }
    
    currentKioskCode = kioskCode;
    
    showView('loading');
    
    // Fetch candidate data
    try {
        await fetchCandidateData(kioskCode);
    } catch (error) {
        console.error('Error fetching candidate data:', error);
        showView('login');
        
        const kioskCodeInput = document.getElementById('kiosk-code');
        const accessCodeInput = document.getElementById('access-code');
        
        // Check for incorrect codes error
        if (error.message === 'INCORRECT_CODES') {
            errorDiv.textContent = 'Incorrect Codes. Please check and try again.';
            // Highlight kiosk code and access code inputs
            kioskCodeInput.classList.add('required-error');
            accessCodeInput.classList.add('required-error');
            accessCodeInput.focus();
        } else if (error.message === 'NO_SURVEY_DATA') {
            errorDiv.textContent = 'No survey data found for this Kiosk Code.';
            // Highlight kiosk code input
            kioskCodeInput.classList.add('required-error');
            kioskCodeInput.focus();
        } else {
            errorDiv.textContent = 'Error loading data. Please check and try again.';
        }
        errorDiv.style.display = 'block';
    }
}

// Fetch candidate data by kiosk code
async function fetchCandidateData(kioskCode) {
    const accessCode = document.getElementById('access-code').value;
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kioskCode: kioskCode,
            accessCode: accessCode
        })
    });
    
    const data = await response.json();
    
    // Log the response for debugging
    console.log('API Response:', data);
    
    // Check for status code 5001 (incorrect access code)
    if (response.status === 500) {
        throw new Error('INCORRECT_CODES');
    }
    
    // Check if response status is 200
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle different response formats
    let body = null;
    
    if (data.body) {
        // If body is a string, parse it
        if (typeof data.body === 'string') {
            try {
                body = JSON.parse(data.body);
            } catch (e) {
                console.error('Error parsing body string:', e);
                throw new Error('Invalid response format: body is not valid JSON');
            }
        } else {
            // Body is already an object
            body = data.body;
        }
    } else if (data.survey || data.matches) {
        // Response might be directly the body object
        body = data;
    } else {
        console.error('Unexpected response structure:', data);
        throw new Error('Unexpected response format: missing body or survey/matches');
    }
    
    // Extract survey and matches arrays
    const surveyArray = body.survey || [];
    const matchesArray = body.matches || [];
    
    if (surveyArray.length === 0) {
        throw new Error('NO_SURVEY_DATA');
    }
    
    const surveyData = surveyArray[0]; // First item in survey array
    const jobMatches = matchesArray; // All items in matches array
    
    // Display the data
    displayCandidateData(surveyData, jobMatches);
    showView('results');
}

// Display candidate data
function displayCandidateData(surveyData, jobMatches) {
    // Display kiosk code
    document.getElementById('display-kiosk-code').textContent = currentKioskCode;
    
    // Format value helper
    const formatValue = (value) => {
        if (!value || value === '') return '—';
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(', ') : '—';
        }
        return value;
    };
    
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
    const jobsList = document.getElementById('jobs-list');
    jobsList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<p class="no-results">No job matches found for this candidate.</p>';
        return;
    }
    
    // Sort by score (highest first)
    const sortedJobs = [...jobs].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    sortedJobs.forEach((job) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        const scoreBadge = job.Score ? `<div class="job-score">Score: ${job.Score || 0}/10</div>` : '';
        
        jobCard.innerHTML = `
            <div class="job-card-header">
                <div class="job-card-title">
                    <h3 class="job-title">${job.JobTitle || `#${job.JobID}` || 'N/A'}</h3>
                    ${scoreBadge}
                </div>
            </div>
            <div class="job-card-body">
                <p class="job-description">${escapeHtmlAllowBreaks(job.JobDesc) || 'No description available'}</p>
                ${job.Reason ? `<div class="job-reason">
                    <strong>Why this matches:</strong>
                    <p>${escapeHtmlAllowBreaks(job.Reason) || 'No reason available'}</p>
                </div>` : ''}
            </div>
        `;
        
        jobsList.appendChild(jobCard);
    });
}

// Show specific view
function showView(viewName) {
    if (!views[viewName]) {
        console.error('View not found:', viewName);
        return;
    }
    
    Object.keys(views).forEach(key => {
        if (views[key]) {
            views[key].classList.remove('active');
        }
    });
    views[viewName].classList.add('active');
    
    // Scroll to top when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
