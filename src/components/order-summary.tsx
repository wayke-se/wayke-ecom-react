import React from 'react';
import { IEcomStore } from '../types';

interface IOrderSummaryProps extends IEcomStore {
};

const OrderSummary = (props: IOrderSummaryProps) => {
    return (
        <div data-ecom-productcard="">
            <div className="prodcut-card-image-section">
                <div className="product-card-image" style={{ backgroundImage: `url(/assets/toolkit/images/product-card.jpg);` }}></div>
            </div>

            <div className="product-card-content-section">
                <div className="product-card-content">
                    <div className="product-card-retailer">Börjessons bil Ängelholm</div>
                    <div className="product-card-title">Audi A6 AVANT 50 TDI 286HK quattro S-Tronic</div>

                    <ul className="product-card-usp-list">
                        <li className="product-card-usp-item">2017</li>
                        <li className="product-card-usp-item">2 595 mil</li>
                        <li className="product-card-usp-item">Automat</li>
                        <li className="product-card-usp-item">Diesel</li>
                    </ul>
                </div>

                <div className="product-card-content">
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <div className="font-medium">Finansiering</div>
                        </div>

                        <div className="column">
                            5 700 kr/mån
                        </div>
                    </div>

                    <div className="font-size-small">
                        Audi Financial Services
                    </div>
                </div>

                <div className="product-card-content">
                    <div data-ecom-columnrow="">
                        <div className="column">
                            <div className="font-medium">Halvförsäkring</div>
                        </div>

                        <div className="column">
                            427 kr/mån
                        </div>
                    </div>

                    <div className="font-size-small">
                        Audi Financial Services
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;