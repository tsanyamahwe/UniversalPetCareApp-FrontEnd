// components/common/PasswordStrengthIndicator.js
import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PasswordStrengthIndicator = ({ password, showRequirements = true }) => {
    const requirements = [
        {
            key: 'minLength',
            test: password.length >= 8,
            text: 'At least 8 characters long'
        },
        {
            key: 'hasUppercase',
            test: /[A-Z]/.test(password),
            text: 'Contains uppercase letter (A-Z)'
        },
        {
            key: 'hasLowercase',
            test: /[a-z]/.test(password),
            text: 'Contains lowercase letter (a-z)'
        },
        {
            key: 'hasNumber',
            test: /\d/.test(password),
            text: 'Contains number (0-9)'
        },
        {
            key: 'hasSpecialChar',
            test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password),
            text: 'Contains special character'
        }
    ];

    const passedRequirements = requirements.filter(req => req.test).length;
    const strength = passedRequirements / requirements.length;

    const getStrengthColor = () => {
        if (strength >= 1) return 'success';
        if (strength >= 0.8) return 'info';
        if (strength >= 0.6) return 'warning';
        return 'danger';
    };

    const getStrengthText = () => {
        if (strength >= 1) return 'Strong';
        if (strength >= 0.8) return 'Good';
        if (strength >= 0.6) return 'Fair';
        return 'Weak';
    };

    if (!password || !showRequirements) {
        return null;
    }

    return (
        <div className="mt-2">
            <div className="d-flex align-items-center mb-2">
                <small className="text-muted me-2">Password Strength:</small>
                <span className={`badge bg-${getStrengthColor()}`}>
                    {getStrengthText()}
                </span>
            </div>
            
            <div className="password-requirements">
                {requirements.map((requirement) => (
                    <div 
                        key={requirement.key} 
                        className={`d-flex align-items-center small ${
                            requirement.test ? 'text-success' : 'text-danger'
                        }`}
                        style={{ fontSize: '0.85rem' }}
                    >
                        {requirement.test ? (
                            <FaCheck className="me-2" size={12} />
                        ) : (
                            <FaTimes className="me-2" size={12} />
                        )}
                        {requirement.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;