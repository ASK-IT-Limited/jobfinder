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

// Escape HTML but allow <br> tags to be rendered
function escapeHtmlAllowBreaks(text) {
    if (!text) return '';
    
    // Placeholders for preserving HTML tags
    const brPlaceholder = '___BR_TAG_PLACEHOLDER___';
    const labelPlaceholders = {
        jobId: '___LABEL_JOB_ID___',
        jobTitle: '___LABEL_JOB_TITLE___',
        salaryRange: '___LABEL_SALARY_RANGE___',
        location: '___LABEL_LOCATION___',
        responsibilities: '___LABEL_RESPONSIBILITIES___',
        requirements: '___LABEL_REQUIREMENTS___'
    };
    
    // Replace <br> tags with placeholder
    let processed = text.replace(/<br\s*\/?>/gi, brPlaceholder);
    
    // Replace field labels with placeholders before escaping
    processed = processed.replace(/Job ID:\s*/gi, labelPlaceholders.jobId);
    processed = processed.replace(/Job Title:\s*/gi, labelPlaceholders.jobTitle);
    processed = processed.replace(/Salary Range:\s*/gi, labelPlaceholders.salaryRange);
    processed = processed.replace(/Location:\s*/gi, labelPlaceholders.location);
    processed = processed.replace(/Job Responsibilities:\s*/gi, labelPlaceholders.responsibilities);
    processed = processed.replace(/Job Requirements:\s*/gi, labelPlaceholders.requirements);
    
    // Escape all HTML
    const div = document.createElement('div');
    div.textContent = processed;
    let escaped = div.innerHTML;
    
    // Replace label placeholders back with formatted HTML
    escaped = escaped.replace(new RegExp(labelPlaceholders.jobId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<strong>Job ID: </strong>');
    escaped = escaped.replace(new RegExp(labelPlaceholders.jobTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<strong>Job Title: </strong>');
    escaped = escaped.replace(new RegExp(labelPlaceholders.salaryRange.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<strong>Salary Range: </strong>');
    escaped = escaped.replace(new RegExp(labelPlaceholders.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<strong>Location: </strong>');
    escaped = escaped.replace(new RegExp(labelPlaceholders.responsibilities.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<br><strong>Job Responsibilities: </strong><br>');
    escaped = escaped.replace(new RegExp(labelPlaceholders.requirements.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<br><strong>Job Requirements: </strong><br>');
    
    // Replace <br> placeholder back with actual <br> tags
    escaped = escaped.replace(new RegExp(brPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<br>');
    
    return escaped;
}

// Parse job description and split at Location, making everything after expandable
function formatJobDescriptionWithExpandable(text) {
    if (!text) return '';
    
    // First, escape the HTML and format it
    let formatted = escapeHtmlAllowBreaks(text);
    
    // Find the Location marker
    const locationMarker = '<strong>Location: </strong>';
    const locationIndex = formatted.indexOf(locationMarker);
    
    // If Location marker not found, return the formatted text as is (no expandable)
    if (locationIndex === -1) {
        return {
            visible: formatted,
            expandable: '',
            hasExpandable: false
        };
    }
    
    // Find where Location section ends
    // Location value starts after the marker
    let locationValueStart = locationIndex + locationMarker.length;
    
    // Check for next section markers (Job Responsibilities or Job Requirements)
    const responsibilitiesMarker = '<strong>Job Responsibilities: </strong>';
    const requirementsMarker = '<strong>Job Requirements: </strong>';
    
    const respIndex = formatted.indexOf(responsibilitiesMarker, locationValueStart);
    const reqIndex = formatted.indexOf(requirementsMarker, locationValueStart);
    
    // Find the earliest section marker or line break
    let splitPoint = formatted.length;
    let foundSectionMarker = false;
    
    // Check for section markers first
    if (respIndex !== -1) {
        splitPoint = respIndex;
        foundSectionMarker = true;
    }
    if (reqIndex !== -1 && reqIndex < splitPoint) {
        splitPoint = reqIndex;
        foundSectionMarker = true;
    }
    
    // If no section marker found, look for the next <br> tag after Location value
    if (!foundSectionMarker) {
        const brFormats = [
            { pattern: '<br>', length: 4 },
            { pattern: '<br/>', length: 5 },
            { pattern: '<br />', length: 6 }
        ];
        
        for (const brFormat of brFormats) {
            const brIndex = formatted.indexOf(brFormat.pattern, locationValueStart);
            if (brIndex !== -1 && brIndex < splitPoint) {
                splitPoint = brIndex + brFormat.length;
            }
        }
    }
    
    // Extract visible part (up to and including Location line)
    const visiblePart = formatted.substring(0, splitPoint);
    
    // Extract hidden part (everything after Location line)
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

// Parse job description and create collapsible sections for responsibilities and requirements
function formatJobDescriptionWithCollapsible(text) {
    if (!text) return '';
    
    // First, escape the HTML and format it
    let formatted = text;
    
    // Find positions of responsibilities and requirements sections
    // The escapeHtmlAllowBreaks function formats these as: <br><strong>Job Responsibilities: </strong><br>
    const responsibilitiesMarker = '<strong>Job Responsibilities: </strong>';
    const requirementsMarker = '<strong>Job Requirements: </strong>';
    
    const respIndex = formatted.indexOf(responsibilitiesMarker);
    const reqIndex = formatted.indexOf(requirementsMarker);
    
    // If neither section exists, return the formatted text as is
    if (respIndex === -1 && reqIndex === -1) {
        return formatted;
    }
    
    let result = '';
    let lastIndex = 0;
    
    // Process responsibilities section
    if (respIndex !== -1) {
        // Add content before responsibilities
        if (respIndex > lastIndex) {
            result += formatted.substring(lastIndex, respIndex);
        }
        
        // Find where responsibilities section ends (either at requirements or end of text)
        let respEnd = formatted.length;
        if (reqIndex !== -1 && reqIndex > respIndex) {
            respEnd = reqIndex;
        }
        
        // Extract responsibilities content (skip the marker)
        const respStart = respIndex + responsibilitiesMarker.length;
        const responsibilitiesContent = formatted.substring(respStart, respEnd).trim();
        
        // Remove leading <br> tags from content
        const cleanRespContent = responsibilitiesContent.replace(/^(<br\s*\/?>)+/i, '');
        
        // Create collapsible responsibilities section
        result += `
            <div class="job-section-collapsible">
                <button class="job-section-toggle" type="button" aria-expanded="false">
                    <strong>Job Responsibilities</strong>
                    <span class="toggle-icon">▼</span>
                </button>
                <div class="job-section-content" style="display: none;">
                    ${cleanRespContent}
                </div>
            </div>
        `;
        
        lastIndex = respEnd;
    }
    
    // Process requirements section
    if (reqIndex !== -1) {
        // Add content between responsibilities and requirements (if any)
        if (reqIndex > lastIndex) {
            result += formatted.substring(lastIndex, reqIndex);
        }
        
        // Extract requirements content (skip the marker)
        const reqStart = reqIndex + requirementsMarker.length;
        const reqEnd = formatted.length;
        const requirementsContent = formatted.substring(reqStart, reqEnd).trim();
        
        // Remove leading <br> tags from content
        const cleanReqContent = requirementsContent.replace(/^(<br\s*\/?>)+/i, '');
        
        // Create collapsible requirements section
        result += `
            <div class="job-section-collapsible">
                <button class="job-section-toggle" type="button" aria-expanded="false">
                    <strong>Job Requirements</strong>
                    <span class="toggle-icon">▼</span>
                </button>
                <div class="job-section-content" style="display: none;">
                    ${cleanReqContent}
                </div>
            </div>
        `;
        
        lastIndex = reqEnd;
    }
    
    // Add any remaining content after requirements
    if (lastIndex < formatted.length) {
        result += formatted.substring(lastIndex);
    }
    
    return result;
}

// Initialize collapsible sections after they're added to the DOM
function initializeCollapsibleSections(container) {
    if (!container) return;
    
    const toggleButtons = container.querySelectorAll('.job-section-toggle');
    toggleButtons.forEach(button => {
        // Remove existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (content && content.classList.contains('job-section-content')) {
                if (isExpanded) {
                    content.style.display = 'none';
                    this.setAttribute('aria-expanded', 'false');
                    if (icon) icon.textContent = '▼';
                } else {
                    content.style.display = 'block';
                    this.setAttribute('aria-expanded', 'true');
                    if (icon) icon.textContent = '▲';
                }
            }
        });
    });
}

// Initialize expandable job description sections
function initializeExpandableJobDescription(container) {
    if (!container) return;
    
    const expandButtons = container.querySelectorAll('.job-expand-toggle');
    expandButtons.forEach(button => {
        // Remove existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function() {
            // Find the expandable content (it's in a sibling element)
            const expandableSection = container.querySelector('.job-description-expandable');
            const content = expandableSection ? expandableSection.querySelector('.job-expand-content') : null;
            const icon = this.querySelector('.toggle-icon');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (content) {
                if (isExpanded) {
                    content.style.display = 'none';
                    this.setAttribute('aria-expanded', 'false');
                    if (icon) icon.textContent = '▼';
                } else {
                    content.style.display = 'block';
                    this.setAttribute('aria-expanded', 'true');
                    if (icon) icon.textContent = '▲';
                }
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
        
        const scoreBadge = jobScore ? `<div class="job-score">Score: ${jobScore}/10</div>` : '';
        
        // Format job description
        const jobDescFormatted = formatJobDescriptionWithExpandable(jobDesc);
        let jobDescriptionHtml = '';
        
        if (jobDescFormatted && typeof jobDescFormatted === 'object' && jobDescFormatted.hasExpandable) {
            // Has expandable content
            const reasonHtml = jobReason ? `<div class="job-reason">
                <strong>Why this matches:</strong>
                <p>${escapeHtmlAllowBreaks(jobReason) || 'No reason available'}</p>
            </div>` : '';
            
            jobDescriptionHtml = `
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
                    <span class="toggle-icon">▼</span>
                </button>
            `;
        } else {
            // No expandable content - show everything
            const reasonHtml = jobReason ? `<div class="job-reason">
                <strong>Why this matches:</strong>
                <p>${escapeHtmlAllowBreaks(jobReason) || 'No reason available'}</p>
            </div>` : '';
            
            jobDescriptionHtml = `
                <div class="job-description-full">
                    ${jobDescFormatted || 'No description available'}
                    ${reasonHtml}
                </div>
            `;
        }
        
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