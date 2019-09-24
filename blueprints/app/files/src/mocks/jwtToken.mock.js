export default function setupJWTTokenMock(mock) {
    mock.onGet('/microsites/login/userSessionAuthToken').reply(200, {
        client: 'staff',
        clientId: 33,
        expires: 1777777777777,
        lang: 'eng',
        langDirection: 'ltr',
        langIetf: 'en-US',
        token: '',
        userId: 2264435
    });
}
