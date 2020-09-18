import {SAMLAuthenticationProvider} from "../entities/SAMLAuthenticationProvider";
import { Dictionary } from "async";

export class SAMLProviderDTO {

    public id: string;
    public name: string;


    constructor(provider: SAMLAuthenticationProvider) {
        this.id = provider.id;
        this.name=provider.name;
    }
}