// Staff Portal - View candidate data by Kiosk Code

// Configuration
const RETRIEVE_API_URL = 'https://default53918e53d56f4a4dba205adc87bbc2.3f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/a253fc5340ef46d0b59a23a1b63cf471/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=HhMIpVO3FAEDS_UVqomxpWWUBLe-qTel2Yh7wgLI-eY';

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
});

// Event Listeners
function initializeEventListeners() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
    
    document.getElementById('back-to-login').addEventListener('click', () => {
        showView('login');
        // Clear form
        loginForm.reset();
        currentKioskCode = '';
    });
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const kioskCode = document.getElementById('kiosk-code').value.trim().toUpperCase();
    const passcode = document.getElementById('passcode').value;
    const errorDiv = document.getElementById('login-error');
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // Validate kiosk code format (should be 5 characters)
    if (kioskCode.length !== 5) {
        errorDiv.textContent = 'Invalid Kiosk Code format. Please enter a 5-character code.';
        errorDiv.style.display = 'block';
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
        errorDiv.textContent = 'Error loading data. Please check the Kiosk Code and try again.';
        errorDiv.style.display = 'block';
    }
}

// Fetch candidate data by kiosk code
async function fetchCandidateData(kioskCode) {
    const passcode = document.getElementById('passcode').value;
    
    const response = await fetch(RETRIEVE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kioskCode: kioskCode,
            passCode: passcode
        })
    });
    
    // Check if response status is 200
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Log the response for debugging
    console.log('API Response:', data);
    
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
        throw new Error('No survey data found for this Kiosk Code');
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
    document.getElementById('info-skills').textContent = formatValue(surveyData.Skills);
    document.getElementById('info-job-type').textContent = formatValue(surveyData.JobType);
    document.getElementById('info-work-arrangement').textContent = formatValue(surveyData.WorkArrangement);
    document.getElementById('info-job-function').textContent = formatValue(surveyData.JobFunction);
    document.getElementById('info-experience-level').textContent = formatValue(surveyData.ExperienceLevel);
    document.getElementById('info-salary-range').textContent = formatValue(surveyData.SalaryRange);
    document.getElementById('info-company-size').textContent = formatValue(surveyData.CompanySize);
    document.getElementById('info-location').textContent = formatValue(surveyData.WorkLocation);
    
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
        
        const scoreBadge = job.Score ? `<div class="job-score">Score: ${job.Score}/10</div>` : '';
        
        jobCard.innerHTML = `
            <div class="job-card-header">
                <div class="job-card-title">
                    <h3 class="job-title">${escapeHtml(job.JobTitle || `Job #${job.JobID || 'N/A'}`)}</h3>
                    ${scoreBadge}
                </div>
            </div>
            <div class="job-card-body">
                <p class="job-description">${escapeHtmlAllowBreaks(job.JobDesc || 'No description available')}</p>
                ${job.Reason ? `<div class="job-reason">
                    <strong>Why this matches:</strong>
                    <p>${escapeHtmlAllowBreaks(job.Reason)}</p>
                </div>` : ''}
            </div>
            <div class="job-card-footer">
                <a href="${job.jobUrl || '#'}" target="_blank" class="btn-primary btn-view-job">View Job Details</a>
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

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Escape HTML but allow <br> tags to be rendered
function escapeHtmlAllowBreaks(text) {
    if (!text) return '';
    // Use a placeholder for <br> tags to preserve them
    const placeholder = '___BR_TAG_PLACEHOLDER___';
    // Replace <br> and <br/> with placeholder
    let processed = text.replace(/<br\s*\/?>/gi, placeholder);
    // Escape all HTML
    const div = document.createElement('div');
    div.textContent = processed;
    let escaped = div.innerHTML;
    // Replace placeholder back with actual <br> tags
    escaped = escaped.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<br>');
    return escaped;
}
