// POLYFILLS
import 'focus-visible';

// APPLICATION DEPENDENCIES
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { axiosInstance } from '@workhuman/axios-auth';

import { authenticate } from '~/security/authentication';
import { authorize, AuthorizationError } from '~/security/authorization';
import { privileges } from '~/security/constants';
import person from '~/models/person.model';

import App from '~/components/App/App';
import './index.scss';

// #if process.env.NODE_ENV === 'DEVELOPMENT:MOCK'
import setupMocks from '~/mocks';
setupMocks(axios);
setupMocks(axiosInstance);
// #endif

/**
 * Application identifier.
 * Used to track what application currently requested
 */
const { applicationId } = document.documentElement.dataset;
let authenticationData = null;
let loggedInPerson = null;

/**
 * Authentication.
 *
 * Throw 'Unauthenticated' if token request fails at some stage.
 */
authenticate()
    .then(authData => {
        authenticationData = authData;
        return authData;
    })
    /**
     * Get currently logged in user info.
     */
    .then(authData => person.get({ id: authData.userId }))
    .then(personResponse => {
        loggedInPerson = personResponse.data;
        return loggedInPerson;
    })
    /**
     * Authorization.
     *
     * NOTE:
     * Most applications require authorization,
     * If there is no such need, its up to you to remove this verification,
     * In order to support your own application privilege, you should extend ./security/constants.js file.
     *
     * Render views based on currently logged in user.
     * If user has required privilege, render the application,
     * if no - throw "Unauthorized" error.
     */
    .then(loggedInPerson => {
        if (authorize(loggedInPerson.privilege, privileges[applicationId])) {
            applicationWillMount({ authenticationData });
            mountApplication({
                applicationId,
                authenticationData,
                loggedInPerson
            });
        }
    })
    /**
     * Catch errors that happened during application bootstrap.
     *
     * Unauthenticated - redirect to login page.
     * Unauthorized - redirect to login page.
     * Default - retrow error, so it won't stay silent in this catch.
     */
    .catch(error => {
        switch (error.constructor) {
            case AuthorizationError:
                mountUnauthorizedView();
                break;
            default:
                throw error;
        }
    });

/**
 * Mounts applicaiton root component with initial global data.
 *
 * @param {Number} applicationId Application identifier.
 * @param {Object} authenticationData JWT token data.
 * @param {Object} loggedInPerson Currently logged in person.
 */
function mountApplication({
    applicationId,
    authenticationData,
    loggedInPerson
}) {
    ReactDOM.render(
        <App
            applicationId={applicationId}
            authenticationData={authenticationData}
            loggedInPerson={loggedInPerson}
        />,
        document.getElementById('root')
    );
}

/**
 * Mounts unauthorized view if logged in person has no required privilege.
 */
function mountUnauthorizedView() {
    ReactDOM.render('Unauthorized', document.getElementById('root'));
}

/**
 * Pre-mount callback.
 * Required for intial configuration, polyfills etc.
 */
function applicationWillMount({ authenticationData }) {
    document.documentElement.setAttribute('lang', authenticationData.langIetf);
    document.documentElement.setAttribute(
        'dir',
        authenticationData.langDirection
    );
}
