/**
 * Privileges
 *
 * Not permisions for LE / SM : 0000111001000000000000011100000000000000010000
 * Life events: 1000111001000000000000011100000000000000010000
 */

const person = {
    id: 2264435,
    imageUrl: '/pictures/staff/7089737.jpg?1478873578000',
    managerId: 7097076,
    isManager: false,
    managerPath: '/67036/69005/138744/7097076/7089737',
    privilege: '1000111001000000000000011100000000000000010000',
    personTO: {
        pkPerson: 2264435,
        personUsername: 'vasya_vasiliev@mail.com',
        firstName: 'Vasya',
        lastName: 'Vasiliev',
        pkClient: 33,
        lang: 'eng',
        mobileActive: true,
        refNo: 'Vasyaa',
        couCountryId: 34,
        pkDepartment: 2876,
        costCentre: null,
        costCentreId: null,
        userDef1: null,
        userDef2: 'N',
        userDef3: null,
        userDef4: null,
        invoicingEntityId: 'entity1',
        address1: null,
        address2: null,
        address3: null,
        city: null,
        stateProv: null,
        zip: null,
        email: 'vasya_vasiliev@mail.com',
        phone: null,
        hireDate: 1468195200000,
        functionTitle: 'Development',
        privilege: 580542145761394,
        pictureUploaded: true,
        modified: 1478873578000
    }
};

export default function setupPersonMock(mock) {
    mock.onGet('/client-service-app/v2/persons/2264435').reply(200, person);
}
