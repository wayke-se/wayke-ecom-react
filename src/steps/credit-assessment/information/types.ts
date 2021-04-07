export interface IInfoItem {
    value: string;
    onChange: (value: string) => void;
}

export interface IValidatableInfoItem extends IInfoItem {
    displayError: boolean;
    onFinish: () => void;
}
