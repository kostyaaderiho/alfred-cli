import React from 'react';

import { storiesOf } from '@storybook/react';

import UnauthorizedPage from '~/components/UnauthorizedPage/UnauthorizedPage';
import readme from './UnauthorizedPage.md';

storiesOf('Pages|UnauthorizedPage', module)
    .addParameters({
        notes: { markdown: readme }
    })
    .add('UnauthorizedPage', () => <UnauthorizedPage />);
