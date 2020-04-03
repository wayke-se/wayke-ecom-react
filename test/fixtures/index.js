const factory = require("autofixture");

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

factory.define("IEcomExternalProps", [
    "vehicle".fromFixture("IVehicle"),
    "serviceLogotypeUrl",
    "onExit".as(() => () => null),
    "onUserEvent".as(() => () => null),
]);

module.exports = factory;
