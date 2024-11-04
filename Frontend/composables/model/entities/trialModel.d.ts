import type { BaseResponse } from "../index";

interface TrialData {
    id: string;
    email: string;
    free_trial: boolean;
}

interface GetTrialResponse extends BaseResponse {
    data: {
        trial: TrialData;
        source: string;
    };
}

export type { GetTrialResponse, TrialData };
