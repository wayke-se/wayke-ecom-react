import React from 'react';

import { PaymentType } from '@wayke-se/ecom';
import { IVehicle, IEcomStore, IEcomExternalProps, IEcomContext } from './types';

import { formatPrice } from './utils/helpers';
import { getPaymentMethodTitle, getLoanPaymentOptions } from './utils/payment';
import { getVehicleFullTitle } from './utils/trade-in-car';

export interface IEcomCartProps extends IEcomExternalProps, IEcomContext, IEcomStore {
    vehicle: IVehicle;
};

interface ICartItemAddon {
    title: string;
    price: number;
    unit: string;
};

interface ICartItemProps {
    title: string;
    description: string;
    price: number;
    unit: string;
    addons: ICartItemAddon[];
};

const CartItem = (props: ICartItemProps) => {
    const addonItems = props.addons.map((a, index) => <div key={index}>{a.title} - {a.price}{a.unit}</div>);
    const hasAddons = addonItems.length > 0;

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

            { hasAddons &&
                <div className="m-t-mini">
                    {addonItems}
                </div>
            }
        </div>
    );
}

const EcomCart = (props: IEcomCartProps) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    const cartContent = [];

    const hasTradeIn = props.data.tradeInCar.hasTradeInCar && props.data.tradeInCar.registrationNumber && props.vehicleLookup !== null;
    const hasLoan = props.data.payment.paymentType && props.data.payment.paymentType === PaymentType.Loan;
    const hasInsurance = props.data.insurance.wantsToSeeInsuranceOptions &&
            props.data.insurance.hasAddedInsurance &&
            props.data.insurance.personalNumber &&
            props.data.insurance.expectedDrivingDistance &&
            props.insuranceOptions !== null;

    if (hasTradeIn) {
        const vehicleInformation = props.vehicleLookup.getVehicle();

        cartContent.push({
            title: 'Inbytesbil',
            description: getVehicleFullTitle(props.data.tradeInCar.registrationNumber, vehicleInformation),
            price: '',
            unit: '',
            addons: []
        });
    }

    if (hasLoan) {
        const paymentOption = getLoanPaymentOptions(props.orderOptions);

        cartContent.push({
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

        cartContent.push({
            title: 'Försäkring',
            description: insuranceOption.brand.name + ' - ' + insuranceOption.name,
            price: insuranceOption.price,
            unit: insuranceOption.unit,
            addons
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
                <button className={`cart-header ${hasContent ? '' : 'cursor-default'}`} onClick={handleCartClick}>
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