export const formatPersonalNumber = (value: string) => {
    const formattedValue = value.replace("-", "");

    const hasInvalidLength = formattedValue.length !== 12;
    if (hasInvalidLength) {
        throw new TypeError("Personal number has invalid format");
    }

    return formattedValue;
};
