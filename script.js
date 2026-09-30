'use strict';

(() => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const siteMenu = document.getElementById('site-menu');

    if (menuToggle && siteMenu) {
        const setMenu = (open) => {
            siteMenu.classList.toggle('is-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
        };
        menuToggle.addEventListener('click', () => {
            setMenu(!siteMenu.classList.contains('is-open'));
        });
        // Close the menu after tapping a link
        siteMenu.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                setMenu(false);
            }
        });
    }

    // Greeting banner at the top of the hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const greetingBanner = document.createElement('div');
        greetingBanner.classList.add('greeting-banner');
        greetingBanner.textContent =
            'Thank you for visiting the website. Feel free to reach out if you have any questions or opportunities!';
        heroSection.insertBefore(greetingBanner, heroSection.firstChild);
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('form-status');

    if (!contactForm || !statusMessage) {
        return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const SUCCESS_VISIBLE_MS = 3000; // thank-you message disappears after 3 seconds
    const ERROR_VISIBLE_MS = 6000;
    let hideTimer;

    // Show a message, then remove it automatically
    function showStatus(text, type, visibleMs) {
        clearTimeout(hideTimer);
        statusMessage.textContent = text; // plain text only, so nothing can inject HTML
        statusMessage.className = 'form-status ' + type;
        hideTimer = setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'form-status';
        }, visibleMs);
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // stop the page from reloading

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        // Spam trap: real visitors never see or tick this box
        if (formData.get('botcheck')) {
            return;
        }

        const accessKey = String(formData.get('access_key') || '');
        if (!accessKey || accessKey === 'YOUR_ACCESS_KEY') {
            showStatus(
                'The contact form is not set up yet. Please email me directly instead.',
                'error',
                ERROR_VISIBLE_MS
            );
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData
            });
            const result = await response.json().catch(() => ({}));

            if (response.ok && result.success) {
                contactForm.reset();
                showStatus(
                    'Thank you for your message! I will get back to you soon.',
                    'success',
                    SUCCESS_VISIBLE_MS
                );
            } else {
                throw new Error(result.message || 'Request failed');
            }
        } catch (error) {
            showStatus(
                'Sorry, your message could not be sent. Please try again or email me directly.',
                'error',
                ERROR_VISIBLE_MS
            );
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
})();