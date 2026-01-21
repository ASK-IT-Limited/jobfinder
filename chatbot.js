// Create floating chat button
(function() {
    'use strict';
    
    // Constants
    const CHATBOT_URL = 'chatbot.html';
    const BUTTON_CLASS = 'chat-button';
    const STYLE_ID = 'chatbot-button-styles';
    
    // Check if styles already exist to avoid duplicates
    if (document.getElementById(STYLE_ID)) {
        return;
    }
    
    // Chat button SVG icon
    const chatIconSVG = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="currentColor"/>
            <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="currentColor"/>
        </svg>
    `;
    
    // Create chat button element
    const chatButton = document.createElement('a');
    chatButton.href = CHATBOT_URL;
    chatButton.className = BUTTON_CLASS;
    chatButton.setAttribute('aria-label', 'Open AI Chatbot');
    chatButton.innerHTML = `
        ${chatIconSVG}
        <span class="chat-button-text">Chloe (AI)</span>
    `;
    
    // Chat button styles
    const buttonStyles = `
        .chat-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #1E3A5F;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.4);
            z-index: 1000;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .chat-button:hover {
            background-color: #152A44;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(30, 58, 95, 0.5);
        }
        
        .chat-button:active {
            transform: translateY(0);
        }
        
        .chat-button svg {
            width: 24px;
            height: 24px;
        }
        
        .chat-button-text {
            display: none;
        }
        
        @media (min-width: 768px) {
            .chat-button {
                width: auto;
                height: auto;
                padding: 12px 20px;
                border-radius: 30px;
                gap: 8px;
            }
            
            .chat-button-text {
                display: inline;
                font-size: 14px;
                font-weight: 600;
            }
        }
        
        @media (max-width: 767px) {
            .chat-button {
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
            }
        }
    `;
    
    // Create and append styles
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = buttonStyles;
    document.head.appendChild(style);
    
    // Append button to document
    document.body.appendChild(chatButton);
})();
