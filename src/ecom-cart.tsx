import React from 'react';

import { IVehicle } from './types';
import { numberSeparator } from './utils/helpers';

export interface IEcomCartProps {
    vehicle: IVehicle;
};

interface ICartItemProps extends IEcomCartProps {
};

const CartItem = (props: ICartItemProps) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    return (
        <div data-ecom-cart="" className={isExtended ? 'is-extended' : ''}>
            <button className="cart-header" onClick={() => setIsExtended(!isExtended)}>
                <div className="cart-header-img-section">
                    <div className="cart-header-img" style={{ backgroundImage: 'url(images/cart-preview.jpg)' }}></div>
                </div>
                <div className="cart-header-content-section">
                    <div className="cart-header-content-info">
                        <div className="cart-header-title">
                        <span className="font-medium">{props.vehicle.title}</span> {props.vehicle.shortDescription}
                        </div>
                        <div className="cart-header-price">{numberSeparator(props.vehicle.price)} kr</div>
                    </div>
                    <div className="cart-header-content-icon-container">
                        <div className="cart-header-content-icon"></div>
                    </div>
                </div>
            </button>

            <div className="cart-body">
                Cart Body
            </div>
        </div>
    );
};

const EcomCart = (props: IEcomCartProps) => {
    return (
        <div data-ecom-footer="">
            <CartItem vehicle={props.vehicle} />
        </div>
    );
};

export default EcomCart;