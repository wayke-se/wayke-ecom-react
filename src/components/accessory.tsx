import { IAccessory } from "@wayke-se/ecom/dist-types/orders/types";
import React from "react";

import { addSizeQuery } from "../utils/image";

interface AccessoryProps {
    accessory: IAccessory;
}

export default (props: AccessoryProps) => {
    const [isExtended, setIsExtended] = React.useState(false);
    const [isChosen, setChosen] = React.useState(false);

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    };

    let heroImgUrlResized = "";
    if (props.accessory.media.length > 0)
        heroImgUrlResized = addSizeQuery(
            props.accessory.media[0].url,
            400,
            200
        );

    let logoImgUrlResized = "";
    if (props.accessory.logoUrl)
        logoImgUrlResized = addSizeQuery(props.accessory.logoUrl, 96, 8);

    return (
        <div className="repeat-m">
            <div
                data-ecom-box="light"
                className={isExtended ? "is-extended" : ""}
            >
                <div className="box-hero">
                    <img
                        src={heroImgUrlResized}
                        alt=""
                        className="box-hero-img"
                    />
                </div>
                <div className="repeat-m">
                    <div data-ecom-columnrow="" className="m-b">
                        <div className="column">
                            <h2 className="h6 no-margin">
                                {props.accessory.name}
                            </h2>
                        </div>
                        <div className="column minimal">
                            <img
                                src={logoImgUrlResized}
                                alt=""
                                className="l-block"
                            />
                        </div>
                    </div>
                </div>
                <div className="repeat-m">
                    <div className="font-medium">
                        {props.accessory.price} kr
                    </div>
                    <div className="font-size-small">
                        Kontantpris inkl. montering (DETTA FÄLT ÄR EJ ÄNNU
                        IMPLEMENTERAT)
                    </div>
                </div>
                <div data-ecom-content="" className="repeat-m">
                    <p>{props.accessory.shortDescription}</p>
                </div>
                <div className="box-extend">
                    <div className="repeat-m">
                        {props.accessory.longDescription}
                    </div>
                    <div className="repeat-m">
                        <div className="font-medium">Art.nr.</div>
                        <div>{props.accessory.articleNumber}</div>
                    </div>
                    <div className="repeat-m">
                        {props.accessory.productPageLink && (
                            <a
                                href={props.accessory.productPageLink}
                                title="test"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                data-ecom-link=""
                            >
                                Läs mer
                                <i className="icon-link-external m-l-mini"></i>
                            </a>
                        )}
                    </div>
                </div>
                <div className="box-footer">
                    <div data-ecom-columnrow="">
                        <div className="column font-size-small">
                            <button
                                data-ecom-link="action font-size-inherit"
                                className="l-block"
                                onClick={handleMoreInformationClick}
                            >
                                {isExtended ? "Mindre" : "Mer"} information
                                <i
                                    className={`m-l-mini ${
                                        false
                                            ? "icon-chevron-up"
                                            : "icon-chevron-down"
                                    }`}
                                />
                            </button>
                        </div>
                        <div className="column">
                            {isChosen ? (
                                <button
                                    data-ecom-button="small light"
                                    onClick={() => setChosen(false)}
                                >
                                    <span className="button-section">
                                        <i className="icon-check no-margin"></i>
                                    </span>
                                    <span className="button-section">Vald</span>
                                </button>
                            ) : (
                                <button
                                    data-ecom-button="small"
                                    onClick={() => setChosen(true)}
                                >
                                    Välj
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
