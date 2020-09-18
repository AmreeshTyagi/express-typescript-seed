import {AllowNull, BeforeSave, Column, Table, Unique, DataType,Default, Validator} from 'sequelize-typescript';
import {BaseModel} from "./BaseModel";
import {SAMLBehaviorSettings} from "./SAMLBehaviorSettings";
import {SAMLValidationSettings} from "./SAMLValidationSettings";
import { Dictionary } from 'async';

@Table
export class SAMLAuthenticationProvider extends BaseModel<SAMLAuthenticationProvider> {

    @AllowNull(false)
    @Unique
    @Column
    name: string;

    @AllowNull(false)
    @Unique
    @Column
    callbackUrl: string

    @AllowNull(true)
    @Column
    path: string

    @AllowNull(true)
    @Column
    protocol: string

    @AllowNull(true)
    @Column
    host: string

    @AllowNull(true)
    @Column
    entryPoint: string

    @AllowNull(false)
    @Column
    issuer: string
    
    @AllowNull(true)
    @Column
    audience: string

    @AllowNull(true)
    @Column
    cert: string

    @AllowNull(true)
    @Column
    privateCert: string

    @AllowNull(true)
    @Column
    decryptionPvk: string

    @AllowNull(true)
    @Column
    signatureAlgorithm: string

    @AllowNull(true)
    @Column
    digestAlgorithm: string

    @Column({ type: DataType.ARRAY(DataType.STRING) })
    xmlSignatureTransforms: string[]

    @AllowNull(true)
    @Column
    logoutUrl: string

    @AllowNull(true)
    @Column({ type: DataType.JSON })
    additionalLogoutParams: object

    @AllowNull(true)
    @Column
    logoutCallbackUrl: string

    @Column(DataType.JSON)
    samlBehaviorSettings: SAMLBehaviorSettings

    @Column(DataType.JSON)
    samlValidationSettings: SAMLValidationSettings
}
