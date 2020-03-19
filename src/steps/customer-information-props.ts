import {
    IEcomLifecycle,
    IEcomStore,
    IEcomContext,
    IEcomExternalProps,
} from "../types";

export interface ICustomerInformationDetailsProps
    extends IEcomExternalProps,
        IEcomContext,
        IEcomStore,
        IEcomLifecycle {}
