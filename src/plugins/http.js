import axios from 'axios'
const dd = (val) => console.log(val)

/* REQUEST HANDLERS */
const requestConfigHandler = async (config) => {
    dd({'@NetworkFetching:': config.url})
    return config
}

const requestErrorHandler = async (error) => {
    dd({'@NetworkRequestError:': error})
    return Promise.reject(error)
}

/* RESPONSE HANDLERS */
const responseConfigHandler = async (response) => {
    const { data } = response
    if(data.isCargo) response.data = data.payload
    console.log(response.data)
    return response;
}

async function responseErrorHandler (error){
    dd({'@NetworkResponseError:': error.message})
    return Promise.reject(error)
}


export default (config = {}) => {
    
    const http = axios.create(config)

    http.interceptors.request.use(requestConfigHandler, requestErrorHandler)
    http.interceptors.response.use(responseConfigHandler, responseErrorHandler)

    return http
}