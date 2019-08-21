import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './ExampleCounter.scss';

/**
 * Counter that counts your clicks.
 */
export default function ExampleCounter({
    defaultValue,
    maxValue,
    title,
    disabled
}) {
    const [value, setValue] = useState(defaultValue);
    const [counterDisabled, setCounterDisabled] = useState(disabled);

    /**
     * Increment.
     */
    const incrememnt = () => setValue(value + 1);

    /**
     * Decrement.
     */
    const decrement = () => setValue(value - 1);

    /**
     * Toggle state.
     */
    const toggleCounterDisabledStatus = () =>
        setCounterDisabled(!counterDisabled);

    return (
        <div
            className={`exampleCounter ${counterDisabled &&
                'exampleCounter--disabled'}`}
        >
            <span className="exampleCounter-title">{title}</span>
            <div className="exampleCounter-content">
                <button
                    onClick={decrement}
                    disabled={counterDisabled || value <= 0}
                    className="exampleCounter-decrementButton a-button a-button--primary"
                    data-testid="exampleCounter-decrementButton"
                >
                    <span className="a-button-text">-</span>
                </button>
                <span
                    className="exampleCounter-value"
                    data-testid="exampleCounter-value"
                >
                    {value}
                </span>
                <button
                    onClick={incrememnt}
                    disabled={
                        counterDisabled || (maxValue && value >= maxValue)
                    }
                    className="exampleCounter-incrementButton a-button a-button--primary"
                    data-testid="exampleCounter-incrementButton"
                >
                    <span className="a-button-text">+</span>
                </button>
            </div>
            <button
                onClick={toggleCounterDisabledStatus}
                className="a-button a-button--outlined exampleCounter-disabledButton"
                data-testid="exampleCounter-disableButton"
            >
                <span className="a-button-text">
                    {counterDisabled ? 'Enable' : 'Disable'}
                </span>
            </button>
        </div>
    );
}

ExampleCounter.defaultProps = {
    defaultValue: 0,
    title: 'Counter',
    disabled: false
};

ExampleCounter.propTypes = {
    /**
     * Counter starting number.
     */
    defaultValue: PropTypes.number,
    /**
     * Counter max value.
     */
    maxValue: PropTypes.number,
    /**
     * Counter title.
     */
    title: PropTypes.string,
    /**
     * Should counter be disabled by default.
     */
    disabled: PropTypes.bool
};
