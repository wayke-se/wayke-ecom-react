import React from "react";

import {
    IEcomContext,
    IEcomExternalProps,
    IEcomLifecycle,
    IEcomStore,
} from "../../types";

import View from "./view";

interface IProps
    extends IEcomContext,
        IEcomStore,
        IEcomLifecycle,
        IEcomExternalProps {}

const Presenter = ({}: IProps) => <View />;

export default Presenter;
