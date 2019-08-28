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
                <div className="column">J*** D**</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Gatuadress</div>
                </div>
                <div className="column">B******* 5</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postnummer</div>
                </div>
                <div className="column">*** 55</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Postort</div>
                </div>
                <div className="column">G*******</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">E-post</div>
                </div>
                <div className="column">jane.doe@gmail.com</div>
            </div>

            <div data-ecom-columnrow="" className="repeat-m-half">
                <div className="column">
                    <div className="font-medium font-size-small">Telefonnummer</div>
                </div>
                <div className="column">076 399 58 21</div>
            </div>
        </React.Fragment>
    );
}

export default CustomerInformationSummary;