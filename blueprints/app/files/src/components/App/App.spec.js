import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('It should render correctly', async () => {
    const { container } = render(<App />);

    expect(container.firstChild).toMatchInlineSnapshot(`
        <div
          class="app a-typography"
        />
    `);
});
