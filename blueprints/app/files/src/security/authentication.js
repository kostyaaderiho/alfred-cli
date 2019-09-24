import { http } from '@workhuman/axios-auth';

class AuthenticationError extends Error {
    constructor(...args) {
        super(...args);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticationError);
        }
    }
}

/**
 * Authentication.
 *
 * Makes JWT Authenication, using current microsites session.
 * Throw AuthenticationError if token request fails at some stage.
 */
function authenticate() {
    return http.getAuthToken().then(
        ({ data }) => setAuthenticationData(data),
        () => {
            throw new AuthenticationError('Session expired');
        }
    );
}

/**
 * @todo I think these things can happen in authentication module.
 * See: https://git1.corp.globoforce.com/npm/canjs-auth
 *
 * Saves authentication data to session storage from token.
 * Also configures can-router to get data from session storage if missed.
 *
 * @param {Object} authData JWTAuth response.
 * @returns {Object} authData JWTAuth response.
 */
function setAuthenticationData(authData) {
    sessionStorage.setItem('token', authData.token);
    sessionStorage.setItem('token_expires', authData.expires);
    sessionStorage.setItem('clientId', authData.clientId);
    sessionStorage.setItem('client', authData.client);

    return authData;
}

export { authenticate, AuthenticationError };
