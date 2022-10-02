import axios from 'axios';

const send = async ({method="", path="", data={},} = {}) => {

};

const getApi = ({path=''} = {}) => {
    return send({method: 'GET', path})
}

const putApi = ({path='', data={}} = {}) => {
    return send({method: 'PUT', path, data})
}

const postApi = ({path='', data={}} = {}) => {
    return send({method: 'POST', path, data})
}

const deleteApi = ({path='', data={}} = {}) => {
    return send({method: 'DELETE', path, data})
}

export {
    getApi,
    postApi,
    deleteApi,
    putApi
}

