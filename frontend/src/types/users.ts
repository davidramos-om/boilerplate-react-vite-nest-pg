import { IBaseModel } from "./model";
import { ITenant } from "./tenants";

export enum USER_TYPE {
    PORTAL_ROOT = "PORTAL_ROOT",
    COMPANY_USER = "COMPANY_USER"
}

export const USER_TYPE_OPTIONS = [
    {
        label: "Administrador de Portal",
        value: USER_TYPE.PORTAL_ROOT,
    },
    {
        label: "Usuario de Corporativo",
        value: USER_TYPE.COMPANY_USER,
    }
];

export type CreateUserInput = {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    tenant_id: string;
    type: USER_TYPE;
    image_url: string;
    roles: string[];
}

export type IUser = IBaseModel & CreateUserInput & {
    image_url: string
    status: string
    tenant: ITenant | null
    roles: any[]
}
