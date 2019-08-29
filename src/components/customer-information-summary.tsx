import React from 'react';
import { IEcomStore, IEcomContext } from '../types';

interface ICustomerInformationSummaryProps extends IEcomContext, IEcomStore {
};

const CustomerInformationSummary = (props: ICustomerInformationSummaryProps) => {
    const hasAutomaticLookup = props.addressLookup !== null;

    var name, address, zip, city;

    if (hasAutomaticLookup) {
        const addressLookup = props.addressLookup.getAddress();

        name = addressLookup.name;
        address = addressLookup.street;
        zip = addressLookup.postalCode;
        city = addressLookup.city;
    } else {
        name = props.data.customer.name;
        address = props.data.customer.address;
        zip = props.data.customer.zip;
        city = props.data.customer.city;
    }

    return (
        <React.Fragment>
            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">För- och efternamn</div>
                </div>
                <div className="column">{name}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Gatuadress</div>
                </div>
                <div className="column">{address}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postnummer</div>
                </div>
                <div className="column">{zip}</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postort</div>
                </div>
                <div className="column">{city}</div>
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