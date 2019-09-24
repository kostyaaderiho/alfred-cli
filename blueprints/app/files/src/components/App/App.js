import React from 'react';
import PropTypes from 'prop-types';
import { Route, HashRouter } from 'react-router-dom';

import LandingPage from '~/components/LandingPage/LandingPage';

import './App.scss';

/**
 * App root container.
 */
export default function App() {
    return (
        <HashRouter hashType="hashbang">
            <div className="app a-typography">
                <Route exact path=":clientName" component={LandingPage} />
            </div>
        </HashRouter>
    );
}

App.propTypes = {
    /**
     * Unique application identifier that used commonly in "Global Nav",
     * to track active application.
     */
    applicationId: PropTypes.string.isRequired,

    /**
     * Authentification data from JWT token.
     */
    authenticationData: PropTypes.object.isRequired,

    /**
     * Currently logged in person (Current User).
     */
    loggedInPerson: PropTypes.object.isRequired
};
