/*
 * @Author: Amreesh Tyagi 
 * @Date:  2020-02-14 05:03:15 
 * @Last Modified by: Amreesh Tyagi
 * @Last Modified time: 2020-02-14 13:52:49
 */

import Joi = require('joi');
import  {RACComparisonEnum} from '../models/enums/saml/RACComparisonEnum'
import  {AuthnRequestBinding} from '../models/enums/saml/AuthnRequestBinding'

const samValidationSettings = Joi.object().keys({
    validateInResponseTo: Joi.boolean(),
    requestIdExpirationPeriodMs: Joi.number().default(8),
    cacheProvider: Joi.string().default('in-memory'),
    idpIssuer: Joi.string()
});

const samlBehaviorSettings=Joi.object().keys({
    additionalParams: Joi.object(),
    additionalAuthorizeParams: Joi.object(),
    identifierFormat: Joi.string().default('urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'),
    acceptedClockSkewMs: Joi.number().min(-1).default(0),
    attributeConsumingServiceIndex: Joi.number(),
    disableRequestedAuthnContext: Joi.boolean(),
    authnContext: Joi.array().items(Joi.string()).default(['urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport']),
    racComparison: Joi.string().valid([RACComparisonEnum.BETTER,RACComparisonEnum.EXACT,RACComparisonEnum.MAXIMUM,RACComparisonEnum.MINIMUM]).default(RACComparisonEnum.EXACT),
    forceAuthn: Joi.boolean(),
    providerName: Joi.string(),
    skipRequestCompression: Joi.boolean(),
    authnRequestBinding: Joi.string().valid([AuthnRequestBinding.HTTP_POST,AuthnRequestBinding.HTTP_REDIRECT]).default(AuthnRequestBinding.HTTP_POST),
    disableRequestACSUrl:Joi.boolean().default(false)
});
// let samlBehaviorSettings=new SAMLBehaviorSettings();
const samlProvider=Joi.object().keys({
    name: Joi.string().required(),
    callbackUrl: Joi.string().required(),
    path: Joi.string(),
    protocol: Joi.string(),
    host: Joi.string(),
    entryPoint: Joi.string(),
    issuer: Joi.string(),
    audience: Joi.string(),
    cert: Joi.string(),
    privateCert: Joi.string(),
    decryptionPvk: Joi.string(),
    signatureAlgorithm: Joi.string(),
    digestAlgorithm: Joi.string(),
    xmlSignatureTransforms: Joi.array().items(Joi.string()).default(['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#']),
    logoutUrl: Joi.string(),
    additionalLogoutParams: Joi.object(),
    logoutCallbackUrl: Joi.string(),
    samlBehaviorSettings: samlBehaviorSettings,
    samlValidationSettings: samValidationSettings,
});
module.exports = {
    options: {
        flatten: false,
        status: 422,
        statusText: 'Unprocessable Entity'
    },
    headers: {
        authorization: Joi.string().required()
    },
    body: {
        provider:samlProvider
        // userName: Joi.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).min(8).max(100).required(),
        // password: Joi.string().regex(/[a-zA-Z0-9]{6,30}/).required(),
        // firstName: Joi.string().min(1).max(50),
        // lastName: Joi.string().min(1).max(50),
        // displayName: Joi.string().min(1).max(50),
        // phoneNumber: Joi.string().regex(/^[789]\d{9}$/).length(10),
        // role: Joi.string().regex(/^[A-z0-9]+$/).min(2).max(50),
        // domain: Joi.string().regex(/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/).required(),
        // options: Joi.string().min(2).max(100)
        // consumer_key: Joi.string().required(),
        // consumer_secret: Joi.string().required(),
        // applicationId: Joi.string().min(5).max(100)
    }
};