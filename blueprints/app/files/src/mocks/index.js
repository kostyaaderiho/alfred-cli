import MockAdapter from 'axios-mock-adapter';
import setupJWTTokenMock from './jwtToken.mock';
import setupPersonMock from './person.mock';

const DELAY = 0;

export default function setupMocks(axios) {
    const mock = new MockAdapter(axios, { delayResponse: DELAY });
    setupJWTTokenMock(mock);
    setupPersonMock(mock);
}
