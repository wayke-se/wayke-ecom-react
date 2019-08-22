export const numberSeparator = (value: number) => {
    if (!value) {
        return;
    }

    const characters = [ ...(value + '') ].reverse();
    let result = characters[0] + '';

    for (let i = 1; i < characters.length; i++) {
        const shouldAddSeparator = (i % 3) === 0;

        if (shouldAddSeparator) {
            result = ' ' + result;
        }

        result = characters[i] + result;
    }

    return result;
}