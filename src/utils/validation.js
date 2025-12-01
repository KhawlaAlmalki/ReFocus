// src/utils/validation.js

/**
 * Validate password strength
 * Returns { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        return { isValid: false, errors: ['Password is required'] };
    }

    // Minimum length
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    // Maximum length
    if (password.length > 128) {
        errors.push('Password must not exceed 128 characters');
    }

    // Must contain at least one lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    // Must contain at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Must contain at least one number
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    // Must contain at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*...)');
    }

    // Common password check (basic list)
    const commonPasswords = [
        'password', 'password123', '12345678', 'qwerty', 'abc123',
        'monkey', '1234567', 'letmein', 'trustno1', 'dragon'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a more secure password');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    // Check email length
    if (email.length > 254) {
        return { isValid: false, error: 'Email is too long' };
    }

    return { isValid: true };
};

/**
 * Validate name
 */
export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return { isValid: false, error: 'Name is required' };
    }

    if (name.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters' };
    }

    if (name.length > 100) {
        return { isValid: false, error: 'Name must not exceed 100 characters' };
    }

    // Only letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
        return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { isValid: true };
};

/**
 * Sanitize input (remove potential XSS)
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
};