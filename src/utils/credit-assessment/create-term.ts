const createTerm = (months: number) => {
    const isPositive = months > 0;
    const factorOf12 = months % 12 === 0;

    const isInvalid = !isPositive || !factorOf12;
    if (isInvalid) {
        throw new TypeError(
            "Invalid months for creating creidt assessment term"
        );
    }

    return `${months}months`;
};

export default createTerm;
