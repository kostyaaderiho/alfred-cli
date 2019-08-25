import path from 'path';
import initStoryshots from '@storybook/addon-storyshots';
import { imageSnapshot } from '@storybook/addon-storyshots-puppeteer';

const getMatchOptions = () => {
    return {
        customDiffConfig: {
            threshold: 0.03
        }
    };
};

initStoryshots({
    suite: 'Image storyshots',
    test: imageSnapshot({
        storybookUrl: `file:${path.resolve('storybook-static')}`,
        getMatchOptions
    })
});
