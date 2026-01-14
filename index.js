// Configuration
const API_URL = 'https://default53918e53d56f4a4dba205adc87bbc2.3f.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2f27dec901814802b7ab56f193b31790/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=n3JBo3Jl9GCO4p3jhknnqM721MTm8DGhMxCqEzRfDo0';

// State management
let formData = {
    experienceLevel: '',
    salaryRange: '',
    jobFunction: [],
    remarks: '',
    name: '',
    email: '',
    ageRange: '',
    education: '',
    phone: '',
    availability: '',
    livingDistrict: ''
};

// View management
let views = {};
let jobResults = [];
let completionCode = '';

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

    // Clear form buttons - consolidate handlers
    const clearSessionButtons = [
        'clear-form',
        'clear-session-review',
        'clear-session-loading',
        'clear-session-results'
    ];
    
    clearSessionButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                clearForm();
                // Show form view for session clear buttons (not the main clear-form button)
                if (buttonId !== 'clear-form') {
                    showView('form');
                }
            });
        }
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
    
    // Helper function to validate email and update error state
    const validateEmailInput = (input) => {
        if (input.type === 'email' && input.value.trim()) {
            const isValid = isValidEmail(input.value.trim());
            input.classList.toggle('required-error', !isValid);
        } else {
            // Remove error state when user starts typing/selecting
            input.classList.remove('required-error');
        }
    };
    
    formInputs.forEach(input => {
        input.addEventListener('change', () => {
            saveFormData();
            validateEmailInput(input);
        });
        input.addEventListener('input', () => {
            saveFormData();
            validateEmailInput(input);
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
                
                // Special validation for job function: max 3 items
                if (field.id === 'job-function' && selectedNonEmpty.length > 3) {
                    isInvalidFormat = true; // Mark as invalid to prevent class removal
                    isValid = false;
                    // Show error message
                    const helperText = field.parentElement.querySelector('.form-helper');
                    if (helperText) {
                        helperText.textContent = 'Please select at most 3 job functions.';
                        helperText.style.color = 'var(--error-red)';
                    }
                }
            } else {
                isEmpty = field.value === '' || field.value === null;
            }
        } else {
            isEmpty = field.value === '' || field.value === null;
        }
        
        if (isEmpty || isInvalidFormat) {
            field.classList.add('required-error');
            isValid = false;
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

// Generic helper function to collect select field values (handles both single and multi-select)
function collectSelectFieldValue(form, selector) {
    const selectElement = form.querySelector(selector);
    if (!selectElement) return '';
    
    if (selectElement.hasAttribute('multiple')) {
        // Handle multi-select: return array of selected values
        return Array.from(selectElement.selectedOptions).map(option => option.value);
    } else {
        // Handle single-select: return single value
        return selectElement.value.trim() || '';
    }
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('job-form');
    
    formData = {
        experienceLevel: form.querySelector('#experience-level').value,
        salaryRange: form.querySelector('#salary-range').value,
        jobFunction: collectSelectFieldValue(form, '#job-function'),
        remarks: form.querySelector('#remarks').value.trim(),
        name: form.querySelector('#name').value.trim(),
        email: form.querySelector('#email').value.trim(),
        ageRange: form.querySelector('#age-range').value,
        education: form.querySelector('#education').value,
        phone: form.querySelector('#phone').value.trim(),
        availability: form.querySelector('#availability').value,
        livingDistrict: form.querySelector('#living-district').value
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

// Generic helper function to populate select fields (handles both single and multi-select)
function populateSelectField(form, selector, fieldName) {
    const selectElement = form.querySelector(selector);
    if (!selectElement) return;
    
    const fieldValue = formData[fieldName];
    if (!fieldValue) return;
    
    if (selectElement.hasAttribute('multiple')) {
        // Handle multi-select: clear previous selections
        Array.from(selectElement.options).forEach(option => {
            option.selected = false;
        });
        // Set selected options
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            fieldValue.forEach(value => {
                const option = selectElement.querySelector(`option[value="${value}"]`);
                if (option) {
                    option.selected = true;
                }
            });
        }
    } else {
        // Handle single-select: backward compatibility for array values
        const singleValue = Array.isArray(fieldValue) ? fieldValue[0] : fieldValue;
        if (singleValue) {
            selectElement.value = singleValue;
        }
    }
    
    // Update color styling using existing function
    updateSelectColor(selectElement);
}

// Populate form with saved data
function populateForm() {
    const form = document.getElementById('job-form');
    
    // Handle multi-select fields generically
    populateSelectField(form, '#job-function', 'jobFunction');
    
    // Populate text/input fields
    const textFields = [
        { id: 'remarks', name: 'remarks' },
        { id: 'name', name: 'name' },
        { id: 'email', name: 'email' },
        { id: 'phone', name: 'phone' }
    ];
    
    textFields.forEach(({ id, name }) => {
        const element = form.querySelector(`#${id}`);
        if (element && formData[name]) {
            element.value = formData[name];
        }
    });
    
    // Populate single-select fields (populateSelectField handles color styling)
    const selectFields = [
        { selector: '#age-range', name: 'ageRange' },
        { selector: '#education', name: 'education' },
        { selector: '#experience-level', name: 'experienceLevel' },
        { selector: '#salary-range', name: 'salaryRange' },
        { selector: '#availability', name: 'availability' },
        { selector: '#living-district', name: 'livingDistrict' }
    ];
    
    selectFields.forEach(({ selector, name }) => {
        populateSelectField(form, selector, name);
    });
}

// Populate review page
function populateReviewPage() {
    const formatSelectValue = (value, selectId) => {
        if (!value || value === '') return '—';
        
        // Handle backward compatibility with old array format
        const singleValue = Array.isArray(value) ? value[0] : value;
        if (!singleValue) return '—';
        
        const select = document.querySelector(`#${selectId}`);
        if (!select) return singleValue;
        
        const option = select.querySelector(`option[value="${singleValue}"]`);
        return option ? option.textContent : singleValue;
    };

    document.getElementById('review-experience-level').textContent = formatSelectValue(formData.experienceLevel, 'experience-level');
    document.getElementById('review-salary-range').textContent = formatSelectValue(formData.salaryRange, 'salary-range');
    document.getElementById('review-job-function').textContent = formatValue(formData.jobFunction);
    document.getElementById('review-remarks').textContent = formatValue(formData.remarks);
    document.getElementById('review-name').textContent = formatValue(formData.name);
    document.getElementById('review-email').textContent = formatValue(formData.email);
    document.getElementById('review-age-range').textContent = formatSelectValue(formData.ageRange, 'age-range');
    document.getElementById('review-education').textContent = formatSelectValue(formData.education, 'education');
    document.getElementById('review-phone').textContent = formatValue(formData.phone);
    document.getElementById('review-availability').textContent = formatSelectValue(formData.availability, 'availability');
    document.getElementById('review-living-district').textContent = formatSelectValue(formData.livingDistrict, 'living-district');
}

// Show specific view (using shared function from script.js)
function showView(viewName) {
    showViewGeneric(views, viewName, (viewName) => {
        // Show "Clear Session & Start Over" link when leaving loading view
        const clearSessionLink = document.getElementById('clear-session-loading');
        if (clearSessionLink && viewName !== 'loading') {
            clearSessionLink.style.display = '';
        }

        switch (viewName) {
            case 'form':
                updateProgress(1);
                break;
            case 'review':
                updateProgress(2);
                break;
            case 'results':
            case 'loading':
                updateProgress(3);
                break;
            default:
                break;
        }
    });
}

// Show loading view
function showLoading() {
    showView('loading');
    // Hide "Clear Session & Start Over" link during loading
    const clearSessionLink = document.getElementById('clear-session-loading');
    if (clearSessionLink) {
        clearSessionLink.style.display = 'none';
    }
}

// Submit job search to API
async function submitJobSearch() {
    // Collect latest form data
    collectFormData();
    
    // Show loading view
    showLoading();
    
    // Prepare request body
    // Convert single values to arrays for API compatibility (API expects arrays)
    const getArrayValue = (value) => {
        if (Array.isArray(value)) {
            return value.length > 0 ? value : ['Any'];
        }
        return value ? [value] : ['Any'];
    };
    
    const requestBody = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        ageRange: formData.ageRange || '',
        education: formData.education || '',
        availability: formData.availability || '',
        livingDistrict: formData.livingDistrict || '',
        experienceLevel: formData.experienceLevel || '',
        remarks: formData.remarks || '',
        jobFunction: getArrayValue(formData.jobFunction),
        salaryRange: formData.salaryRange || ''
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Job search submitted successfully:', result);
            
            // Extract jobs from response - check multiple possible structures
            let jobs = [];
            if (result.data && Array.isArray(result.data)) {
                // Response has data at top level
                jobs = result.data;
            } else if (result.body && result.body.data && Array.isArray(result.body.data)) {
                // Response has data nested in body
                jobs = result.body.data;
            } else {
                console.error('Unexpected response format:', result);
                showView('form');
                alert('No jobs found. Please try adjusting your search criteria.');
                return;
            }
            
            // Extract completion code - check multiple possible structures
            if (result.completionCode) {
                // Completion code at top level
                completionCode = result.completionCode;
            } else if (result.body && result.body.completionCode) {
                // Completion code nested in body
                completionCode = result.body.completionCode;
            }
            
            // Always display results view, even if there are 0 matches
            jobResults = jobs;
            displayJobResults(jobs);
            showView('results');
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

// Display job results (using shared function from script.js)
function displayJobResults(jobs) {
    displayJobs(jobs, {
        listElementId: 'results-list',
        countElementId: 'results-count',
        completionCodeElementId: 'completion-code',
        completionCode: completionCode,
        noResultsMessage: 'No job matches found. Please try adjusting your search criteria.',
        propertyNames: {
            score: 'score',
            jobTitle: 'jobTitle',
            jobID: 'jobID',
            jobDesc: 'jobDesc',
            reason: 'reason'
        }
    });
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
        experienceLevel: '',
        salaryRange: '',
        jobFunction: [],
        remarks: '',
        name: '',
        email: '',
        ageRange: '',
        education: '',
        phone: '',
        availability: '',
        livingDistrict: ''
    };
    
    const form = document.getElementById('job-form');
    form.reset();
    
    // Reset select styling to placeholder using existing function
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
        updateSelectColor(select);
    });
    
    localStorage.removeItem('jobFinderFormData');
    updateProgress(1);
}

// Get field element by name
function getFieldElement(fieldName) {
    const fieldMap = {
        'experienceLevel': '#experience-level',
        'salaryRange': '#salary-range',
        'jobFunction': '#job-function',
        'remarks': '#remarks',
        'name': '#name',
        'email': '#email',
        'ageRange': '#age-range',
        'education': '#education',
        'phone': '#phone',
        'availability': '#availability',
        'livingDistrict': '#living-district'
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
