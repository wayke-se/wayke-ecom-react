import { IIpLookupResponse } from "../types";

const lookupIpAddress = (): Promise<IIpLookupResponse> => {
    const options = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    return fetch("https://api.ipify.org?format=json", options).then(
        (response: Response) => {
            return response.json();
        }
    );
};

export default lookupIpAddress;
