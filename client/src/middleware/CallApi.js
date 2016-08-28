import fetch from 'isomorphic-fetch';
import ApiError from './ApiError';
import { API_ROOT } from '../web.config';
/**
 * Fetches an API response and normalizes the resulting JSON according to schema.
 *
 * @function callApi
 * @access private
 * @param {string} endpoint - The URL endpoint for the requestf
 * @returns {Promise}
 */
function callApi(endpoint, options) {
    if (API_ROOT && !~endpoint.indexOf(API_ROOT) && options.sameOrigin) {
        endpoint = API_ROOT + endpoint;
    }
    /**
     * THIS SNIPPET IS SUPPOSED TO BE USED FOR QUERY PARAMETERS SUPPORT UNDER FETCH SPEC
     *
     * var url = new URL(endpoint),
     * var params = options.body
     * Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
     * fetch(url).then(/!*  *!/)
     */

    return fetch(endpoint, options)
        .then((response) => {
            if (response.ok) {
                return Promise.resolve(response);
            } else {
                return Promise.reject(response);
            }
        })
        .then((response) => {
            const contentType = response.headers.get('Content-Type');
            if (contentType && ~contentType.indexOf('json')) {
                return response.json().then((json) => {
                    return Promise.resolve(json)
                });
            } else {
                return Promise.resolve(response.xml());
            }
        },
        (response) => {
            const contentType = response.headers.get('Content-Type');
            if (contentType && ~contentType.indexOf('json')) {
                return response.json().then((json) => {
                    return Promise.reject(new ApiError(response.status, response.statusText, json));
                });
            } else {
                return Promise.reject(new ApiError(response.status, response.statusText, response));
            }
        });
}

export default callApi;
