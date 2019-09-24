import { http } from '@workhuman/axios-auth';

const BASE_URL = '/client-service-app/v2/persons/';

const personModel = {
    /**
     * Returns user entity by id.
     *
     * @param {Object} params model parameters.
     * @param {Number} params.id person primary key.
     */
    get({ id }) {
        /**
         * @todo it is required to handle errors gracefully in model layer.
         */
        return http.get(`${BASE_URL}${id}`);
    }
};

export default personModel;
