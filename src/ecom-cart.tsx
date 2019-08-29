import React from 'react';

import { PaymentType } from 'wayke-ecom';
import { IVehicle, IEcomStore, IEcomExternalProps, IEcomContext } from './types';

import { formatPrice } from './utils/helpers';
import { getPaymentMethodTitle } from './utils/payment';
import { getVehicleFullTitle } from './utils/trade-in-car';

export interface IEcomCartProps extends IEcomExternalProps, IEcomContext, IEcomStore {
    vehicle: IVehicle;
};

interface ICartItemProps {
    title: string;
    description: string;
    price: number;
    unit: string;
};

const CartItem = (props: ICartItemProps) => {
    return (
        <div className="cart-body-section">
            <div data-ecom-columnrow="">
                <div className="column">
                    <div className="font-medium">{props.title}</div>
                </div>
                <div className="column">
                    {formatPrice(props.price)}{props.unit}
                </div>
            </div>
            <div>
                {props.description}
            </div>
        </div>
    );
}

const EcomCart = (props: IEcomCartProps) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    const cartContent = [];

    const hasTradeIn = props.data.tradeInCar.hasTradeInCar && props.data.tradeInCar.registrationNumber && props.vehicleLookup !== null;
    const hasLoan = props.data.payment.paymentOption && props.data.payment.paymentOption.type === PaymentType.Loan;
    const hasInsurance = props.data.insurance.hasAddedInsurance && props.data.insurance.personalNumber && props.data.insurance.expectedDrivingDistance && props.insuranceOptions !== null;

    if (hasTradeIn) {
        const vehicleInformation = props.vehicleLookup.getVehicle();

        cartContent.push({
            title: 'Inbytesbil',
            description: getVehicleFullTitle(props.data.tradeInCar.registrationNumber, vehicleInformation),
            price: '',
            unit: ''
        });
    }

    if (hasLoan) {
        cartContent.push({
            title: getPaymentMethodTitle(PaymentType.Loan),
            description: props.data.payment.paymentOption.name,
            price: props.data.payment.paymentOption.price,
            unit: props.data.payment.paymentOption.unit
        });
    }

    if (hasInsurance) {
        const insuranceOption = props.insuranceOptions.getInsuranceOption();

        cartContent.push({
            title: 'Försäkring',
            description: insuranceOption.brand.name + ' - ' + insuranceOption.name,
            price: insuranceOption.price,
            unit: insuranceOption.unit
        });
    }

    const items = cartContent.map((c, index) => <CartItem key={index} {...c} />);
    const hasContent = items.length > 0;

    const handleCartClick = () => {
        if (!hasContent) {
            return;
        }

        setIsExtended(!isExtended);
    }

    return (
        <div data-ecom-footer="">
            <div data-ecom-cart="" className={isExtended && hasContent ? 'is-extended' : ''}>
                <button className="cart-header" onClick={handleCartClick}>
                    <div className="cart-header-img-section">
                        <div className="cart-header-img" style={{ backgroundImage: `url(${props.vehicle.imageUrl})` }}></div>
                    </div>
                    <div className="cart-header-content-section">
                        <div className="cart-header-content-info">
                            <div className="cart-header-title">
                            <span className="font-medium">{props.vehicle.title}</span> {props.vehicle.shortDescription}
                            </div>
                            <div className="cart-header-price">{formatPrice(props.vehicle.price)} kr</div>
                        </div>

                        { hasContent &&
                            <div className="cart-header-content-icon-container">
                                <div className="cart-header-content-icon"></div>
                            </div>
                        }
                    </div>
                </button>

                { hasContent &&
                    <div className="cart-body">
                        {items}
                    </div>
                }
            </div>
        </div>
    );
};

export default EcomCart;