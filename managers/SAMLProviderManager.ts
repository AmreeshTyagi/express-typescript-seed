import { User } from "../models/entities/User";
import { SAMLAuthenticationProvider } from "../models/entities/SAMLAuthenticationProvider";
import { AccessToken } from "../models/entities/AccessToken";
import { SAMLProviderDTO } from "../models/dtos/SAMLProviderDTO";
import { NotFoundError } from "../errors/NotFoundError";
import { RACComparisonEnum } from "models/enums/saml/RACComparisonEnum";

export class SAMLProviderManager {

    constructor() {
    }

    public async getSAMLProviders(): Promise<any> {
        const providers = await SAMLAuthenticationProvider.findAll<SAMLAuthenticationProvider>();
        if (providers) {
            return providers;
        } else {
            throw new NotFoundError("No provider found");
        }
    }

    public async getProviderByName(name: string): Promise<any> {
        const provider = await SAMLAuthenticationProvider.findOne<SAMLAuthenticationProvider>({ where: { name: name } });
        if (provider) {
            return provider;
        } else {
            throw new NotFoundError("No provider found for the provided name");
        }
    }

    public async createProvider(provider: SAMLAuthenticationProvider): Promise<any> {
        return provider.save();
    }

    public async getAccessTokenForUser(userId: string): Promise<any> {
        const accessToken = await AccessToken.findOne({ where: { userId: userId } });
        if (accessToken) {
            return accessToken;
        } else {
            throw new NotFoundError("No access token found for the provided user");
        }
    }

    public async logout(user: User): Promise<any> {


        const accessToken = await AccessToken.findOne({ where: { userId: user.id } });
        if (accessToken) {
            return accessToken.destroy();
        } else {
            throw new NotFoundError("No access token found for the provided user");
        }
    }
}