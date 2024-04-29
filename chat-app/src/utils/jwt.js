import { jwtDecode } from 'jwt-decode';

function parseJWT(token) {
    const data = jwtDecode(token)
    return data;
}

function isTOkenValid(token) {
    const currentTime = Date.now() / 1000;
    const decoded = jwtDecode(token)
    return decoded.exp > currentTime
}

function toggleLocalStorage(token, refreshToken) {
    if(token && refreshToken) {
        localStorage.setItem("accessToken", token)
        localStorage.setItem("refreshToken", refreshToken)
    } else {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
    }
}



export {toggleLocalStorage, isTOkenValid, parseJWT}