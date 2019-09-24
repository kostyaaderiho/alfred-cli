import React from 'react';
import { render } from '@testing-library/react';
import UnauthorizedPage from './UnauthorizedPage';

test('It should render correctly', async () => {
    const { container } = render(<UnauthorizedPage />);

    expect(container.firstChild).toMatchInlineSnapshot(`
        <div
          class="unauthorizedPage"
        >
          Unauthorized page
        </div>
    `);
});
