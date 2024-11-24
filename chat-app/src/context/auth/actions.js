import {
  LOG_IN,
  GOOGLE_LOGIN,
  LOG_OUT,
  AUTHENTICATE,
  UPDATE_USER_PROFILE,
} from './constants';

const logInAction = (data) => {
  return {
    type: LOG_IN,
    payload: data,
  };
};

const googleLogInAction = (token) => {
  return {
    type: GOOGLE_LOGIN,
    payload: token,
  }
}

const logOutAction = () => {
  return {
    type: LOG_OUT,
    payload: '',
  };
};

const authenticateAction = (token) => {
  return {
    type: AUTHENTICATE,
    payload: token,
  };
};

const updateUserDataAction = (userData) => ({
  type: UPDATE_USER_PROFILE,
  payload: userData,
});


export { logInAction, logOutAction, googleLogInAction, authenticateAction, updateUserDataAction };
