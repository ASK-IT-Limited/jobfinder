// State management
let formData = {
    location: '',
    workArrangement: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: '',
    jobFunction: '',
    companySize: '',
    skills: '',
    name: '',
    email: '',
    ageRange: '',
    education: ''
};

// View management
let views = {};
let jobResults = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize views after DOM is loaded
    views = {
        form: document.getElementById('form-view'),
        review: document.getElementById('review-view'),
        loading: document.getElementById('loading-view'),
        results: document.getElementById('results-view')
    };
    
    initializeEventListeners();
    loadFormData();
    initializeSelects();
});

// Event Listeners
function initializeEventListeners() {
    // Form submission
    const form = document.getElementById('job-form');
    form.addEventListener('submit', handleFormSubmit);

    // Clear form buttons
    document.getElementById('clear-form').addEventListener('click', (e) => {
        e.preventDefault();
        clearForm();
    });

    document.getElementById('clear-session-review').addEventListener('click', (e) => {
        e.preventDefault();
        clearForm();
        showView('form');
    });

    document.getElementById('clear-session-loading').addEventListener('click', (e) => {
        e.preventDefault();
        clearForm();
        showView('form');
    });

    document.getElementById('clear-session-results').addEventListener('click', (e) => {
        e.preventDefault();
        clearForm();
        showView('form');
    });

    document.getElementById('back-to-form').addEventListener('click', () => {
        showView('form');
    });

    // Review page buttons
    document.getElementById('back-to-survey').addEventListener('click', () => {
        showView('form');
    });

    document.getElementById('edit-all').addEventListener('click', () => {
        showView('form');
    });

    document.getElementById('find-jobs').addEventListener('click', () => {
        submitJobSearch();
    });

    // Edit individual fields
    document.querySelectorAll('.btn-edit-small').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const field = e.target.closest('.btn-edit-small').dataset.field;
            showView('form');
            // Scroll to the field
            setTimeout(() => {
                const fieldElement = getFieldElement(field);
                if (fieldElement) {
                    fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    fieldElement.focus();
                }
            }, 100);
        });
    });

    // Save form data on input change
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            saveFormData();
            // Validate email format on change
            if (input.type === 'email' && input.value.trim()) {
                if (isValidEmail(input.value.trim())) {
                    input.classList.remove('required-error');
                } else {
                    input.classList.add('required-error');
                }
            } else {
                // Remove error state when user starts typing/selecting
                input.classList.remove('required-error');
            }
        });
        input.addEventListener('input', () => {
            saveFormData();
            // Validate email format on input (real-time validation)
            if (input.type === 'email' && input.value.trim()) {
                if (isValidEmail(input.value.trim())) {
                    input.classList.remove('required-error');
                } else {
                    input.classList.add('required-error');
                }
            } else {
                // Remove error state when user starts typing/selecting
                input.classList.remove('required-error');
            }
        });
    });

}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove previous error states
    clearValidationErrors();
    
    // Validate required fields
    if (!validateForm()) {
        // Scroll to first invalid field
        const firstInvalid = document.querySelector('.form-input.required-error, .form-select.required-error');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
        }
        return false;
    }
    
    collectFormData();
    populateReviewPage();
    showView('review');
    updateProgress(2);
    
    return false;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate form
function validateForm() {
    let isValid = true;
    const form = document.getElementById('job-form');
    
    // Get all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        let isEmpty = false;
        let isInvalidFormat = false;
        
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            // For text inputs, check if value is empty after trimming
            isEmpty = !field.value || field.value.trim() === '';
            
            // For email inputs, also validate format
            if (field.type === 'email' && !isEmpty) {
                isInvalidFormat = !isValidEmail(field.value.trim());
            }
        } else if (field.tagName === 'SELECT') {
            // For selects, check if value is empty
            if (field.hasAttribute('multiple')) {
                // For multiple selects, check if any non-empty options are selected
                // "No Preference" (empty value) alone doesn't count as a valid selection
                const selectedNonEmpty = Array.from(field.selectedOptions)
                    .filter(option => option.value !== '');
                isEmpty = selectedNonEmpty.length === 0;
            } else {
                isEmpty = field.value === '' || field.value === null;
            }
        } else {
            isEmpty = field.value === '' || field.value === null;
        }
        
        if (isEmpty || isInvalidFormat) {
            field.classList.add('required-error');
            isValid = false;
            console.log('Field is invalid:', field.id || field.name, isEmpty ? 'empty' : 'invalid format', field);
        } else {
            field.classList.remove('required-error');
        }
    });
    
    return isValid;
}

// Clear validation errors
function clearValidationErrors() {
    const form = document.getElementById('job-form');
    const errorFields = form.querySelectorAll('.required-error');
    errorFields.forEach(field => {
        field.classList.remove('required-error');
    });
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('job-form');
    
    // Helper function to get selected values from multiple select
    const getSelectedValues = (selectElement) => {
        if (selectElement.hasAttribute('multiple')) {
            // Filter out empty values (like "No Preference") and return array
            const values = Array.from(selectElement.selectedOptions)
                .map(option => option.value)
                .filter(val => val !== '');
            return values.length > 0 ? values : [];
        }
        return selectElement.value || '';
    };
    
    formData = {
        location: form.querySelector('#location').value.trim(),
        workArrangement: getSelectedValues(form.querySelector('#work-arrangement')),
        jobType: getSelectedValues(form.querySelector('#job-type')),
        experienceLevel: getSelectedValues(form.querySelector('#experience-level')),
        salaryRange: getSelectedValues(form.querySelector('#salary-range')),
        jobFunction: getSelectedValues(form.querySelector('#job-function')),
        companySize: getSelectedValues(form.querySelector('#company-size')),
        skills: form.querySelector('#skills').value.trim(),
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        ageRange: form.querySelector('#age-range').value,
        education: form.querySelector('#education').value
    };
}

// Save form data to localStorage
function saveFormData() {
    collectFormData();
    localStorage.setItem('jobFinderFormData', JSON.stringify(formData));
}

// Load form data from localStorage
function loadFormData() {
    const saved = localStorage.getItem('jobFinderFormData');
    if (saved) {
        try {
            formData = JSON.parse(saved);
            populateForm();
        } catch (e) {
            console.error('Error loading form data:', e);
        }
    }
}

// Populate form with saved data
function populateForm() {
    const form = document.getElementById('job-form');
    if (formData.location) form.querySelector('#location').value = formData.location;
    
    // Helper function to set multiple select values
    const setSelectValues = (selectElement, values) => {
        if (!values || (Array.isArray(values) && values.length === 0)) return;
        
        const valuesArray = Array.isArray(values) ? values : [values];
        Array.from(selectElement.options).forEach(option => {
            option.selected = valuesArray.includes(option.value);
        });
        selectElement.style.color = 'var(--gray-dark)';
    };
    
    setSelectValues(form.querySelector('#work-arrangement'), formData.workArrangement);
    setSelectValues(form.querySelector('#job-type'), formData.jobType);
    setSelectValues(form.querySelector('#experience-level'), formData.experienceLevel);
    setSelectValues(form.querySelector('#salary-range'), formData.salaryRange);
    setSelectValues(form.querySelector('#job-function'), formData.jobFunction);
    setSelectValues(form.querySelector('#company-size'), formData.companySize);
    
    if (formData.skills) form.querySelector('#skills').value = formData.skills;
    if (formData.name) form.querySelector('#name').value = formData.name;
    if (formData.email) form.querySelector('#email').value = formData.email;
    if (formData.ageRange) {
        form.querySelector('#age-range').value = formData.ageRange;
        form.querySelector('#age-range').style.color = 'var(--gray-dark)';
    }
    if (formData.education) {
        form.querySelector('#education').value = formData.education;
        form.querySelector('#education').style.color = 'var(--gray-dark)';
    }
}

// Populate review page
function populateReviewPage() {
    // Format values for display
    const formatValue = (value) => {
        if (!value || value === '') return '—';
        return value;
    };

    const formatSelectValue = (value, selectId) => {
        if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return '—';
        
        const select = document.querySelector(`#${selectId}`);
        if (!select) return Array.isArray(value) ? value.join(', ') : value;
        
        const valuesArray = Array.isArray(value) ? value : [value];
        const displayTexts = valuesArray.map(val => {
            const option = select.querySelector(`option[value="${val}"]`);
            return option ? option.textContent : val;
        });
        
        return displayTexts.join(', ');
    };

    document.getElementById('review-location').textContent = formatValue(formData.location);
    document.getElementById('review-work-arrangement').textContent = formatSelectValue(formData.workArrangement, 'work-arrangement');
    document.getElementById('review-job-type').textContent = formatSelectValue(formData.jobType, 'job-type');
    document.getElementById('review-experience-level').textContent = formatSelectValue(formData.experienceLevel, 'experience-level');
    document.getElementById('review-salary-range').textContent = formatSelectValue(formData.salaryRange, 'salary-range');
    document.getElementById('review-job-function').textContent = formatSelectValue(formData.jobFunction, 'job-function');
    document.getElementById('review-company-size').textContent = formatSelectValue(formData.companySize, 'company-size');
    document.getElementById('review-skills').textContent = formatValue(formData.skills);
    document.getElementById('review-name').textContent = formatValue(formData.name);
    document.getElementById('review-email').textContent = formatValue(formData.email);
    document.getElementById('review-age-range').textContent = formatSelectValue(formData.ageRange, 'age-range');
    document.getElementById('review-education').textContent = formatSelectValue(formData.education, 'education');
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
    
    if (viewName === 'form') {
        updateProgress(1);
    } else if (viewName === 'review') {
        updateProgress(2);
    }
}

// Show loading view
function showLoading() {
    showView('loading');
    updateProgress(2);
}

// Submit job search to API
async function submitJobSearch() {
    // Collect latest form data
    collectFormData();
    
    // Show loading view
    showLoading();
    
    // Prepare request body
    const requestBody = {
        name: formData.name || '',
        email: formData.email || '',
        ageRange: formData.ageRange || '',
        education: formData.education || '',
        skills: formData.skills || '',
        jobType: Array.isArray(formData.jobType) ? formData.jobType : (formData.jobType ? [formData.jobType] : []),
        workArrangement: Array.isArray(formData.workArrangement) ? formData.workArrangement : (formData.workArrangement ? [formData.workArrangement] : []),
        jobFunction: Array.isArray(formData.jobFunction) ? formData.jobFunction : (formData.jobFunction ? [formData.jobFunction] : []),
        experienceLevel: Array.isArray(formData.experienceLevel) ? formData.experienceLevel : (formData.experienceLevel ? [formData.experienceLevel] : []),
        salaryRange: Array.isArray(formData.salaryRange) ? formData.salaryRange : (formData.salaryRange ? [formData.salaryRange] : []),
        companySize: Array.isArray(formData.companySize) ? formData.companySize : (formData.companySize ? [formData.companySize] : []),
        location: formData.location || ''
    };
    
    const apiUrl = 'https://default53918e53d56f4a4dba205adc87bbc2.3f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2f27dec901814802b7ab56f193b31790/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=n3JBo3Jl9GCO4p3jhknnqM721MTm8DGhMxCqEzRfDo0';
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Job search submitted successfully:', result);
            
            // Extract jobs from response - handle both formats
            let jobs = [];
            if (Array.isArray(result)) {
                // Response is directly an array
                jobs = result;
            } else if (result.body && Array.isArray(result.body)) {
                // Response has a body property with array
                jobs = result.body;
            } else {
                console.error('Unexpected response format:', result);
                showView('form');
                alert('No jobs found. Please try adjusting your search criteria.');
                return;
            }
            
            if (jobs.length > 0) {
                jobResults = jobs;
                displayJobResults(jobResults);
                showView('results');
            } else {
                showView('form');
                alert('No jobs found. Please try adjusting your search criteria.');
            }
        } else {
            console.error('Error submitting job search:', response.status, response.statusText);
            showView('form');
            alert('Error submitting your job search. Please try again.');
        }
    } catch (error) {
        console.error('Network error submitting job search:', error);
        showView('form');
        alert('Network error. Please check your connection and try again.');
    }
}

// Display job results
function displayJobResults(jobs) {
    const resultsList = document.getElementById('results-list');
    const resultsCount = document.getElementById('results-count');
    
    resultsCount.textContent = jobs.length;
    resultsList.innerHTML = '';
    
    if (jobs.length === 0) {
        resultsList.innerHTML = '<p class="no-results">No matching jobs found. Please try adjusting your search criteria.</p>';
        return;
    }
    
    // Sort by score (highest first)
    const sortedJobs = [...jobs].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    sortedJobs.forEach((job, index) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        const scoreBadge = job.score ? `<div class="job-score">Match: ${job.score}/10</div>` : '';
        
        jobCard.innerHTML = `
            <div class="job-card-header">
                <div class="job-card-title">
                    <h3 class="job-title">Job #${job.jobID}</h3>
                    ${scoreBadge}
                </div>
            </div>
            <div class="job-card-body">
                <p class="job-description">${escapeHtml(job.jobDesc || 'No description available')}</p>
                ${job.reason ? `<div class="job-reason">
                    <strong>Why this matches:</strong>
                    <p>${escapeHtml(job.reason)}</p>
                </div>` : ''}
            </div>
            <div class="job-card-footer">
                <a href="${job.jobUrl || '#'}" target="_blank" class="btn-primary btn-view-job">View Job Details</a>
            </div>
        `;
        
        resultsList.appendChild(jobCard);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update progress indicator
function updateProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
}

// Clear form
function clearForm() {
    formData = {
        location: '',
        workArrangement: '',
        jobType: '',
        experienceLevel: '',
        salaryRange: '',
        jobFunction: '',
        companySize: '',
        skills: '',
        name: '',
        email: '',
        ageRange: '',
        education: ''
    };
    
    const form = document.getElementById('job-form');
    form.reset();
    
    // Reset select styling to placeholder
    const selects = form.querySelectorAll('.form-select');
    selects.forEach(select => {
        if (select.hasAttribute('multiple')) {
            // For multiple selects, deselect all
            Array.from(select.options).forEach(option => {
                option.selected = false;
            });
        } else {
            select.selectedIndex = 0;
        }
        // Set color based on whether it has a value
        if (select.value === '' || select.value === null) {
            select.style.color = 'var(--gray-medium)';
        } else {
            select.style.color = 'var(--gray-dark)';
        }
    });
    
    localStorage.removeItem('jobFinderFormData');
    updateProgress(1);
}

// Get field element by name
function getFieldElement(fieldName) {
    const fieldMap = {
        'location': '#location',
        'workArrangement': '#work-arrangement',
        'jobType': '#job-type',
        'experienceLevel': '#experience-level',
        'salaryRange': '#salary-range',
        'jobFunction': '#job-function',
        'companySize': '#company-size',
        'skills': '#skills',
        'name': '#name',
        'email': '#email',
        'ageRange': '#age-range',
        'education': '#education'
    };
    
    const selector = fieldMap[fieldName];
    if (selector) {
        return document.querySelector(selector);
    }
    return null;
}

// Initialize selects to handle placeholder behavior
function initializeSelects() {
    const selects = document.querySelectorAll('.form-select');
    selects.forEach(select => {
        // Set initial color based on whether a value is selected
        updateSelectColor(select);
        
        // Add change listener to update styling when a value is selected
        select.addEventListener('change', function() {
            updateSelectColor(this);
        });
    });
}

// Update select color based on whether it has a value
function updateSelectColor(select) {
    let hasValue = false;
    
    if (select.hasAttribute('multiple')) {
        hasValue = select.selectedOptions.length > 0 && 
                   !(select.selectedOptions.length === 1 && select.selectedOptions[0].value === '');
    } else {
        hasValue = select.value !== '' && select.value !== null;
    }
    
    if (!hasValue) {
        select.style.color = 'var(--gray-medium)';
        select.setCustomValidity(select.hasAttribute('required') ? 'Please select an option' : '');
    } else {
        select.style.color = 'var(--gray-dark)';
        select.setCustomValidity('');
    }
}

