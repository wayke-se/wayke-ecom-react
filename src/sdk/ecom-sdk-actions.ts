import { orders, insurances, vehicles, customers, IOrderOptionsResponse, IInsuranceOptionsResponse, IVehicleLookupResponse, IAddressLookupResponse, IOrderCreateResponse } from 'wayke-ecom';
import { IOrderOptionsData, IInsuranceOptionsData, IVehicleLookupData, IAddressLookupData, ICreateOrderData } from '../types';

export const getOrderOptions = (data: IOrderOptionsData, callback: (options: IOrderOptionsResponse) => void) => {
    const request = orders.newOptionsRequest()
        .forVehicle(data.vehicleId)
        .build();

    orders.getOptions(request)
        .then((response: IOrderOptionsResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};

export const getInsuranceOptions = (data: IInsuranceOptionsData, callback: (options: IInsuranceOptionsResponse) => void) => {
    const request = insurances.newInsuranceOptionsRequest()
                        .forCustomer(data.personalNumber)
                        .forVehicle(data.vehicleId)
                        .withPayment(data.paymentType)
                        .withDrivingDistance(data.drivingDistance)
                        .build();

    insurances.getOptions(request)
        .then((response: IInsuranceOptionsResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};

export const getVehicleLookup = (data: IVehicleLookupData, callback: (lookup: IVehicleLookupResponse) => void) => {
    const request = vehicles.newLookupRequest()
        .withRegistrationNumber(data.registrationNumber)
        .build();

    vehicles.lookupVehicle(request)
        .then((response: IVehicleLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};

export const getAddressLookup = (data: IAddressLookupData, callback: (lookup: IAddressLookupResponse) => void) => {
    const request = customers.newAddressLookupRequest()
        .forCustomer(data.personalNumber)
        .build();

    customers.lookupAddress(request)
        .then((response: IAddressLookupResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
};

export const createOrder = (data: ICreateOrderData, callback: (response: IOrderCreateResponse) => void) => {
    const customer = customers.newCustomer()
        .withAddress(data.customerAddress)
        .withPersonalNumber(data.customerPersonalNumber)
        .withEmail(data.customerEmail)
        .withPhoneNumber(data.customerPhone)
        .build();

    const payment = orders.newPayment()
        .withType(data.paymentType)
        .withDownPayment(data.paymentLoanDeposit)
        .withDuration(data.paymentLoanDuration)
        .withResidualValue(data.paymentResidualValue)
        .build();

    const insurance = orders.newInsurance()
        .withDrivingDistance(data.insuranceExpectedDrivingDistance)
        .withAddOns(data.insuranceAddOns)
        .build();

    const tradeIn = vehicles.newVehicleTrade()
        .forVehicle(data.tradeInRegistrationNumber)
        .withMileage(data.tradeInMilage)
        .withCondition(data.tradeInCondition)
        .withComment(data.tradeInComment)
        .build();

    const request = orders.newCreateRequest()
        .forVehicle(data.vehicleId)
        .withCustomer(customer)
        .withPayment(payment)
        .withDeliveryType(data.deliveryType)
        .withInsurance(insurance)
        .withTradeIn(tradeIn)
        .build();

    orders.create(request)
        .then((response: IOrderCreateResponse) => {
            callback(response);
        })
        .catch(() => {
            callback(null);
        });
}