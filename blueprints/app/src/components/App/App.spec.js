import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('It should render correctly', async () => {
    const { container } = render(<App />);

    expect(container.firstChild).toMatchInlineSnapshot(`
        <div
          class="app a-typography"
        >
          <div
            class="app-content"
          >
            <h1
              class="app-headline a-typography--headline1"
            >
              Welcome to your new application !
            </h1>
            <h2
              class="a-typography--headline2"
            >
              In this application you can use this breathtaking counter
            </h2>
            <div
              class="exampleCounter false"
            >
              <span
                class="exampleCounter-title"
              >
                Counter
              </span>
              <div
                class="exampleCounter-content"
              >
                <button
                  class="exampleCounter-decrementButton a-button a-button--primary"
                  data-testid="exampleCounter-decrementButton"
                  disabled=""
                >
                  <span
                    class="a-button-text"
                  >
                    -
                  </span>
                </button>
                <span
                  class="exampleCounter-value"
                  data-testid="exampleCounter-value"
                >
                  0
                </span>
                <button
                  class="exampleCounter-incrementButton a-button a-button--primary"
                  data-testid="exampleCounter-incrementButton"
                >
                  <span
                    class="a-button-text"
                  >
                    +
                  </span>
                </button>
              </div>
              <button
                class="a-button a-button--outlined exampleCounter-disabledButton"
                data-testid="exampleCounter-disableButton"
              >
                <span
                  class="a-button-text"
                >
                  Disable
                </span>
              </button>
            </div>
          </div>
        </div>
    `);
});
