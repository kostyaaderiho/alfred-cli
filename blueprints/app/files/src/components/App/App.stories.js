import React from 'react';

import { storiesOf } from '@storybook/react';

import App from '~/components/App/App';
import readme from './App.md';

storiesOf('Pages|App', module)
    .addParameters({
        notes: { markdown: readme }
    })
    .add('App', () => <App />);
