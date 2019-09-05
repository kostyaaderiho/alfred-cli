import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import <%= name %> from './ <%= name %>';

test('It should render correctly', async () => {
    const { container } = render(<<%= name %> />);

    expect(container.firstChild).toMatchInlineSnapshot(`
        <div>I'm example component.</div>
    `);
});
