[![build status](https://api.travis-ci.org/wayke-se/wayke-ecom-react.svg?branch=master)](https://api.travis-ci.org/wayke-se/wayke-ecom-react.svg?branch=master)

# React components for Wayke's e-commerce flow
This project contains react components that can be integrated on a website in order to add the Wayke e-commerce flow, which is a modal that allows the user to go through the different steps of the e-commerce process.

## Installation
`npm i --save @wayke-se/ecom-react`

## Configuration
Configure the e-commerce API endpoint:

```
import { config } from "@wayke-se/ecom";

config.bind({
    api: {
        address: [E-COMMERCE API URL],
    },
    /** Specifying an origin is optional **/
    origin: {
        topic: [E-COMMERCE-TOPIC],
        channel: [E-COMMERCE-CHANNEL],
    },
    /** Specifying a bank id thumbprint is optional **/
    bankIdThumbprint: "[CUSTOM BANK ID CERTIFICATE THUMBPRINT]"
});
```

See https://github.com/wayke-se/wayke-ecom-js for more info about for instance the API address, as well as configuration for order origination and bank id thumbprint.

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
    onExit: [function],
    onUserEvent: [function],
    useBankId: [boolean],
    displayBankIdAlert: [boolean]
};
```

* `vehicle` - This is information about the vehicle that the user wants to sell. The `id` is referring to a *Wayke id*, i.e. an id that is defined by Wayke for the car to sell via Wayke's e-commerce solution. The rest of the information is information about the vehicle to sell and/or the retailer who sells it.
* `serviceLogotypeUrl` - This should be an url to an image that is shown in the "header" of the e-commerce modal.
* `onExit` - This should be a function that determines what should happen when the user either clicks the exit button on the modal, or if the user goes through the whole flow, makes the order and now is finished. (this code should probably hide the modal)
* `onUserEvent` - This is an *optional* method to provide if you want to be informed about how the user navigates through the ecom modal. This could for instance be used for analytics purposes. The method will receive two parameters: 1) `userEvent: string` and 2) `currentStep: string`. The first one indicating what the user did, and the second one which step the user was on when they performed the event.
* `useBankId`: An *optional* flag. If you want to use _Swedish Bank Id_ to identify the user and fetch their personal information, set this to true _(`false` by default)_.
* `displayBankIdAlert`: An *optional* flag. By default, the user is identified with BankId to _Wayke_. To clarify that the purchase is to another retailer, an optional alert can be displayed in the BankId identification step _(`false` by default)_.

When you want to show the Ecom component you simply import it and instantiate it with the above mentioned data.

```
import Ecom from '@wayke-se/ecom-react';

...
<Ecom {...ecomData} />
...
```

The ecom component will always be visible, so you have to set it's visibility by removing and adding it, e.g.:

```
...
{ shouldShowEcomModal && <Ecom {...ecomData} /> }
...
```

### Styling

In the folder `assets/styles` there is a CSS-file `default.css`. If you want to use these provided styles, you can simply add this CSS to your html-head as normally with a `link` element.

### Development

```
npx parcel@1.12.3 dev/index.html
```