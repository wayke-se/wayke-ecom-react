import { IAccessory } from "@wayke-se/ecom/dist-types/orders/types";
import React, { useEffect } from "react";
import marked from "marked";

import { addSizeQuery } from "../utils/image";
import { htmlEncode } from "../utils/encode";
import { IEcomStore } from "../types";
import StoreAction from "../constants/store-action";

interface IAccessoryProps extends IEcomStore {
    accessory: IAccessory;
}

const markedRenderer = new marked.Renderer();
const linkRenderer = markedRenderer.link;

markedRenderer.link = (href: any, title: any, text: any) => {
    const html = linkRenderer.call(markedRenderer, href, title, text);
    return html.replace(/<a/, '<a target="_blank"');
};

export default (props: IAccessoryProps) => {
    const [isExtended, setIsExtended] = React.useState(false);
    const [isChosen, setChosen] = React.useState(false);
    const accessory = props.accessory;

    useEffect(() => {
        if (accessory && props.data.chosenAccessories) {
            const ids = [...props.data.chosenAccessories.ids];
            let foundIdx = ids.findIndex((id) => id === accessory.id);
            if (isChosen && foundIdx < 0) {
                ids.push(accessory.id);
                updateAccessoryIds(ids);
            } else if (!isChosen && foundIdx > -1) {
                ids.splice(foundIdx, 1);
                updateAccessoryIds(ids);
            }
        }
    }, [isChosen, accessory, props.data.chosenAccessories]);

    const updateAccessoryIds = (newIds: string[]) => {
        props.dispatchStoreAction(StoreAction.UPDATE_NAMED_VALUE, {
            type: "chosenAccessories",
            name: "ids",
            value: newIds,
        });
    };

    const handleMoreInformationClick = () => {
        setIsExtended(!isExtended);
    };

    let heroImgUrlResized = "";
    if (accessory.media.length > 0)
        heroImgUrlResized = addSizeQuery(accessory.media[0].url, 400, 200);

    let logoImgUrlResized = "";
    if (accessory.logoUrl)
        logoImgUrlResized = addSizeQuery(accessory.logoUrl, 96, 8);

    let markdownLongDescription;

    if (accessory.longDescription) {
        const encodedlongDescription = htmlEncode(accessory.longDescription);
        markdownLongDescription = marked(encodedlongDescription, {
            renderer: markedRenderer,
        });
    }

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
                            <h2 className="h6 no-margin">{accessory.name}</h2>
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
                    <div className="font-medium">{accessory.price} kr</div>
                    <div className="font-size-small">Kontantpris</div>
                </div>
                <div data-ecom-content="" className="repeat-m">
                    <p>{accessory.shortDescription}</p>
                </div>
                <div className="box-extend">
                    <div className="repeat-m">
                        {markdownLongDescription && (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: markdownLongDescription,
                                }}
                            />
                        )}
                    </div>
                    <div className="repeat-m">
                        <div className="font-medium">Art.nr.</div>
                        <div>{accessory.articleNumber}</div>
                    </div>
                    <div className="repeat-m">
                        {accessory.productPageLink && (
                            <a
                                href={accessory.productPageLink}
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
