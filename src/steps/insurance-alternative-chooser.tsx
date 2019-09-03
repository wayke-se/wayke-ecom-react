import React from 'react';

import marked from 'marked';

import { IEcomLifecycle, IEcomStore, IEcomContext } from '../types';
import StoreAction from '../constants/store-action';
import { getDrivingDistanceLabel } from '../utils/insurance';
import { IInsuranceItem, IInsuranceAddon } from 'wayke-ecom';
import { htmlEncode } from '../utils/encode';

export interface IInsuranceAlternativeChooserProps extends IEcomContext, IEcomStore, IEcomLifecycle {
};

interface IAddonItemProps extends IInsuranceAddon, IEcomStore {
    id: string;
    isDisabled: boolean;
}

const AccordionItem = (props: IInsuranceItem) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    }

    return (
        <li className={`accordion-item ${isExtended ? 'is-open' : ''}`}>
            <button className="accordion-header" onClick={handleMoreInformationClick}>
                <div className="accordion-header-label">{props.name}</div>
                <div className="accordion-header-icon">
                    <i className={`no-margin ${isExtended ? 'icon-chevron-up' : 'icon-chevron-down'}`}></i>
                </div>
            </button>

            <div className="accordion-body">
                {props.description}
            </div>
        </li>
    );
}

const AddonItem = (props: IAddonItemProps) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    };

    const updateAddons = (newAddons: string[]) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: 'addons',
            value: newAddons
        });
    }

    const handleCheckChange = (e) => {
        const addons = [ ...props.data.insurance.addons ];

        const index = addons.indexOf(props.name);
        const hasElement = index >= 0;

        if (e.target.checked && !hasElement) {
            addons.push(props.name);
            updateAddons(addons);
        } else if (!e.target.checked && hasElement) {
            addons.splice(index, 1);
            updateAddons(addons);
        }
    };

    const isChecked = props.data.insurance.addons.includes(props.name);

    return (
        <div data-ecom-borderbox="" className={`repeat-m-half ${props.isDisabled ? 'bg-accent' : ''}`}>
            <div data-ecom-columnrow="">
                <div className="column">
                    <div data-ecom-inputselection="checkbox center-input">
                        <input type="checkbox" id={props.id} disabled={props.isDisabled} checked={isChecked} onChange={handleCheckChange} />
                        <label htmlFor={props.id}>
                            <span className="text">
                                <span className="l-block">{props.title}</span>
                                <span className="l-block font-size-small">
                                    <button data-ecom-link="font-size-inherit" onClick={handleMoreInformationClick}>Visa {isExtended ? 'mindre' : 'mer'}</button>
                                </span>
                            </span>
                        </label>
                    </div>
                </div>
                <div className="column font-medium">{props.monthlyPrice}kr/mån</div>
            </div>

            { isExtended &&
                <div data-ecom-content="" className="m-t-half">
                    <p>{props.description}</p>
                </div>
            }
        </div>
    );
}

const InsuranceAlternativeChooser = (props: IInsuranceAlternativeChooserProps) => {
    const [ isExtended, setIsExtended ] = React.useState(false);

    const handleHasAddedInsuranceClick = (value: boolean) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: 'insurance',
            name: 'hasAddedInsurance',
            value
        }, () => {
            props.onProceedToNextStep();
        });
    }

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    }

    const insuranceOption = props.insuranceOptions.getInsuranceOption();
    const drivingDistanceText = getDrivingDistanceLabel(props.data.insurance.expectedDrivingDistance);

    const accordionItems = insuranceOption.items.map((i, index) => <AccordionItem key={index} {...i} />);
    const hasAccordionItems = accordionItems.length > 0;

    const allIncludedAddons = insuranceOption.addons.filter(a => props.data.insurance.addons.includes(a.name));
    const allExcludedAddons = [].concat(...allIncludedAddons.map(a => a.excludes));

    const addonItems = insuranceOption.addons.map((a, index) => {
        const isDisabled = allExcludedAddons.includes(a.name);
        return <AddonItem key={index} id={'insurance-addon-' + index} isDisabled={isDisabled} {...a} {...props} />;
    });

    const hasAddonItems = addonItems.length > 0;

    const encodedDescription = htmlEncode(insuranceOption.brand.description);
    const markdownDescription = marked(encodedDescription);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">{insuranceOption.brand.name}</h1>
                <div data-ecom-content="" dangerouslySetInnerHTML={{__html: markdownDescription}} />
            </section>

            <section className="page-section">
                <div data-ecom-columnrow="" className="font-size-small m-b-half">
                    <div className="column">
                        <div className="font-medium">Uppgifter</div>
                    </div>

                    <div className="column">
                        <button data-ecom-link="font-inerit" onClick={props.onShowInsuranceInformationDefinition}>Ändra</button>
                    </div>
                </div>

                <div className="l-inline-block m-r">
                    <i className="icon-profile m-r-half"></i>{props.data.insurance.personalNumber}
                </div>

                <div className="l-inline-block">
                    <i className="icon-mileage m-r-half"></i><span>{drivingDistanceText}</span>
                </div>
            </section>

            <section className="page-section page-section-accent">
                <div className="repeat-m-half">
                    <div data-ecom-box="light" className={isExtended ? 'is-extended' : ''}>
                        <h2 className="h6">{insuranceOption.price}{insuranceOption.unit}</h2>

                        <div data-ecom-content="">
                            <p>{insuranceOption.name}</p>
                        </div>

                        <div className="box-extend">
                            <div data-ecom-content="" className="m-b">
                                <p>{insuranceOption.description}</p>
                            </div>

                            <div data-ecom-content="" className="m-b">
                                <a data-ecom-link="" href={insuranceOption.conditions.url}>
                                    {insuranceOption.conditions.description}
                                    <i className="icon-link-external m-l-half"></i>
                                </a>
                            </div>

                            { hasAddonItems &&
                                <div className="m-b">
                                    {addonItems}
                                </div>
                            }

                            <div className="font-medium m-b">Försäkringen innehåller</div>

                            { hasAccordionItems &&
                                <div data-ecom-accordion="">
                                    <ul className="accordion">
                                        {accordionItems}
                                    </ul>
                                </div>
                            }
                        </div>

                        <div className="box-footer">
                            <div data-ecom-columnrow="">
                                <div className="column font-size-small">
                                    <button data-ecom-link="action font-size-inherit" className="l-block" onClick={handleMoreInformationClick}>
                                        {isExtended ? 'Mindre' : 'Mer'} information<i className={`m-l-mini ${isExtended ? 'icon-chevron-up' : 'icon-chevron-down'}`}></i>
                                    </button>
                                </div>

                                <div className="column">
                                    <button data-ecom-button="small" onClick={() => handleHasAddedInsuranceClick(true)}>
                                        Välj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-buttonnav="">
                    <div className="button-nav-item">
                        <button data-ecom-button="light full-width" onClick={() => handleHasAddedInsuranceClick(false)}>
                            Hoppa över detta steg
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default InsuranceAlternativeChooser;
