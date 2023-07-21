export type ITenant = {
    id: string;
    code: string;
    name: string;
    description: string;
    logo_url: string;
    address: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    subscription_cost: number;
    additional_cost: number;
    access_enabled: boolean;
    billing_address: IAddress;
}

export type IAddress = {
    id: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
}