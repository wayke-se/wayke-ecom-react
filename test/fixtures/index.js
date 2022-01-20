const factory = require("autofixture");

const CustomerInformationInputType = require("../../src/constants/customer-information-input-type");

factory.define("IDistance", [
    "value".asNumber(),
    "unit".pickFrom(["m", "km"]),
]);

factory.define("IAccessory", [
    "id",
    "id",
    "articleNumber",
    "logoUrl",
    "longDescription",
    "shortDescription",
    "manufacturer",
    "model",
    "name",
    "price",
    "assemblyPrice".asNumber(),
    "salePrice".asNumber(),
    "productPageLink",
    "productPageLinkText",
    "media".asArray(),
    "templateDeleted".asBoolean(),
    "createdAt",
    "updatedAt",
]);

factory.define("IAddress", [
    "city",
    "name",
    "postalCode",
    "street",
    "street2",
    "distance".fromFixture("IDistance"),
]);

factory.define("IDeliveryOption", [
    "type".pickFrom(["Pickup", "Delivery"]),
    "deliveryTime",
    "startupCost".asNumber(),
    "unitPrice".asNumber(),
    "unit".pickFrom(["km"]),
    "minQuantity".asNumber(),
    "maxQuantity".asNumber(),
]);

factory.define("IVehicle", [
    "id",
    "title",
    "shortDescription",
    "price".asNumber(),
    "imageUrl",
    "modelYear".pickFrom([2007, 2014, 2017, 2018, 2020]),
    "milage",
    "gearBox",
    "fuelType",
]);

factory.define("ICustomerData", [
    "hasAcceptedConditions".asBoolean(),
    "hasAcceptedReturnConditions".asBoolean(),
    "inputType".pickFrom([CustomerInformationInputType.AUTOMATIC, CustomerInformationInputType.MANUAL]),
    "personalNumber",
    "name",
    "street",
    "zip",
    "city",
    "email",
    "phone",
]);

factory.define("IDeliveryMethodData", [
    "type".pickFrom(["Pickup", "Delivery"]),
]);

factory.define("IInsuranceData", [
    "wantsToSeeInsuranceOptions".asBoolean(),
    "hasAddedInsurance".asBoolean(),
    "personalNumber",
    "expectedDrivingDistance".pickFrom(["Between0And1000", "Between1000And1500","Between1500And2000", "Between2000And2500", "Over2500"]),
    "addons".asArray(2),
]);

factory.define("IPaymentData", [
    "paymentType".pickFrom(["Cash", "Lease", "Loan"]),
    "loanDeposit".asNumber(),
    "loanDuration".asNumber(),
    "loanResidual".asNumber(),
    "hasAcceptedLoanDetails".asBoolean(),
]);

factory.define("ITradeInCarData", [
    "wantsToDefineTradeIn".asBoolean(),
    "hasProvidedTradeInInfo".asBoolean(),
    "hasProvidedTradeInCondition".asBoolean(),
    "hasTradeInCar".asBoolean(),
    "registrationNumber",
    "milage",
    "condition".pickFrom(["VeryGood", "Good", "Ok"]),
    "description",
]);

factory.define("IEcomData", [
    "customer".fromFixture("ICustomerData"),
    "delivery".fromFixture("IDeliveryMethodData"),
    "insurance".fromFixture("IInsuranceData"),
    "interact".pickFrom([null]),
    "payment".fromFixture("IPaymentData"),
    "tradeInCar".fromFixture("ITradeInCarData"),
    "useBankId".asBoolean(),
]);

factory.define("IEcomExternalProps", [
    "vehicle".fromFixture("IVehicle"),
    "serviceLogotypeUrl",
    "onExit".as(() => () => null),
    "onUserEvent".as(() => () => null),
]);

factory.define("IOrderOptionsResponse", [
    "getAccessories".as(() => []),
    "getPaymentOptions".as(() => []),
    "getDeliveryOptions".as(() => []),
    "getInsuranceOption".as(() => undefined),
    "getOrderConditions".as(() => undefined),
    "getOrderReturnConditions".as(() => undefined),
    "getConditionsPdfUri".as(() => null),
    "getContactInformation".as(() => null),
    "allowsTradeIn".as(() => false),
]);

factory.define("IAvailableInsuranceOption", [
    "description",
    "logo",
    "title",
    "url",
    "ecomInsuranceText",
]);

factory.define("IBankIdPresenterProps", [
    "hasQrCode".asBoolean(),
    "canLaunch".asBoolean(),
    "useQrCode".asBoolean(),
    "hasOngoingProcess".asBoolean(),
    "qrCodeAsBase64",
    "onCancel".as(() => {}),
    "onSwitchMethod".as(() => {}),
    "onCancel".as(() => {}),
    "bankIdCollect".fromFixture("IBankIdCollectResponse"),
]);

factory.define("IBankIdCollectResponse", [
    "getOrderRef".as(() => ""),
    "getStatus".as(() => undefined),
    "isPending".as(() => false),
    "hasMessage".as(() => false),
    "shouldRenew".as(() => false),
    "isCompleted".as(() => false),
    "getHintCode".as(() => undefined),
    "getPersonalNumber".as(() => undefined),
    "getAddress".as(() => undefined),
    "getMessage".as(() => ""),
]);

module.exports = factory;
