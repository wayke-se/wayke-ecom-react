import React from "react";
import { DeliveryType, IDeliveryOption } from "@wayke-se/ecom";

import {
    IEcomContext,
    IEcomLifecycle,
    IEcomStore,
    IEcomExternalProps,
} from "../types";
import StoreAction from "../constants/store-action";
import UserEvent from "../constants/user-event";
import DeliveryMethodItem from "./delivery-method-item";
import { isAvailable } from "../utils/delivery";
import CustomerInformationInputType from "../constants/customer-information-input-type";

export interface IPaymentMethodChooserProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

const getUserEventFromDeliveryType = (type: DeliveryType): UserEvent | null => {
    switch (type) {
        case DeliveryType.Pickup:
            return UserEvent.DELIVERY_TYPE_PICKUP_CHOSEN;
        case DeliveryType.Delivery:
            return UserEvent.DELIVERY_TYPE_DELIVERY_CHOSEN;
        default:
            return null;
    }
};

const sort = [DeliveryType.Delivery, DeliveryType.Pickup];

export default (props: IPaymentMethodChooserProps) => {
    const onMethodClick = (deliveryOption: IDeliveryOption) => {
        props.dispatchStoreAction(StoreAction.INTERACT_UPDATE_SPECIFIC, {
            type: "delivery",
            name: "type",
        });

        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "delivery",
                name: "type",
                value: deliveryOption.type,
            },
            () => {
                const userEvent = getUserEventFromDeliveryType(
                    deliveryOption.type
                );
                if (userEvent !== null) props.onIncompleteUserEvent(userEvent);

                props.onProceedToNextStep();
            }
        );
    };

    const onSkipDeliveryType = () => {
        props.dispatchStoreAction(
            StoreAction.UPDATE_NAMED_VALUE,
            {
                type: "delivery",
                name: "type",
                value: DeliveryType.None,
            },
            () => {
                const userEvent = getUserEventFromDeliveryType(
                    DeliveryType.None
                );
                if (userEvent !== null) props.onIncompleteUserEvent(userEvent);

                props.onProceedToNextStep();
            }
        );
    };

    // TODO Improve... use address from non bank id solution as well.
    const hasCompletedBankId =
        !!props.bankIdCollect && props.bankIdCollect.isCompleted();
    const address = hasCompletedBankId
        ? props.bankIdCollect.getAddress()
        : null;
    const isAutomaticAddress =
        props.data.customer.inputType == CustomerInformationInputType.AUTOMATIC;
    const items = props.orderOptions
        .getDeliveryOptions()
        .sort((a, b) => sort.indexOf(a.type) - sort.indexOf(b.type))
        .map((option) => (
            <DeliveryMethodItem
                key={option.type}
                address={address}
                deliveryOption={option}
                onDeliveryOptionClick={onMethodClick}
                {...props}
            />
        ));

    const hasAvailableOptions =
        props.orderOptions
            .getDeliveryOptions()
            .filter((option) =>
                isAvailable(option, address, isAutomaticAddress)
            ).length > 0;

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Leverans</h1>
                <div data-ecom-content="">
                    <p>Hur vill du ha din nya bil levererad?</p>
                </div>
            </section>

            <section className="page-section">
                <div data-ecom-optionlist="">
                    <ul className="option-list">{items}</ul>
                </div>
            </section>

            {!hasAvailableOptions && (
                <section className="page-section page-section-bottom">
                    <div data-ecom-buttonnav="">
                        <div className="button-nav-item">
                            <button
                                data-ecom-button="full-width"
                                onClick={onSkipDeliveryType}
                            >
                                Fortsätt utan leveranssätt
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
