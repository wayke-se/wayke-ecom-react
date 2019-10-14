import React from 'react';

import { IEcomStore, IEcomContext, IEcomExternalProps } from '../types';
import { PaymentType } from '@wayke-se/ecom';

import { formatPrice } from '../utils/helpers';
import { getPaymentMethodTitle, getLoanPaymentOptions } from '../utils/payment';
import { getVehicleTitle, getVehicleDescription } from '../utils/trade-in-car';

interface IOrderSummaryProps extends IEcomExternalProps, IEcomContext, IEcomStore {
};

interface IProductItemAddon {
    title: string;
    price: number;
    unit: string;
};

interface IProductItemProps extends IEcomStore {
    title: string;
    description: string;
    price: number;
    unit: string;
    addons: IProductItemAddon[];
};

const ProductItem = (props: IProductItemProps) => {
    const addonItems = props.addons.map((a, index) => <div key={index}>{a.title} - {a.price}{a.unit}</div>);

    const hasAddons = addonItems.length > 0;
    const hasPrice = props.price !== null;

    return (
        <div className="product-card-content">
            <div data-ecom-columnrow="">
                <div className="column">
                    <div className="font-medium">{props.title}</div>
                </div>

                { hasPrice &&
                    <div className="column">
                        {formatPrice(props.price)}{props.unit}
                    </div>
                }
            </div>

            <div className="font-size-small">
                {props.description}
            </div>

            { hasAddons &&
                <div className="font-size-small m-t-mini">
                    {addonItems}
                </div>
            }
        </div>
    );
}

const OrderSummary = (props: IOrderSummaryProps) => {
    const products = [];

    const hasLoan = props.data.payment.paymentType && props.data.payment.paymentType === PaymentType.Loan;
    const hasInsurance = props.data.insurance.hasAddedInsurance;
    const hasTradeIn = props.data.tradeInCar.wantsToDefineTradeIn &&
            props.data.tradeInCar.hasProvidedTradeInInfo &&
            props.data.tradeInCar.hasTradeInCar &&
            props.data.tradeInCar.registrationNumber &&
            props.vehicleLookup !== null;

    if (hasLoan) {
        const paymentOption = getLoanPaymentOptions(props.orderOptions);

        products.push({
            title: getPaymentMethodTitle(PaymentType.Loan),
            description: paymentOption.name,
            price: paymentOption.price,
            unit: paymentOption.unit,
            addons: []
        });
    }

    if (hasInsurance) {
        const insuranceOption = props.insuranceOptions.getInsuranceOption();
        const addons = insuranceOption.addons.filter(a => props.data.insurance.addons.includes(a.name)).map(a => ({
            title: a.title,
            price: a.monthlyPrice,
            unit: 'kr/mån'
        }));

        products.push({
            title: 'Försäkring',
            description: insuranceOption.brand.name + ' - ' + insuranceOption.name,
            price: insuranceOption.price,
            unit: insuranceOption.unit,
            addons
        });
    }

    const items = products.map((p, index) => <ProductItem key={index} {...p} />);
    var tradeInItem;

    if (hasTradeIn) {
        const vehicleInformation = props.vehicleLookup.getVehicle();
        const tradeInTitle = getVehicleTitle(vehicleInformation) + ' ' + getVehicleDescription(vehicleInformation);

        tradeInItem = (
            <div className="repeat-m">
                <div data-ecom-productcard="">
                    <div className="product-card-content-section">
                        <div className="product-card-content">
                            <div className="product-card-title"><div className="product-card-heading">Inbytesbil</div></div>
                            <ul className="product-card-usp-list">
                                <li className="product-card-usp-item">{props.data.tradeInCar.registrationNumber}</li>
                                <li className="product-card-usp-item">{tradeInTitle}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const formattedPrice = formatPrice(props.vehicle.price);

    return (
        <React.Fragment>
            <div className="repeat-m">
                <div data-ecom-productcard="">
                    <div className="product-card-image-content">
                        <div className="prodcut-card-image-section">
                            <div className="product-card-image" style={{ backgroundImage: `url(${props.vehicle.imageUrl})` }}></div>
                        </div>
                        <div className="product-card-content">
                            <div className="product-card-retailer">{props.vehicle.retailerName}</div>
                            <div className="product-card-title">
                                <div className="product-card-heading">{props.vehicle.title}</div>
                                <div className="product-card-sub-heading">{props.vehicle.shortDescription}</div>
                            </div>
                            <div className="product-card-price">{formattedPrice} kr</div>

                            <ul className="product-card-usp-list">
                                { props.vehicle.modelYear && <li className="product-card-usp-item">{props.vehicle.modelYear}</li> }
                                { props.vehicle.milage && <li className="product-card-usp-item">{props.vehicle.milage}</li> }
                                { props.vehicle.gearBox && <li className="product-card-usp-item">{props.vehicle.gearBox}</li> }
                                { props.vehicle.fuelType && <li className="product-card-usp-item">{props.vehicle.fuelType}</li> }
                            </ul>
                        </div>
                    </div>

                    {items}
                </div>
            </div>

            {tradeInItem}
        </React.Fragment>
    );
}

export default OrderSummary;