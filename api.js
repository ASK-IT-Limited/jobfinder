// API Utility Module - Centralized API request handling with headers

// Secret header configuration
const API_HEADERS_CONFIG = {
    'X-JobCompass-Secret': 'x9F2kL0a9s8D',
    'Content-Type': 'application/json'
};

/**
 * Get all API headers including the secret header
 * @returns {Object} Headers object for API requests
 */
function getApiHeaders() {
    return { ...API_HEADERS_CONFIG };
}

/**
 * Make an API request with all required headers
 * @param {string} url - The API endpoint URL
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise} Fetch response promise
 */
async function apiRequest(url, options = {}) {
    const mergedHeaders = {
        ...getApiHeaders(),
        ...options.headers
    };

    return fetch(url, {
        ...options,
        headers: mergedHeaders
    });
}

/**
 * Make a POST request with JSON body
 * @param {string} url - The API endpoint URL
 * @param {Object} body - Request body object
 * @param {Object} additionalHeaders - Additional headers (optional)
 * @returns {Promise} Fetch response promise
 */
async function apiPostRequest(url, body, additionalHeaders = {}) {
    return apiRequest(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: additionalHeaders
    });
}
