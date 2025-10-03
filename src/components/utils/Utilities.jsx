import { useEffect, useState } from "react";
import { format } from "date-fns";

export const useAlertWithTimeout = (initialVisibility = false, duration = 3000) => {
    const[isVisible, setIsVisible] = useState(initialVisibility);

    useEffect(() => {
        let timer;
        if(isVisible) {
            timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
        }
        return () => clearTimeout(timer);
    }, [isVisible, duration]);

    return[isVisible, setIsVisible];
};

/**
 * Formats the given date and time. 
 * @param {Date | String} date - The date to format. 
 * @param {Date | String} time - The time to format.
 * @returns {Object} - An object containing formatted date and time strings
 */
export const dateTimeFormatter = (date, time) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const formattedTime = format(time, "HH:mm");
    return {formattedDate, formattedTime};
};

export const UserType = {
    PATIENT : "PATIENT",
    VET : "VET",
}

export const formatAppointmentStatus = (status) => {
    return status.toLowerCase().replace(/_/g, "-");
}

/**The purpose of this code is to generate a unique color based on the input string. The color is generated using a hash function,
 * which ensuresthat different inpu strings will generate results in different colors. 
*/

/**Dynamic generator function that takes a single parameter string "str"*/
export const generateColor = (str) => {

    /**1. The first if-statement checks if the input "str"  is a string and if it has a length greater than zero (0). If the input is
     * not a string or has a length of 0, the functions returns a default color #8884d8*/ 
    if(typeof str !== "string" || str.length === 0){
        return "#8884d8";//Default color
    }
    /**2. Hash generation:
     * The function then initializes a variable hash with the value of 0. It then loops through each character in the str parameter and 
     * performs a hash calculation using the following formula: 
     */
    let hash = 0;
    for(let i = 0; i < str.length; i++){
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    /**3. Color Generation:
     * After the hash calculation, the function calculates the hue value by taking the hash value modulo 360. This ensures that the hue
     * value is within the range 0 to 359 degrees which represents the color wheel. The function the returns a color in the HSL (Hue, 
     * Saturation, Lightness) color format, using the calculated hue value and setting the saturation to 70% and lightness to 50%.
     */
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

// utils/passwordValidator.js
export const validatePassword = (password) => {
    const errors = [];
    const requirements = {
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    };

    if (!password || password.length === 0) {
        return {
            isValid: false,
            errors: ["Password cannot be empty"],
            requirements
        };
    }

    // Check minimum length
    if (password.length >= 8) {
        requirements.minLength = true;
    } else {
        errors.push("Password must be at least 8 characters long");
    }

    // Check for uppercase letter
    if (/[A-Z]/.test(password)) {
        requirements.hasUppercase = true;
    } else {
        errors.push("Password must contain at least one uppercase letter (A-Z)");
    }

    // Check for lowercase letter
    if (/[a-z]/.test(password)) {
        requirements.hasLowercase = true;
    } else {
        errors.push("Password must contain at least one lowercase letter (a-z)");
    }

    // Check for number
    if (/\d/.test(password)) {
        requirements.hasNumber = true;
    } else {
        errors.push("Password must contain at least one number (0-9)");
    }

    // Check for special character
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
        requirements.hasSpecialChar = true;
    } else {
        errors.push("Password must contain at least one special character");
    }

    return {
        isValid: errors.length === 0,
        errors,
        requirements
    };
};