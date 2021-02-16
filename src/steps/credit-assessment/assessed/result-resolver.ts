import {
    CreditAssessmentDecision,
    CreditAssessmentRecommendation,
} from "@wayke-se/ecom";
import { CreditAssessmentResult } from "./types";

const resolveResultByRecommendation = (
    recommendation: CreditAssessmentRecommendation
) => {
    switch (recommendation) {
        case CreditAssessmentRecommendation.Approve:
            return CreditAssessmentResult.Approve;
        case CreditAssessmentRecommendation.Reject:
            return CreditAssessmentResult.Reject;
        default:
            return CreditAssessmentResult.AssessManually;
    }
};

const resolveResult = (
    decision: CreditAssessmentDecision,
    recommendation: CreditAssessmentRecommendation
): CreditAssessmentResult => {
    switch (decision) {
        case CreditAssessmentDecision.Approved:
            return CreditAssessmentResult.Approve;
        case CreditAssessmentDecision.Rejected:
            return CreditAssessmentResult.Reject;
        default:
            return resolveResultByRecommendation(recommendation);
    }
};

export default resolveResult;
