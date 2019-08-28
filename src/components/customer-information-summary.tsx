import React from 'react';
import { IEcomStore } from '../types';

interface ICustomerInformationSummaryProps extends IEcomStore {
};

const CustomerInformationSummary = (props: ICustomerInformationSummaryProps) => {
    return (
        <React.Fragment>
            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">För- och efternamn</div>
                </div>
                <div className="column">{props.data.customer.name}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Gatuadress</div>
                </div>
                <div className="column">{props.data.customer.adress}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postnummer</div>
                </div>
                <div className="column">{props.data.customer.zip}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postort</div>
                </div>
                <div className="column">{props.data.customer.city}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">E-post</div>
                </div>
                <div className="column">{props.data.customer.email}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Telefonnummer</div>
                </div>
                <div className="column">{props.data.customer.phone}</div>
            </div>
        </React.Fragment>
    );
}

export default CustomerInformationSummary;