import { RACComparisonEnum } from "../enums/saml/RACComparisonEnum";
import { AuthnRequestBinding } from "../enums/saml/AuthnRequestBinding";

export class SAMLBehaviorSettings {
    additionalParams: object;
    additionalAuthorizeParams: object;
    identifierFormat: string;
    acceptedClockSkewMs: number;
    attributeConsumingServiceIndex: number;
    disableRequestedAuthnContext: boolean;
    authnContext: string[];
    racComparison: RACComparisonEnum;
    forceAuthn: boolean;
    providerName: string;
    skipRequestCompression: boolean;
    authnRequestBinding: AuthnRequestBinding;
    disableRequestACSUrl:boolean;
}
