import React from 'react';

import { formats } from '../../../../helpers';

const CartItem = (props) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    return (
        <div data-am-cart="" className={isExtended ? 'is-extended' : ''}>
            <button className="cart-header" onClick={() => setIsExtended(!isExtended)}>
                <div className="cart-header-img-section">
                    <div className="cart-header-img" style={{ backgroundImage: 'url(/assets/toolkit/images/cart-preview.jpg)' }}></div>
                </div>
                <div className="cart-header-content-section">
                    <div className="cart-header-content-info">
                        <div className="cart-header-title">
                        <span className="font-medium">{props.vehicle.title}</span> {props.vehicle.shortDescription}
                        </div>
                        <div className="cart-header-price">{formats.numberSeparator(props.vehicle.price)} kr</div>
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

const EcomCart = (props) => {
    const items = [
        <CartItem key={0} vehicle={props.vehicle} />
    ];

    return (
        <div data-am-footer="">
            {items}
        </div>
    );
};

export default EcomCart;