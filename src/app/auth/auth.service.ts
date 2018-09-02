import * as jwksRsa from 'jwks-rsa';
import { VerifyOptions } from 'jsonwebtoken';

import environment from '../../environments';

export class AuthService {

  static get jwksRsaOptions(): jwksRsa.Options {
    return {
      cache: true,
      jwksUri: environment.auth.jwksUri,
      rateLimit: true
    };
  }

  static get jwtVerifyOptions(): VerifyOptions {
    return {
      algorithms: [ 'RS256' ],
      audience: environment.auth.clientId,
      ignoreExpiration: false,
      issuer: environment.auth.domain,
    };
  }

  /**
   * Determine if user has permission specified.
   * @param {any} user - User object.
   * @param permission - Permission name.
   * @returns {boolean} - `true` if user has permission specified; `false` otherwise.
   */
  static hasPermission(user: any, permission: string): boolean {
    let hasPermission = false;

    if (user && permission && typeof permission === 'string') {
      const permissions = this.getPermissions(user);

      if (permissions && Array.isArray(permissions) && permissions.length > 0) {
        hasPermission = permissions.includes(permission);
      }
    }

    return hasPermission;
  }

  /**
   * Get user's App Metadata.
   * @param {any} user - User object.
   * @returns {any} - User's App Metadata.
   */
  private static getAppMetadata(user: any): any {
    let appMetadata = null;

    if (user) {
      const appMetadataPropertyName = `${environment.auth.namespace}/app_metadata`;

      appMetadata = this.getPropertyByName(user, appMetadataPropertyName);
    }

    return appMetadata;
  }

  /**
   * Get user's permissions.
   * @param {any} user - User object.
   * @returns {string[]} - User's permissions.
   */
  private static getPermissions(user: any): string[] {
    let permissions: string[];

    if (user) {
      const appMetadata = this.getAppMetadata(user);

      if (appMetadata) {
        const authorization =
          (Object.prototype.hasOwnProperty.call(appMetadata, 'authorization') && appMetadata.authorization) ?
            appMetadata.authorization : null;

        if (authorization) {
          permissions =
            (Object.prototype.hasOwnProperty.call(authorization, 'permissions') && authorization.permissions) ?
              authorization.permissions : null;
        }
      }
    }

    return permissions;
  }

  /**
   * Get object's property by name.
   * @param {any} obj - Target object.
   * @param {string} propertyName - Property name.
   * @returns {any} - Object property if defined; `undefined` otherwise.
   */
  private static getPropertyByName(obj: any, propertyName: string): any|undefined {
    return (
      obj &&
      propertyName && typeof propertyName === 'string' &&
      Object.prototype.hasOwnProperty.call(obj, propertyName) && obj[propertyName]
    ) ? obj[propertyName] : undefined;
  }
}
