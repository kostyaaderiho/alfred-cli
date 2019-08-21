import React from 'react';
import './App.scss';

import 'focus-visible';

import ExampleCounter from '~/components/ExampleCounter/ExampleCounter';

/**
 * App root page.
 */
export default function App() {
    return (
        <div className="app a-typography">
            <div className="app-content">
                <h1 className="app-headline a-typography--headline1">
                    Welcome to your new application !
                </h1>
                <h2 className="a-typography--headline2">
                    In this application you can use this breathtaking counter
                </h2>
                <ExampleCounter />
            </div>
        </div>
    );
}
