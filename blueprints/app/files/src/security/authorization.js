import privilegeChecker from 'privilege-checker';

class AuthorizationError extends Error {
    constructor(...args) {
        super(...args);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthorizationError);
        }
    }
}

/**
 * Checks if user privilege map has required privilege.
 *
 * @param {String} availablePrivileges User priviliges bitmap
 * @param {Number} requiredPrivilege Privilege required.
 */
function authorize(availablePrivileges, requiredPrivilege) {
    if (privilegeChecker(availablePrivileges, requiredPrivilege)) {
        return true;
    }

    throw new AuthorizationError('User has no required privilege.');
}

export { authorize, AuthorizationError };
