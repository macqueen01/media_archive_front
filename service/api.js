import axios from 'axios';
import { address } from '../utilities/settings';

const send = async ({ method = "", path = "", data = {}, } = {}) => {

};

const getApi = ({ path = '' } = {}) => {
    return send({ method: 'GET', path })
}

const putApi = ({ path = '', data = {} } = {}) => {
    return send({ method: 'PUT', path, data })
}

const postApi = ({ path = '', data = {} } = {}) => {
    return send({ method: 'POST', path, data })
}

const deleteApi = ({ path = '', data = {} } = {}) => {
    return send({ method: 'DELETE', path, data })
}

const authenticateUserApi = (token) => {
    return axios({
        url: `http://${address}/drf/user/check-status`,
        method: "get",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
}

export {
    getApi,
    postApi,
    deleteApi,
    putApi,
    authenticateUserApi
}

