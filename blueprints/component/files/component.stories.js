import React from 'react';

import { storiesOf } from '@storybook/react';
import { withActions } from '@storybook/addon-actions';

import <%= name %> from '~/components/<%= name %>/<%= name %>';
import readme from './<%= name %>.md';

storiesOf('Components|<%= name %>', module)
    .addDecorator(withActions('click'))
    .addParameters({
        notes: { markdown: readme }
    })
    .add('Default', () => <<%= name %> />)