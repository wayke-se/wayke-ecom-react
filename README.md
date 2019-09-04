# React components for Wayke's e-commerce flow
This project contains react components that can be integrated on a website in order to add the Wayke e-commerce flow, which is a modal that allows the user to go through the different steps of the e-commerce process.

## Installation
TODO

## Configuration
Configure the e-commerce API endpoint:

```
import { config } from "wayke-ecom";

config.bind({
    api: {
        address: [E-COMMERCE API URL],
    },
});
```

## Usage

The React components are built with Typescript and React, but Typescript is optional to use. The ecom flow can be added to your website by including the React component `Ecom`. This component needs some data in the following format:

```
const ecomData = {
    vehicle: {
        id: [string],
        title: [string],
        shortDescription: [string],
        price: [number],
        imageUrl: [string],
        retailerName: [string],
        modelYear: [number],
        milage: [string],
        gearBox: [string],
        fuelType: [string]
    },
    serviceLogotypeUrl: [string],
    onExit: [function]
};
```

* `vehicle` - This is information about the vehicle that the user wants to sell. The `id` is referring to a *Wayke id*, i.e. an id that is defined by Wayke for the car to sell via Wayke's e-commerce solution. The rest of the information is information about the vehicle to sell and/or the retailer who sells it.
* `serviceLogotypeUrl` - This should be an url to an image that is shown in the "header" of the e-commerce modal.
* `onExit` - This should be a function that determines what should happen when the user either clicks the exit button on the modal, or if the user goes through the whole flow, makes the order and now is finished. (this code should probably hide the modal)

When you want to show the Ecom component you simply import it and instantiate it with the above mentioned data.

```
import Ecom from 'wayke-ecom-react';

...
<Ecom {...ecomData} />
...
```

The ecom component will always be visible, so you have to set it's visibility by removing and adding it, e.g.:

```
...
{ shouldShowEcomModal && <Ecom {...ecomData} /> }
...