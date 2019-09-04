const separateEveryThirdCharacter = (value: string) => {
    const characters = [ ...value ].reverse();
    var result = characters[0] + '';

    for (var i = 1; i < characters.length; i++) {
        const shouldAddSeparator = (i % 3) === 0;

        if (shouldAddSeparator) {
            result = ' ' + result;
        }

        result = characters[i] + result;
    }

    return result;
}

export const formatPrice = (value: number, decimalSymbol = ',') => {
    if (!value) {
        return;
    }

    const roundedValue = Math.round(value);
    const stringValue = roundedValue + '';

    const parts = stringValue.split('.');
    const valueBeforeDecimal = parts[0];

    const separated = separateEveryThirdCharacter(valueBeforeDecimal);
    const hasDecimal = parts.length > 1;

    return hasDecimal ? separated + decimalSymbol + parts[1] : separated;
}

export const formatPercentage = (fractionValue: number) => {
    return Math.round(fractionValue * 100);
}