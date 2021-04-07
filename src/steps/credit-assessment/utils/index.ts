import { IPaymentOption } from "@wayke-se/ecom";

import { addSizeQuery } from "../../../utils/image";

export const getScaledLogoOfPaymentOption = (option: IPaymentOption) => {
    const logo = option.logo;
    const scaledLogo = addSizeQuery(logo, 100, 60);
    return scaledLogo;
};
