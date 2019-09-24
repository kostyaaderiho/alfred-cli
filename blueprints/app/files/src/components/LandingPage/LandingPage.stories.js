import React from 'react';

import { storiesOf } from '@storybook/react';

import LandingPage from '~/components/LandingPage/LandingPage';
import readme from './LandingPage.md';

storiesOf('Pages|LandingPage', module)
    .addParameters({
        notes: { markdown: readme }
    })
    .add('LandingPage', () => <LandingPage />);
