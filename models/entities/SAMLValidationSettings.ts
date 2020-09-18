import {AllowNull, BeforeSave, Column, Table, Unique, DataType,Default} from 'sequelize-typescript';
import {Utils} from "../../utils";
import {BaseModel} from "./BaseModel";
import {RACComparisonEnum} from "../enums/saml/RACComparisonEnum";
import {AuthnRequestBinding} from "../enums/saml/AuthnRequestBinding";
import { Dictionary } from 'async';

export class SAMLValidationSettings {
    validateInResponseTo: boolean
    requestIdExpirationPeriodMs: number
    cacheProvider: string
    idpIssuer: string
}
