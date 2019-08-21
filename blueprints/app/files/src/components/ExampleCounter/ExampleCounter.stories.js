import React from 'react';

import { storiesOf } from '@storybook/react';
import { number, text, boolean } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

import ExampleCounter from '~/components/ExampleCounter/ExampleCounter';
import readme from './ExampleCounter.md';

storiesOf('Components|ExampleCounter', module)
    .addDecorator(withActions('click'))
    .addParameters({
        notes: { markdown: readme }
    })
    .add('Default', () => <ExampleCounter />)
    .add('With start value', () => (
        <ExampleCounter defaultValue={number('Start from', 10)} />
    ))
    .add('With max value', () => (
        <ExampleCounter maxValue={number('Max Value', 20)} />
    ))
    .add('With custom title', () => (
        <ExampleCounter title={text('title', 'Custom titled counter')} />
    ))
    .add('In disabled state', () => (
        <ExampleCounter disabled={boolean('Disabled', true)} />
    ));
