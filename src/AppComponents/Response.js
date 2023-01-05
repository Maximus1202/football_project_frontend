import axios from "axios";


export const sendApiGetRequest = (request, callback) => {
    axios.get(request)
        .then(response => {
            if (callback) {
                callback(response);
            }
        })
}

export const sendApiPostRequest = (request, params, callback) => {
    axios.post(request, null, {
        params
    }).then(response => {
        if (callback) {
            callback(response);
        }
    })
}