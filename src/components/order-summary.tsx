import React from 'react';

import { IEcomStore, IEcomContext, IEcomExternalProps } from '../types';
import { PaymentType } from 'wayke-ecom';

import { formatPrice } from '../utils/helpers';
import { getPaymentMethodTitle } from '../utils/payment';
import { getVehicleFullTitle } from '../utils/trade-in-car';

interface IOrderSummaryProps extends IEcomExternalProps, IEcomContext, IEcomStore {
};

interface IProductItemProps extends IEcomStore {
    title: string;
    description: string;
    price: number;
    unit: string;
};

const ProductItem = (props: IProductItemProps) => {
    return (
        <div className="product-card-content">
            <div data-ecom-columnrow="">
                <div className="column">
                    <div className="font-medium">{props.title}</div>
                </div>

                <div className="column">
                    {formatPrice(props.price)}{props.unit}
                </div>
            </div>

            <div className="font-size-small">
                {props.description}
            </div>
        </div>
    );
}

const OrderSummary = (props: IOrderSummaryProps) => {
    const products = [];

    const hasTradeIn = props.data.tradeInCar.hasTradeInCar && props.data.tradeInCar.registrationNumber && props.vehicleLookup !== null;
    const hasLoan = props.data.payment.paymentType && props.data.payment.paymentType === PaymentType.Loan;
    const hasInsurance = props.data.insurance.hasAddedInsurance;

    if (hasTradeIn) {
        const vehicleInformation = props.vehicleLookup.getVehicle();

        products.push({
            title: 'Inbytesbil',
            description: getVehicleFullTitle(props.data.tradeInCar.registrationNumber, vehicleInformation),
            price: '',
            unit: ''
        });
    }

    if (hasLoan) {
        const paymentOption = props.orderOptions.getPaymentOptions().find(p => p.type === PaymentType.Loan);

        products.push({
            title: getPaymentMethodTitle(PaymentType.Loan),
            description: paymentOption.name,
            price: paymentOption.price,
            unit: paymentOption.unit
        });
    }

    if (hasInsurance) {
        const insuranceOption = props.insuranceOptions.getInsuranceOption();

        products.push({
            title: 'Försäkring',
            description: insuranceOption.brand.name + ' - ' + insuranceOption.name,
            price: insuranceOption.price,
            unit: insuranceOption.unit
        });
    }

    const items = products.map((p, index) => <ProductItem key={index} {...p} />);

    return (
        <div data-ecom-productcard="">
            <div className="prodcut-card-image-section">
                <div className="product-card-image" style={{ backgroundImage: `url(${props.vehicle.imageUrl})` }}></div>
            </div>

            <div className="product-card-content-section">
                <div className="product-card-content">
                    <div className="product-card-retailer">{props.vehicle.retailerName}</div>
                    <div className="product-card-title">{props.vehicle.title} {props.vehicle.shortDescription}</div>

                    <ul className="product-card-usp-list">
                        <li className="product-card-usp-item">{props.vehicle.modelYear}</li>
                        <li className="product-card-usp-item">{props.vehicle.milage}</li>
                        <li className="product-card-usp-item">{props.vehicle.gearBox}</li>
                        <li className="product-card-usp-item">{props.vehicle.fuelType}</li>
                    </ul>
                </div>

                {items}
            </div>
        </div>
    );
}

export default OrderSummary;