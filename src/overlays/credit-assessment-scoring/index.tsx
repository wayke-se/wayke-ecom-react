import React from "react";
import { IEcomContext, IEcomStore } from "../../types";

import Base from "./base";

interface IProps extends IEcomContext, IEcomStore {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CreditAssessmentScoring = (props: IProps) => <Base />;

export default CreditAssessmentScoring;
