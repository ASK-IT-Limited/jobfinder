// Shared utility functions

// Format value for display (handles arrays, empty values, etc.)
function formatValue(value) {
    if (!value || value === '') return '—';
    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : '—';
    }
    return value;
}

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinkElements = navLinks.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            if (link.tagName === 'A') {
                link.addEventListener('click', () => {
                    hamburgerBtn.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            }
        });
    }
});

// Constants for HTML escaping
const BR_PLACEHOLDER = '___BR_TAG_PLACEHOLDER___';
const LABEL_PLACEHOLDERS = {
    jobId: '___LABEL_JOB_ID___',
    jobTitle: '___LABEL_JOB_TITLE___',
    salaryRange: '___LABEL_SALARY_RANGE___',
    location: '___LABEL_LOCATION___',
    responsibilities: '___LABEL_RESPONSIBILITIES___',
    requirements: '___LABEL_REQUIREMENTS___'
};

const LABEL_REPLACEMENTS = {
    jobId: '<strong>Job ID: </strong>',
    jobTitle: '<strong>Job Title: </strong>',
    salaryRange: '<strong>Salary Range: </strong>',
    location: '<strong>Location: </strong>',
    responsibilities: '<br><strong>Job Responsibilities: </strong><br>',
    requirements: '<br><strong>Job Requirements: </strong><br>'
};

const LABEL_PATTERNS = {
    jobId: /Job ID:\s*/gi,
    jobTitle: /Job Title:\s*/gi,
    salaryRange: /Salary Range:\s*/gi,
    location: /Location:\s*/gi,
    responsibilities: /Job Responsibilities:\s*/gi,
    requirements: /Job Requirements:\s*/gi
};

// Helper function to escape regex special characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Escape HTML but allow <br> tags to be rendered
function escapeHtmlAllowBreaks(text) {
    if (!text) return '';
    
    // Replace <br> tags with placeholder
    let processed = text.replace(/<br\s*\/?>/gi, BR_PLACEHOLDER);
    
    // Replace field labels with placeholders before escaping
    Object.keys(LABEL_PATTERNS).forEach(key => {
        processed = processed.replace(LABEL_PATTERNS[key], LABEL_PLACEHOLDERS[key]);
    });
    
    // Escape all HTML
    const div = document.createElement('div');
    div.textContent = processed;
    let escaped = div.innerHTML;
    
    // Replace label placeholders back with formatted HTML
    Object.keys(LABEL_REPLACEMENTS).forEach(key => {
        const regex = new RegExp(escapeRegex(LABEL_PLACEHOLDERS[key]), 'g');
        escaped = escaped.replace(regex, LABEL_REPLACEMENTS[key]);
    });
    
    // Replace <br> placeholder back with actual <br> tags
    escaped = escaped.replace(new RegExp(escapeRegex(BR_PLACEHOLDER), 'g'), '<br>');
    
    return escaped;
}

// Constants for job description markers
const LOCATION_MARKER = '<strong>Location: </strong>';
const RESPONSIBILITIES_MARKER = '<br><strong>Job Responsibilities: </strong>';
const REQUIREMENTS_MARKER = '<br><strong>Job Requirements: </strong>';

// Parse job description and split at Location, making everything after expandable
function formatJobDescriptionWithExpandable(text) {
    if (!text) return '';
    
    // First, escape the HTML and format it
    const formatted = escapeHtmlAllowBreaks(text);
    
    // Find the Location marker
    const locationIndex = formatted.indexOf(LOCATION_MARKER);
    
    // If Location marker not found, return the formatted text as is (no expandable)
    if (locationIndex === -1) {
        return {
            visible: formatted,
            expandable: '',
            hasExpandable: false
        };
    }
    
    // Find where Location section ends
    const locationValueStart = locationIndex + LOCATION_MARKER.length;
    const splitPoint = findSplitPoint(formatted, locationValueStart);
    
    // Extract visible and hidden parts
    const visiblePart = formatted.substring(0, splitPoint);
    const hiddenPart = formatted.substring(splitPoint);
    
    // If there's no hidden content, return the formatted text as is (no expandable)
    if (!hiddenPart || hiddenPart.trim() === '') {
        return {
            visible: formatted,
            expandable: '',
            hasExpandable: false
        };
    }
    
    // Process the hidden part to create collapsible sections for responsibilities and requirements
    const processedHiddenPart = formatJobDescriptionWithCollapsible(hiddenPart);
    
    // Create the expandable section - return object with visible, expandable content, and placeholder for reason
    return {
        visible: visiblePart,
        expandable: processedHiddenPart,
        hasExpandable: true
    };
}

// Helper function to find split point for expandable content
function findSplitPoint(formatted, startIndex) {
    const respIndex = formatted.indexOf(RESPONSIBILITIES_MARKER, startIndex);
    const reqIndex = formatted.indexOf(REQUIREMENTS_MARKER, startIndex);
    
    // Find the earliest section marker
    let splitPoint = formatted.length;
    
    if (respIndex !== -1 && reqIndex !== -1) {
        splitPoint = Math.min(respIndex, reqIndex);
    } else if (respIndex !== -1) {
        splitPoint = respIndex;
    } else if (reqIndex !== -1) {
        splitPoint = reqIndex;
    } else {
        // If no section marker found, look for the next <br> tag
        const brIndex = formatted.indexOf('<br>', startIndex);
        if (brIndex !== -1) {
            splitPoint = brIndex + 4;
        }
    }
    
    return splitPoint;
}

// Parse job description and create collapsible sections for responsibilities and requirements
function formatJobDescriptionWithCollapsible(text) {
    if (!text) return '';
    
    const formatted = text;
    const respIndex = formatted.indexOf(RESPONSIBILITIES_MARKER);
    const reqIndex = formatted.indexOf(REQUIREMENTS_MARKER);
    
    // If neither section exists, return the formatted text as is
    if (respIndex === -1 && reqIndex === -1) {
        return formatted;
    }
    
    let result = '';
    let lastIndex = 0;
    
    // Process responsibilities section
    if (respIndex !== -1) {
        if (respIndex > lastIndex) {
            result += formatted.substring(lastIndex, respIndex);
        }
        
        const respEnd = (reqIndex !== -1 && reqIndex > respIndex) ? reqIndex : formatted.length;
        const respStart = respIndex + RESPONSIBILITIES_MARKER.length;
        const responsibilitiesContent = formatted.substring(respStart, respEnd).trim();
        const cleanRespContent = responsibilitiesContent.replace(/^(<br\s*\/?>)+/i, '');
        
        result += createCollapsibleSection('Job Responsibilities', cleanRespContent);
        lastIndex = respEnd;
    }
    
    // Process requirements section
    if (reqIndex !== -1) {
        if (reqIndex > lastIndex) {
            result += formatted.substring(lastIndex, reqIndex);
        }
        
        const reqStart = reqIndex + REQUIREMENTS_MARKER.length;
        const requirementsContent = formatted.substring(reqStart).trim();
        const cleanReqContent = requirementsContent.replace(/^(<br\s*\/?>)+/i, '');
        
        result += createCollapsibleSection('Job Requirements', cleanReqContent);
        lastIndex = formatted.length;
    }
    
    // Add any remaining content after requirements
    if (lastIndex < formatted.length) {
        result += formatted.substring(lastIndex);
    }
    
    return result;
}

// Helper function to create collapsible section HTML
function createCollapsibleSection(title, content) {
    return `
        <div class="job-section-collapsible">
            <button class="job-section-toggle" type="button" aria-expanded="false">
                <strong>${title}</strong>
                <span class="toggle-icon">▼</span>
            </button>
            <div class="job-section-content" style="display: none;">
                ${content}
            </div>
        </div>
    `;
}

// Constants for toggle icons
const TOGGLE_ICON_COLLAPSED = '▼';
const TOGGLE_ICON_EXPANDED = '▲';

// Helper function to toggle collapsible content
function toggleCollapsibleContent(button, content, icon) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        content.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        if (icon) icon.textContent = TOGGLE_ICON_COLLAPSED;
    } else {
        content.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = TOGGLE_ICON_EXPANDED;
    }
}

// Helper function to initialize toggle buttons (removes existing listeners by cloning)
function initializeToggleButton(button, handler) {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    newButton.addEventListener('click', handler);
}

// Initialize collapsible sections after they're added to the DOM
function initializeCollapsibleSections(container) {
    if (!container) return;
    
    const toggleButtons = container.querySelectorAll('.job-section-toggle');
    toggleButtons.forEach(button => {
        initializeToggleButton(button, function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');
            
            if (content && content.classList.contains('job-section-content')) {
                toggleCollapsibleContent(this, content, icon);
            }
        });
    });
}

// Initialize expandable job description sections
function initializeExpandableJobDescription(container) {
    if (!container) return;
    
    const expandButtons = container.querySelectorAll('.job-expand-toggle');
    expandButtons.forEach(button => {
        initializeToggleButton(button, function() {
            const expandableSection = container.querySelector('.job-description-expandable');
            const content = expandableSection?.querySelector('.job-expand-content');
            const icon = this.querySelector('.toggle-icon');
            
            if (content) {
                toggleCollapsibleContent(this, content, icon);
            }
        });
    });
}

// Generic showView function - shared between profile.js and index.js
// views: object containing view elements
// viewName: name of the view to show
// onViewChange: optional callback function called after view is changed
function showViewGeneric(views, viewName, onViewChange) {
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
    
    // Call optional callback if provided
    if (onViewChange && typeof onViewChange === 'function') {
        onViewChange(viewName);
    }
}

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
function isValidEmail(email) {
    return EMAIL_REGEX.test(email);
}

// Format select value for display (gets option text from select element)
function formatSelectValue(value, selectId) {
    if (!value || value === '') return '—';
    
    // Handle backward compatibility with old array format
    const singleValue = Array.isArray(value) ? value[0] : value;
    if (!singleValue) return '—';
    
    const select = document.querySelector(`#${selectId}`);
    if (!select) return singleValue;
    
    const option = select.querySelector(`option[value="${singleValue}"]`);
    return option ? option.textContent : singleValue;
}

// Generic API response parser - handles different response structures
function parseApiResponse(data, options = {}) {
    const {
        dataPath = 'data',           // Path to data array (e.g., 'data', 'body.data')
        codePath = 'completionCode', // Path to completion code (e.g., 'completionCode', 'body.completionCode')
        bodyPath = 'body'            // Path to body object (e.g., 'body')
    } = options;
    
    // Parse body if it exists and is a string
    let parsedData = data;
    if (data[bodyPath]) {
        if (typeof data[bodyPath] === 'string') {
            try {
                parsedData = { ...data, [bodyPath]: JSON.parse(data[bodyPath]) };
            } catch (e) {
                console.error('Error parsing body string:', e);
                throw new Error('Invalid response format: body is not valid JSON');
            }
        }
    }
    
    // Extract data array
    let resultData = null;
    const dataPaths = Array.isArray(dataPath) ? dataPath : [dataPath];
    for (const path of dataPaths) {
        const value = getNestedValue(parsedData, path);
        if (Array.isArray(value)) {
            resultData = value;
            break;
        }
    }
    
    // Extract completion code
    let resultCode = null;
    const codePaths = Array.isArray(codePath) ? codePath : [codePath];
    for (const path of codePaths) {
        const value = getNestedValue(parsedData, path);
        if (value) {
            resultCode = value;
            break;
        }
    }
    
    return { data: resultData, completionCode: resultCode, parsedData };
}

// Helper function to get nested object values by dot notation path
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to create reason HTML
function createReasonHtml(jobReason) {
    if (!jobReason) return '';
    
    return `<div class="job-reason">
        <strong>Why this matches:</strong>
        <p>${escapeHtmlAllowBreaks(jobReason) || 'No reason available'}</p>
    </div>`;
}

// Helper function to create job description HTML
function createJobDescriptionHtml(jobDescFormatted, reasonHtml) {
    if (jobDescFormatted && typeof jobDescFormatted === 'object' && jobDescFormatted.hasExpandable) {
        // Has expandable content
        return `
            <div class="job-description-visible">
                ${jobDescFormatted.visible}
            </div>
            <div class="job-description-expandable">
                <div class="job-expand-content" style="display: none;">
                    ${jobDescFormatted.expandable}
                    ${reasonHtml}
                </div>
            </div>
            <button class="job-expand-toggle" type="button" aria-expanded="false" aria-label="Expand job details">
                <span class="toggle-icon">${TOGGLE_ICON_COLLAPSED}</span>
            </button>
        `;
    }
    
    // No expandable content - show everything
    return `
        <div class="job-description-full">
            ${jobDescFormatted || 'No description available'}
            ${reasonHtml}
        </div>
    `;
}

// Generic displayJobs function - shared between profile.js and index.js
// jobs: array of job objects
// options: configuration object with:
//   - listElementId: ID of the container element for job cards
//   - countElementId: optional ID of element to display job count
//   - completionCodeElementId: optional ID of element to display completion code
//   - completionCode: optional completion code value to display
//   - noResultsMessage: optional custom message when no jobs found
//   - propertyNames: object mapping property names (defaults to camelCase, can override for PascalCase)
function displayJobs(jobs, options) {
    const {
        listElementId,
        countElementId,
        completionCodeElementId,
        completionCode,
        noResultsMessage = 'No matching jobs found.',
        propertyNames = {
            score: 'score',
            jobTitle: 'jobTitle',
            jobID: 'jobID',
            jobDesc: 'jobDesc',
            reason: 'reason'
        }
    } = options;
    
    const jobsList = document.getElementById(listElementId);
    if (!jobsList) {
        console.error(`Element with ID "${listElementId}" not found`);
        return;
    }
    
    // Update count if element provided
    if (countElementId) {
        const countElement = document.getElementById(countElementId);
        if (countElement) {
            countElement.textContent = jobs.length;
        }
    }
    
    // Update completion code if element and value provided
    if (completionCodeElementId && completionCode) {
        const completionCodeElement = document.getElementById(completionCodeElementId);
        if (completionCodeElement) {
            completionCodeElement.textContent = completionCode;
        }
    }
    
    jobsList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsList.innerHTML = `<p class="no-results">${noResultsMessage}</p>`;
        return;
    }
    
    // Sort by score (highest first)
    // Handle both camelCase and PascalCase property names
    const scoreProp = propertyNames.score;
    const sortedJobs = [...jobs].sort((a, b) => {
        const scoreA = a[scoreProp] || a.Score || a.score || 0;
        const scoreB = b[scoreProp] || b.Score || b.score || 0;
        return scoreB - scoreA;
    });
    
    sortedJobs.forEach((job) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        
        // Handle both camelCase and PascalCase property names
        const jobScore = job[propertyNames.score] || job.Score || job.score || 0;
        const jobTitle = job[propertyNames.jobTitle] || job.JobTitle || job.jobTitle || null;
        const jobID = job[propertyNames.jobID] || job.JobID || job.jobID || null;
        const jobDesc = job[propertyNames.jobDesc] || job.JobDesc || job.jobDesc || null;
        const jobReason = job[propertyNames.reason] || job.Reason || job.reason || null;
        
        // const scoreBadge = jobScore ? `<div class="job-score">Score: ${jobScore}/10</div>` : '';
        const scoreBadge = '';

        // Format job description
        const jobDescFormatted = formatJobDescriptionWithExpandable(jobDesc);
        const reasonHtml = createReasonHtml(jobReason);
        const jobDescriptionHtml = createJobDescriptionHtml(jobDescFormatted, reasonHtml);
        
        jobCard.innerHTML = `
            <div class="job-card-header">
                <div class="job-card-title">
                    <h3 class="job-title">${jobTitle || (jobID ? `#${jobID}` : 'N/A')}</h3>
                    ${scoreBadge}
                </div>
            </div>
            <div class="job-card-body">
                <div class="job-description">${jobDescriptionHtml}</div>
            </div>
        `;
        
        jobsList.appendChild(jobCard);
        
        // Initialize expandable job description
        initializeExpandableJobDescription(jobCard);
        
        // Initialize collapsible sections for this job card (for responsibilities and requirements)
        initializeCollapsibleSections(jobCard);
    });
}