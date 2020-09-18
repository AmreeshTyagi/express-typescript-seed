import * as express from "express";
import { Oauth2 } from "../auth/oauth2";
import * as passport from "passport";
import {AuthManager} from "../managers/AuthManager";
import {Auth} from "../auth/auth";
import {BaseRouter} from "./BaseRouter";

export class AuthRouter extends BaseRouter {

    private authManager: AuthManager;

    constructor() {
        super();
        this.authManager = new AuthManager();
        this.buildRoutes();
    }

    public async localLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.authManager.logout(req.user);
            res.json(user);
        } catch(error) {
            next(error);
        }
    }

    public async githubLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.authManager.logout(req.user);
            res.json(user);
        } catch(error) {
            next(error);
        }
    }

    public async ssoLogin(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.authManager.logout(req.user);
            res.json(user);
        } catch(error) {
            next(error);
        }
    }

    public async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            const user = await this.authManager.logout(req.user);
            res.json(user);
        } catch(error) {
            next(error);
        }
    }

    private buildRoutes() {
        const oath = new Oauth2();
        this.router.post("/local/login", passport.authenticate('local'),this.localLogin.bind(this));
        this.router.post('/github/login', passport.authenticate('github'),this.githubLogin.bind(this));
        this.router.post("/sso/login", passport.authenticate('saml'),this.ssoLogin.bind(this));
        this.router.post("/logout", Auth.isAuthenticated(),  this.logout.bind(this));
    }



}