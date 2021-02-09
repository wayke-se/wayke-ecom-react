import { IPaymentLookupResponse } from "@wayke-se/ecom";
import { formatPercentage, formatPrice } from "../../../utils/helpers";

class CreditAssessedFormatter {
    private loanDetails: IPaymentLookupResponse;

    constructor(loanDetails: IPaymentLookupResponse) {
        this.loanDetails = loanDetails;
    }

    public getDownPayment() {
        let formattedDownPayment = formatPrice(
            this.loanDetails.getDownPaymentSpec().current
        );
        formattedDownPayment = `${formattedDownPayment} kr`;
        return formattedDownPayment;
    }

    public getMonthlyCost() {
        let formattedMonthlyCost = formatPrice(
            this.loanDetails.getCosts().monthlyCost
        );
        formattedMonthlyCost = `${formattedMonthlyCost} kr/mån`;
        return formattedMonthlyCost;
    }

    public getInterest() {
        let formattedInterest = formatPercentage(
            this.loanDetails.getInterests().interest
        );
        formattedInterest = `${formattedInterest} %`;
        return formattedInterest;
    }

    public getEffectiveInterest() {
        let formattedEffectiveInterest = formatPercentage(
            this.loanDetails.getInterests().effectiveInterest
        );
        formattedEffectiveInterest = `${formattedEffectiveInterest} %`;
        return formattedEffectiveInterest;
    }

    public getDuration() {
        const formattedDuration = `${
            this.loanDetails.getDurationSpec().current
        } mån`;
        return formattedDuration;
    }
}

export default CreditAssessedFormatter;
