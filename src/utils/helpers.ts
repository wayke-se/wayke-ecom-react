const separateEveryThirdCharacter = (value: string) => {
    const characters = [...value].reverse();
    let result = characters[0];

    for (let i = 1; i < characters.length; i += 1) {
        const shouldAddSeparator = i % 3 === 0;

        if (shouldAddSeparator) {
            result = ` ${result}`;
        }

        result = characters[i] + result;
    }

    return result;
};

export const formatPrice = (value: number, decimalSymbol = ",") => {
    if (value === null || value === undefined) {
        return null;
    }

    const roundedValue = Math.round(value);
    const stringValue = `${roundedValue}`;

    const parts = stringValue.split(".");
    const valueBeforeDecimal = parts[0];

    const separated = separateEveryThirdCharacter(valueBeforeDecimal);
    const hasDecimal = parts.length > 1;

    return hasDecimal ? separated + decimalSymbol + parts[1] : separated;
};

export const formatPercentage = (fractionValue: number) => {
    const percentageValue = fractionValue * 100;
    return (Math.round(percentageValue * 100) / 100).toFixed(2);
};
