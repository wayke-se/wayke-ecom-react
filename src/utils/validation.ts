const regexRegistrationNumber = /[a-zA-Z]{3}\d{2}(d||[a-zA-Z]){1}/;
const regexPersonalNumber = /^(19|20)?(\d{6}(-|\s)\d{4}|(?!19|20)\d{10})$/;
const regexEmail = /\S+@\S+\.\S+/;
const regexZip = /^[0-9]{3} [0-9]{2}$/;
const regexPhoneNumber = /^[0-9]{3}[\-]?[0-9]{7}$/;

export const validateRegistrationNumber = (registrationNumber: string) => {
    if (!registrationNumber) {
        return false;
    }

    const trimmed = registrationNumber.replace(' ', '');

    const hasCorrectLength = trimmed.length === 6;
    const isRegexMatch = regexRegistrationNumber.test(trimmed)

    return hasCorrectLength && isRegexMatch;
};

export const validatePersonalNumber = (personalNumber: string) => {
    if (!personalNumber) {
        return false;
    }

    const hasCorrectLength = personalNumber.length === 13 || personalNumber.length === 12;
    const isRegexMatch = regexPersonalNumber.test(personalNumber);

    return isRegexMatch && hasCorrectLength;
};

export const validateEmail = (email: string) => {
    if (!email) {
        return false;
    }

    return regexEmail.test(email);
};

export const validateZip = (zip: string) => {
    if (!zip) {
        return false;
    }

    return regexZip.test(zip);
};

export const validateStringNumberInRange = (value: string, from: number, to: number) => {
    if (!value) {
        return false;
    }

    const number = parseInt(value);

    if (isNaN(number)) {
        return false;
    }

    return number >= from && number <= to;
};

export const validateNumberInRange = (value: number, from: number, to: number) => {
    if (isNaN(value)) {
        return false;
    }

    return value >= from && value <= to;
};

export const validateMilage = (milage: string) => {
    return validateStringNumberInRange(milage, 0, 80000);
};

export const validatePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) {
        return false;
    }

    const hasCorrectLength = phoneNumber.length === 10 || phoneNumber.length === 11;
    const isRegexMatch = regexPhoneNumber.test(phoneNumber);

    return isRegexMatch && hasCorrectLength;
}