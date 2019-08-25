import requireContext from 'require-context.macro';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { withInfo } from '@storybook/addon-info';
import { initializeRTL } from 'storybook-addon-rtl';

// automatically import all files ending in *.stories.js
const req = requireContext('../src', true, /\.stories\.js$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

initializeRTL();
addDecorator(withKnobs);
addDecorator(withA11y);
addDecorator(
    withInfo({
        source: false,
        header: false
    })
);

addParameters({
    backgrounds: [
        { name: 'darkcyan', value: '#008b8b' },
        { name: 'white', value: '#fff' },
        { name: 'ghostwhite', value: '#f8f8ff', default: true },
        { name: 'black', value: '#000' },
        { name: 'dark', value: '#333' }
    ]
});

configure(loadStories, module);
