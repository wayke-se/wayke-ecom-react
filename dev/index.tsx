import React from "react";
import ReactDOM from "react-dom";
import { config } from "@wayke-se/ecom";

import Ecom from "../src/index";
import { IEcomExternalProps } from "../src/types";

const devData: IEcomExternalProps = {
    vehicle: {
        id: "a1cfc883-5b28-4785-ad6a-3b0065373be2",
        title: "Volvo V70",
        shortDescription: "D3 Momentum",
        price: 138900,
        imageUrl:
            "https://test-cdn.wayketech.se/media/268b53e8-79e7-4c38-88b5-bae510540971/6d9ecebf-4ca8-497f-9ce7-ba3d4fb680a3/1170x",
        modelYear: 2015,
        milage: "2885 mil",
        gearBox: "Automat",
        fuelType: "Diesel",
    },
    serviceLogotypeUrl: "https://cdn.wayke.se/wui/images/ecom/wayke-logo.svg",
    onExit: () => {
        window.location.href = "https://www.wayke.se";
    },
    onUserEvent: (userEvent, currentStep) => {
        console.log(">> New tracking event");
        console.log("Event: " + userEvent);
        console.log("Current step: " + currentStep);
        console.log("-----");
    },
};
const newConfig = {
    api: {
        address: "https://ecom.wayketech.se",
    },
};

config.bind(newConfig);
ReactDOM.render(<Ecom {...devData} />, document.getElementById("root"));
