import {
    AuthMethod,
    creditAssessment,
    ICreditAssessmentSignResponse,
} from "@wayke-se/ecom";

export default (
    caseId: string,
    callback: (response: ICreditAssessmentSignResponse | Error | null) => void
) => {
    const request = {
        caseId,
        method: AuthMethod.SameDevice,
    };

    creditAssessment.signCase(request).then(callback).catch(callback);
};
