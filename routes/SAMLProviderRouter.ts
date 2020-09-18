import * as express from "express";
import { User } from "../models";
import { SAMLProviderManager } from "../managers/SAMLProviderManager";
import { Auth } from "../auth/auth";
import { SAMLProviderDTO } from "../models/dtos/SAMLProviderDTO";
import{RACComparisonEnum} from "../models/enums/saml/RACComparisonEnum";
import { Roles } from "../auth/roles";
import * as multer from 'multer';
import { BaseRouter } from "./BaseRouter";
var validateInput = require('express-validation');
var SAMLProvidercreate =require('../validators/SAMLProvider.create');
import { SAMLAuthenticationProvider } from "../models/entities/SAMLAuthenticationProvider";
import { SAMLBehaviorSettings } from "../models/entities/SAMLBehaviorSettings";

export class SAMLProviderRouter extends BaseRouter {

    private samlProviderManager: SAMLProviderManager;
    private uploadHandler: any;

    constructor() {
        super();
        this.samlProviderManager = new SAMLProviderManager();
        this.uploadHandler = multer({ storage: multer.memoryStorage() }); // configure multer to use memory storage
        this.buildRoutes();
    }

    public async getSAMLProviders(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const providers = await this.samlProviderManager.getSAMLProviders();
            res.json(providers);
        } catch (error) {
            next(error);
        }
    }

    public async createSAMLProvider(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const newProvider= new SAMLAuthenticationProvider(req.body.provider);
            // const newBehavior=new SAMLBehaviorSettings();
            // newBehavior.identifierFormat=req.body.provider.samlBehaviorSettings.identifierFormat;
           // newBehavior.racComparison=RACComparisonEnum.MAXIMUM;
            // newProvider.samlBehaviorSettings=req.body.provider.samlBehaviorSettings;
            // newProvider.samlBehaviorSettings.racComparison=RACComparisonEnum.BETTER;
            const provider = await this.samlProviderManager.createProvider(newProvider);
            res.json(provider);
        } catch (error) {
            next(error);
        }
    }

    // public async put(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         const user = await this.userManager.updateUser(req.params.id, req.body.email, req.body.firstName, req.body.lastName, req.body.role, req.body.profilePicUrl);
    //         res.json(new UserDTO(user));
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // public async delete(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         const user = await this.userManager.deleteUser(req.params.id);
    //         res.json(user);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // public async getByToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         res.json(new UserDTO(req.user));
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // public async changePassword(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         const user = await this.userManager.updatePassword(req.params.id, req.body.currentPassword, req.body.newPassword);
    //         res.json(new UserDTO(user));
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // public async uploadProfileImage(req: express.Request, res: express.Response, next: express.NextFunction) {
    //     try {
    //         const user = await this.userManager.updateProfileImage(req.params.id, req.file);
    //         res.json(new UserDTO(user));
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    private buildRoutes() {
        this.router.get("/providers", this.getSAMLProviders.bind(this));
        this.router.post("/provider/create", validateInput(SAMLProvidercreate),this.createSAMLProvider.bind(this));
        // this.router.delete("/:id", Auth.isAuthenticated(), Roles.connectRoles.can('modify user'), this.delete.bind(this));
        // this.router.put("/:id", Auth.isAuthenticated(), Roles.connectRoles.can('modify user'), this.put.bind(this));
        // this.router.get("/current", Auth.isAuthenticated(), this.getByToken.bind(this));
        // this.router.put("/:id/password", Auth.isAuthenticated(), Roles.connectRoles.can('modify user'), this.changePassword.bind(this));
        // this.router.put("/:id/profileImage", Auth.isAuthenticated(), Roles.connectRoles.can('modify user'), this.uploadHandler.single('profileImage'), this.uploadProfileImage.bind(this));
    }
}