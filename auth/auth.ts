/**
 * Module dependencies.
 */
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import * as ClientPasswordStrategy from "passport-oauth2-client-password";
import * as BearerStrategy from "passport-http-bearer";
import * as bcrypt from "bcrypt";
import {BasicStrategy} from "passport-http";
import {User} from "../models/entities/User";
import {AccessToken} from "../models/entities/AccessToken";
import {Client} from "../models/entities/Client";
import {sign, verify} from 'jsonwebtoken';
import {AuthError} from "../errors/AuthError";

const GitHubStrategy = require('passport-github').Strategy;
const MultiSamlStrategy = require('passport-saml/multiSamlStrategy');

export class Auth {

    static serializeUser() {
        passport.serializeUser(function (user: any, done) {
            done(null, user.id);
        });

        passport.deserializeUser(function (id: number, done) {
            User.findOne<User>({where: {id}}).then(function (user: User) {
                done(null, user);
            });
        });
    }

    /**
     * LocalStrategy
     *
     * This strategy is used to authenticate users based on a username and password.
     * Anytime a request is made to authorize an application, we must ensure that
     * a user is logged in before asking them to approve the request.
     */
    static useLocalStrategy() {
        passport.use(new LocalStrategy( async(userName, password, done) => {
            let user = await User.findOne<User>({where: {email: userName}});
            if(user) {
                const authorized = await this.comparePasswords(password, user.password);
                if(authorized) {
                    return done(null, user);
                } else {
                    return done(null, false)
                }
            } else {
                return done("No user found", false);
            }
        }));
    }

    static async comparePasswords(pass1: string | undefined, pass2: string | undefined): Promise<boolean> {
        if(pass1 && pass2) {
            return bcrypt.compare(pass1, pass2);
        } else {
            return false;
        }
    }

    /**
     * BearerStrategy
     *
     * This strategy is used to authenticate users based on an access token (aka a
     * bearer token).  The user must have previously authorized a client
     * application, which is issued an access token to make requests on behalf of
     * the authorizing user.
     */
    static useBearerStrategy() {
        passport.use(new BearerStrategy((token, done) => {
            AccessToken.findOne<AccessToken>({where: {token: token}}).then(accessToken => {
                if (accessToken) {
                    const jwtSecret: string | undefined = process.env.JWT_SECRET;
                    if(jwtSecret) {
                        verify(accessToken.token, jwtSecret, (err, decodedToken: any) => {
                            if (decodedToken && accessToken.userId === decodedToken.id) {
                                User.findOne({where: {id: accessToken.userId}}).then(user => {
                                    return done(null, user);
                                }).catch(error => {
                                    return done(new AuthError(error.message), false);
                                });
                            } else {
                                done(new AuthError(err.message), false);
                            }
                        });
                    }
                } else {
                    return done(new AuthError("Unauthorized"), false);
                }
            }).catch(function (error) {
                return done(new AuthError(error.message), false);
            });
        }));
    }


    static useGithubStrategy() {
        passport.use(new GitHubStrategy({
            clientID: 'GITHUB_CLIENT_ID',
            clientSecret: 'GITHUB_CLIENT_SECRET',
            callbackURL: "http://127.0.0.1:3000/auth/github/callback"
        }, (accessToken, refreshToken, profile, done) => {
            const githubId = profile.id;
            User.findOne<User>({ where: { id: githubId } }).then(user => {
                if (user) {
                    AccessToken.findOne<AccessToken>({ where: { userId: user.id } }).then(accessToken => {
                        if (accessToken) {
                            const jwtSecret: string | undefined = process.env.JWT_SECRET;
                            if (jwtSecret) {
                                verify(accessToken.token, jwtSecret, (err, decodedToken: any) => {
                                    if (decodedToken && accessToken.userId === decodedToken.id) {
                                        return done(null, accessToken);
                                    } else {
                                        return done(new AuthError(err.message), false);
                                    }
                                });
                            } else {
                                return done(new AuthError("JWT Secret undefined"), false);
                            }
                        } else {
                            const jwtSecret: string | undefined = process.env.JWT_SECRET;
                            if (jwtSecret) {
                                sign(user, jwtSecret, { expiresIn: "10h" }, (error, token) => {
                                    AccessToken.create({
                                        token: token,
                                        userId: user.id
                                    }).then((accessToken: AccessToken) => {
                                        return done(null, accessToken);
                                    }).catch(error => {
                                        return done(error, false);
                                    });
                                });
                            } else {
                                return done(new AuthError("JWT Secret undefined"), false);
                            }
                        }
                    });
                } else {
                    return done("No account found with email: " + profile.email);
                }
            });
        }
        ));
    }

    static useSamlStrategy() {
        passport.use(new MultiSamlStrategy(
            {
                passReqToCallback: true, //makes req available in callback
                getSamlOptions: function (request, done) {
                    // findProvider(request, function (err, provider) {
                    //     if (err) {
                    //         return done(err);
                    //     }
                    //     return done(null, provider.configuration);
                    // });
                }
            },
            function (req, profile, done) {
                // findByEmail(profile.email, function (err, user) {
                //     if (err) {
                //         return done(err);
                //     }
                //     return done(null, user);
                // });
            })
        );
    }
    // public static getLocalMiddleware() {
    //     return passport.authenticate('local', { session: false, failWithError: true }
    //         , function (err, user, info) {
    //             console.log(info);
    //         })
    // }

    public static isAuthenticated() {
        return passport.authenticate('bearer', {session: false, failWithError: true});
    }
    // public static getGithubMiddleware() {
    //     return passport.authenticate('github');
    // }
}








