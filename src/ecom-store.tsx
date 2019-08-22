const data = {
    customer: {
        inputType: null,
        personalNumber: '',
        name: '',
        adress: '',
        zip: '',
        city: '',
        email: '',
        phone: ''
    },
    delivery: {
        type: null
    },
    ecomContext: {
        hasAcceptedTerms: false
    },
    insurance: {
        insuranceOption: null,
        personalNumber: '',
        expectedDrivingDistance: {
            min: null,
            max: null
        },
        alternative: ''
    },
    interact: {
        tradeInCar: {
            registrationNumber: false,
            milage: false,
        },

        insurance: {
            personalNumber: false,
        },

        context: {
            hasAcceptedTerms: false,
        },

        customer: {
            personalNumber: false,
            name: false,
            adress: false,
            zip: false,
            city: false,
            email: false,
            phone: false,
        }
    },
    payment: {
        method: null,
        financingDownPayment: '',
        financingDuration: null
    },
    tradeInCar: {
        hasTradeInCar: null,
        registrationNumber: '',
        milage: ''
    }
};