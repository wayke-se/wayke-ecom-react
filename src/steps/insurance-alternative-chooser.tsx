import React from "react";

import { IEcomLifecycle, IEcomStore, IEcomContext } from "../types";

import { getDrivingDistanceLabel } from "../utils/insurance";

import StoreAction from "../constants/store-action";
import UserEvent from "../constants/user-event";

import AccordionItem from "./insurance-alternative-accordion";
import AddonItem from "./insurance-alternative-item";

export interface IInsuranceAlternativeChooserProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: IInsuranceAlternativeChooserProps) => {
    const [isExtended, setIsExtended] = React.useState(false);

    const handleHasAddedInsuranceClick = (hasAddedInsurance: boolean) => {
        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "insurance",
                name: "hasAddedInsurance",
                value: hasAddedInsurance,
            },
            () => {
                if (hasAddedInsurance) {
                    props.onIncompleteUserEvent(UserEvent.INSURANCE_ADDED);
                } else {
                    props.onIncompleteUserEvent(UserEvent.INSURANCE_SKIPPED);
                }

                props.onProceedToNextStep();
            }
        );
    };

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    };

    const insuranceOption = props.insuranceOptions.getInsuranceOption();
    const drivingDistanceText = getDrivingDistanceLabel(
        props.data.insurance.expectedDrivingDistance
    );

    const accordionItems = insuranceOption.items.map((i, index) => (
        <AccordionItem key={index} {...i} />
    ));
    const hasAccordionItems = accordionItems.length > 0;

    const allIncludedAddons = insuranceOption.addons.filter((a) =>
        props.data.insurance.addons.includes(a.name)
    );
    const allExcludedAddons = [].concat(
        ...allIncludedAddons.map((a) => a.excludes)
    );

    const addonItems = insuranceOption.addons.map((a, index) => {
        const isDisabled = allExcludedAddons.includes(a.name);
        return (
            <AddonItem
                key={index}
                id={`insurance-addon-${index}`}
                isDisabled={isDisabled}
                {...a}
                {...props}
            />
        );
    });

    const hasAddonItems = addonItems.length > 0;

    const onChooseInsurance = () => handleHasAddedInsuranceClick(true);
    const onSkipInsurance = () => handleHasAddedInsuranceClick(false);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">{insuranceOption.brand.name}</h1>
            </section>

            <section className="page-section">
                <div
                    data-ecom-columnrow=""
                    className="font-size-small m-b-half"
                >
                    <div className="column">
                        <div className="font-medium">Uppgifter</div>
                    </div>

                    <div className="column">
                        <button
                            data-ecom-link="font-inerit"
                            onClick={props.onShowInsuranceInformationDefinition}
                        >
                            Ändra
                        </button>
                    </div>
                </div>

                <div className="l-inline-block m-r">
                    <i className="icon-profile m-r-half" />
                    {props.data.insurance.personalNumber}
                </div>

                <div className="l-inline-block">
                    <i className="icon-mileage m-r-half" />
                    <span>{drivingDistanceText}</span>
                </div>
            </section>

            <section className="page-section page-section-accent">
                <div className="repeat-m-half">
                    <div
                        data-ecom-box="light"
                        className={isExtended ? "is-extended" : ""}
                    >
                        <h2 className="h6">
                            {insuranceOption.price} {insuranceOption.unit}
                        </h2>

                        <div data-ecom-content="">
                            <p>{insuranceOption.name}</p>
                        </div>

                        <div className="box-extend">
                            <div data-ecom-content="" className="m-b">
                                <p>{insuranceOption.description}</p>
                            </div>

                            <div data-ecom-content="" className="m-b">
                                <a
                                    data-ecom-link=""
                                    href={insuranceOption.conditions.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {insuranceOption.conditions.description}
                                    <i className="icon-link-external m-l-half" />
                                </a>
                            </div>

                            {hasAddonItems && (
                                <div className="m-b">{addonItems}</div>
                            )}

                            <div className="font-medium m-b">
                                Försäkringen innehåller
                            </div>

                            {hasAccordionItems && (
                                <div data-ecom-accordion="">
                                    <ul className="accordion">
                                        {accordionItems}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="box-footer">
                            <div data-ecom-columnrow="">
                                <div className="column font-size-small">
                                    <button
                                        data-ecom-link="action font-size-inherit"
                                        className="l-block"
                                        onClick={handleMoreInformationClick}
                                    >
                                        {isExtended ? "Mindre" : "Mer"}{" "}
                                        information
                                        <i
                                            className={`m-l-mini ${
                                                isExtended
                                                    ? "icon-chevron-up"
                                                    : "icon-chevron-down"
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="column">
                                    <button
                                        data-ecom-button="small"
                                        onClick={onChooseInsurance}
                                    >
                                        Välj
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <button
                    data-ecom-button="full-width light"
                    onClick={onSkipInsurance}
                >
                    Hoppa över detta steg
                </button>
            </section>
        </div>
    );
};
