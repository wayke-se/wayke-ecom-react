import {
    orders,
    vehicles,
    customers,
    IAddress,
    PaymentType,
    VehicleCondition,
    DeliveryType,
} from "@wayke-se/ecom";
import { ICreateOrderSdkData } from "../types";
import CustomerInformationInputType from "../constants/customer-information-input-type";
import { validateEcomData } from "../tools/data-validation";

export const createOrder = (
    data: ICreateOrderSdkData,
    callback: (wasOrderCreated: boolean) => void
) => {
    const ecomData = data.ecomData;
    const addressLookup = data.addressLookup;
    const orderOptions = data.orderOptions;
    const paymentLookup = data.paymentLookup;
    const vehicleId = data.vehicleId;

    const isValidRequestData = validateEcomData(
        ecomData,
        addressLookup,
        orderOptions,
        paymentLookup
    );

    if (!isValidRequestData) {
        return callback(null);
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

    const customerBuilder = customers
        .newCustomer()
        .withEmail(ecomData.customer.email)
        .withPhoneNumber(ecomData.customer.phone);

    const paymentBuilder = orders
        .newPayment()
        .withType(ecomData.payment.paymentType);

    if (isAutomaticCustomerInfo) {
        customerBuilder.withPersonalNumber(ecomData.customer.personalNumber);
    } else {
        const customerAdress: IAddress = {
            city: ecomData.customer.city,
            name: ecomData.customer.name,
            postalCode: ecomData.customer.zip,
            street: ecomData.customer.address,
            street2: "",
        };

        customerBuilder.withAddress(customerAdress);
    }

    if (isLoan) {
        paymentBuilder
            .withDownPayment(ecomData.payment.loanDeposit)
            .withDuration(ecomData.payment.loanDuration)
            .withResidualValue(ecomData.payment.loanResidual);
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
            .withCondition(VehicleCondition.Ok)
            .withComment(ecomData.tradeInCar.description)
            .build();
    }

    const createRequestBuilder = orders
        .newCreateRequest()
        .forVehicle(vehicleId)
        .withCustomer(customer)
        .withPayment(payment)
        .withDeliveryType(DeliveryType.Pickup);

    if (insurance) {
        createRequestBuilder.withInsurance(insurance);
    }

    if (tradeIn) {
        createRequestBuilder.withTradeIn(tradeIn);
    }

    const createRequest = createRequestBuilder.build();

    orders
        .create(createRequest)
        .then(() => {
            callback(true);
        })
        .catch(e => {
            callback(false);
        });
};
