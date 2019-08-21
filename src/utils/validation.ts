const regexReg = /[a-zA-Z]{3}\d{2}(d||[a-zA-Z]){1}/;
const regexSsn = /^(19|20)?(\d{6}(-|\s)\d{4}|(?!19|20)\d{10})$/;
const regexEmail = /\S+@\S+\.\S+/;
const regexZip = /^[0-9]{3} [0-9]{2}$/;

export const validateRegistrationNumber = (registrationNumber) => {
    if (!registrationNumber)
        return false;
    let reg = registrationNumber.replace(' ', '');
    if (reg.length === 6 && regexReg.test(reg))
        return true;
    return false;
};

export const validateSSN = (ssn) => {
    return regexSsn.test(ssn) && (ssn.length === 13 || ssn.length === 12);
};

export const validateEmail = (email) => {
    return regexEmail.test(email);
};

export const validateZip = (zip) => {
    return regexZip.test(zip);
};

export const validateNumberInRange = (value, from, to) => {
    if (!value) {
        return false;
    }

    const number = parseInt(value);

    if (isNaN(number)) {
        return false;
    }

    return number >= from && number <= to;
};

export const validateMilage = (milage) => {
    return validateNumberInRange(milage, 0, 80000);
};