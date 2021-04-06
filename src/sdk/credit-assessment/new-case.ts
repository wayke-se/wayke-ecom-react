import {
    creditAssessment,
    ICreditAssessmentCase,
    ICreditAssessmentInquiry,
} from "@wayke-se/ecom";

export default (
    inquiry: ICreditAssessmentInquiry,
    callback: (response: ICreditAssessmentCase | Error | null) => void
) => {
    try {
        creditAssessment
            .newCase(inquiry)
            .then((response: ICreditAssessmentCase) => {
                callback(response);
            })
            .catch(callback);
    } catch (err) {
        if (err instanceof TypeError) {
            callback(err);
        }
    }
};
