import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import ExampleCounter from './ExampleCounter';

test('It should support default value.', async () => {
    const { getByTestId } = render(<ExampleCounter defaultValue={10} />);

    expect(getByTestId('exampleCounter-value')).toHaveTextContent('10');
});

test('It should incrememnt value.', async () => {
    const { getByTestId } = render(<ExampleCounter />);

    expect(getByTestId('exampleCounter-value')).toHaveTextContent('0');
    fireEvent.click(getByTestId('exampleCounter-incrementButton'));
    expect(getByTestId('exampleCounter-value')).toHaveTextContent('1');
});

test('It should decrement value.', async () => {
    const { getByTestId } = render(<ExampleCounter defaultValue={10} />);

    expect(getByTestId('exampleCounter-value')).toHaveTextContent('10');
    fireEvent.click(getByTestId('exampleCounter-decrementButton'));
    expect(getByTestId('exampleCounter-value')).toHaveTextContent('9');
});

test('It should disable decrement button if count is 0.', async () => {
    const { getByTestId } = render(<ExampleCounter defaultValue={1} />);

    expect(getByTestId('exampleCounter-decrementButton')).toBeEnabled();
    fireEvent.click(getByTestId('exampleCounter-decrementButton'));
    expect(getByTestId('exampleCounter-decrementButton')).toBeDisabled();
});

test('It should disable increment button if count is more than Maxium Value.', async () => {
    const { container, getByTestId } = render(
        <ExampleCounter defaultValue={10} />
    );

    expect(getByTestId('exampleCounter-incrementButton')).toBeEnabled();
    expect(getByTestId('exampleCounter-decrementButton')).toBeEnabled();
    expect(container.firstChild).not.toHaveClass('exampleCounter--disabled');
    fireEvent.click(getByTestId('exampleCounter-disableButton'));
    expect(getByTestId('exampleCounter-incrementButton')).toBeDisabled();
    expect(getByTestId('exampleCounter-decrementButton')).toBeDisabled();
    expect(container.firstChild).toHaveClass('exampleCounter--disabled');
});

test('It should disables completely when disable button toggled on.', async () => {
    const { getByTestId } = render(
        <ExampleCounter defaultValue={9} maxValue={10} />
    );

    expect(getByTestId('exampleCounter-incrementButton')).toBeEnabled();
    fireEvent.click(getByTestId('exampleCounter-incrementButton'));
    expect(getByTestId('exampleCounter-incrementButton')).toBeDisabled();
});

test('It should render correctly', async () => {
    const { container } = render(<ExampleCounter />);

    expect(container.firstChild).toMatchInlineSnapshot(`
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
    `);
});
