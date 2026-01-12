// Shared utility functions

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
