import React from 'react';
import { render } from '@testing-library/react';
import LandingPage from './LandingPage';

test('It should render correctly', async () => {
    const { container } = render(<LandingPage />);

    expect(container.firstChild).toMatchInlineSnapshot(`
        <div
          class="landingPage"
        >
          Landing page
        </div>
    `);
});
