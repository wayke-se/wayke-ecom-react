import React from "react";

import { IEcomContext, IEcomLifecycle, IEcomStore } from "../types";

export interface IAccessories
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle {}

export default (props: IAccessories) => {
    console.log("props: ", props);

    return (
        <div className="page-main">
            <section className="page-section">
                <h1 className="h6">Tillbehör</h1>
                <div data-ecom-content="">
                    <p>
                        Vill du utrusta din nya bil med något extra? Nedan
                        listas ett urval av tillbehör som passar till din bil.
                    </p>
                </div>
            </section>

            <section className="page-section page-section-accent">
                <div className="repeat-m">
                    <div data-ecom-box="light">
                        <div className="box-hero">
                            <img
                                src="http://placehold.it/400x200"
                                alt=""
                                className="box-hero-img"
                            />
                        </div>
                        <div className="repeat-m">
                            <div data-ecom-columnrow="" className="m-b">
                                <div className="column">
                                    <h2 className="h6 no-margin">HEADING</h2>
                                </div>
                                <div className="column minimal">
                                    <img
                                        src="http://placehold.it/120x20"
                                        alt=""
                                        className="l-block"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="repeat-m">
                            <div className="font-medium">PRICE</div>
                            <div className="font-size-small">
                                PRICE DESCRIPTION
                            </div>
                        </div>
                        <div data-ecom-content="" className="repeat-m">
                            <p>DESCRIPTION</p>
                        </div>
                        <div className="box-extend">
                            <div className="repeat-m">
                                <div data-ecom-content="">
                                    <p>EXTEND CONTENT</p>
                                </div>
                            </div>
                            <div className="repeat-m">
                                <div className="font-medium">Art.nr.</div>
                                <div>???</div>
                            </div>
                            <div className="repeat-m">
                                <a
                                    href="#"
                                    title=""
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    data-ecom-link=""
                                >
                                    Läs mer
                                    <i className="icon-link-external m-l-mini"></i>
                                </a>
                            </div>
                        </div>
                        <div className="box-footer">
                            <div data-ecom-columnrow="">
                                <div className="column font-size-small">
                                    <button
                                        data-ecom-link=""
                                        className="l-block demo-extend-btn"
                                    >
                                        Mer information
                                        <i className="icon-chevron-down m-l-mini"></i>
                                    </button>
                                </div>
                                <div className="column">
                                    <button data-ecom-button="small">
                                        Lägg till
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
