import {
    orders,
    vehicles,
    customers,
    IAddress,
    PaymentType,
} from "@wayke-se/ecom";
import { ICreateOrderSdkData } from "../types";
import CustomerInformationInputType from "../constants/customer-information-input-type";
import { validateEcomData } from "../tools/data-validation";
import shouldUseCreditAssessment from "../utils/credit-assessment/usage-resolver";

export const createOrder = (
    data: ICreateOrderSdkData,
    callback: (error?: Error) => void
) => {
    const ecomData = data.ecomData;
    const orderOptions = data.orderOptions;
    const paymentLookup = data.paymentLookup;
    const vehicleId = data.vehicleId;
    const address = data.address;
    const creditAssessmentStatus = data.creditAssessmentStatus;

    const isValidRequestData = validateEcomData(
        ecomData,
        orderOptions,
        paymentLookup,
        address,
        creditAssessmentStatus
    );

    if (!isValidRequestData) {
        return callback(new Error("Invalid request data"));
    }

    const isAutomaticCustomerInfo =
        ecomData.customer.inputType === CustomerInformationInputType.AUTOMATIC;
    const isLoan = ecomData.payment.paymentType === PaymentType.Loan;
    const hasSelectedInsurance =
        ecomData.insurance.wantsToSeeInsuranceOptions &&
        ecomData.insurance.hasAddedInsurance;
    const hasTradeIn =
        ecomData.tradeInCar.wantsToDefineTradeIn &&
        ecomData.tradeInCar.hasProvidedTradeInInfo &&
        ecomData.tradeInCar.hasTradeInCar;
    const hasChosenAccessories = ecomData.chosenAccessories.ids.length > 0;

    const customerBuilder = customers
        .newCustomer()
        .withEmail(ecomData.customer.email)
        .withPhoneNumber(ecomData.customer.phone);
    if (isAutomaticCustomerInfo) {
        customerBuilder
            .withPersonalNumber(ecomData.customer.personalNumber)
            .withGivenName(address.givenName)
            .withSurname(address.surname);
    } else {
        const customerAdress: IAddress = {
            city: ecomData.customer.city,
            givenName: ecomData.customer.givenName,
            surname: ecomData.customer.surname,
            postalCode: ecomData.customer.zip,
            street: ecomData.customer.street,
            street2: "",
        };

        customerBuilder.withAddress(customerAdress);
    }

    const paymentBuilder = orders
        .newPayment()
        .withType(ecomData.payment.paymentType)
        .withExternalId(ecomData.payment.externalId);
    if (isLoan) {
        paymentBuilder
            .withDownPayment(ecomData.payment.loanDeposit)
            .withDuration(ecomData.payment.loanDuration)
            .withResidualValue(ecomData.payment.loanResidual);
    }

    const usingCreditAssessment = shouldUseCreditAssessment(
        ecomData,
        orderOptions
    );
    if (usingCreditAssessment) {
        const creditAssessment = orders
            .newCreditAssessment()
            .withFinancialProductCode(ecomData.payment.financialProductCode)
            .withScoreId(creditAssessmentStatus.getScoringId())
            .withDecision(creditAssessmentStatus.getDecision())
            .withRecommendation(creditAssessmentStatus.getRecommendation())
            .build();
        paymentBuilder.withCreditAssessment(creditAssessment);
    }

    const customer = customerBuilder.build();
    const payment = paymentBuilder.build();

    let insurance = null;
    let tradeIn = null;

    if (hasSelectedInsurance) {
        insurance = orders
            .newInsurance()
            .withDrivingDistance(ecomData.insurance.expectedDrivingDistance)
            .withAddOns(ecomData.insurance.addons)
            .build();
    }

    if (hasTradeIn) {
        const milage = parseInt(ecomData.tradeInCar.milage, 10);

        tradeIn = vehicles
            .newVehicleTrade()
            .forVehicle(ecomData.tradeInCar.registrationNumber)
            .withMileage(milage)
            .withCondition(ecomData.tradeInCar.condition)
            .withComment(ecomData.tradeInCar.description)
            .build();
    }

    const createRequestBuilder = orders
        .newCreateRequest()
        .forVehicle(vehicleId)
        .withCustomer(customer)
        .withPayment(payment)
        .withDeliveryType(ecomData.delivery.type);

    if (insurance) {
        createRequestBuilder.withInsurance(insurance);
    }

    if (tradeIn) {
        createRequestBuilder.withTradeIn(tradeIn);
    }

    if (hasChosenAccessories) {
        const allAccessories = orderOptions.getAccessories();
        const accesories = allAccessories.filter((a) =>
            ecomData.chosenAccessories.ids.includes(a.id)
        );

        createRequestBuilder.withAccessories(accesories);
    }

    const createRequest = createRequestBuilder.build();

    orders
        .create(createRequest)
        .then(() => {
            callback();
        })
        .catch((err) => {
            callback(err);
        });
};
