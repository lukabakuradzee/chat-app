import { jwtDecode } from 'jwt-decode';

function parseJWT(token) {
  const data = jwtDecode(token);
  return data;
}


function isTOkenValid(token) {
  const currentTime = Date.now() / 1000;
  const decoded = jwtDecode(token);
  return decoded.exp > currentTime;
}


function toggleLocalStorage(token, refreshToken) {
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }

  if (!token && !refreshToken) {
    localStorage.removeItem("user");
  }

}

export { toggleLocalStorage, isTOkenValid, parseJWT  };
