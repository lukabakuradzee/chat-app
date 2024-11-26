import {
  LOG_IN,
  GOOGLE_LOGIN,
  LOG_OUT,
  AUTHENTICATE,
  UPDATE_USER_PROFILE,
  
  CHANGE_PASSWORD,
  VERIFY_EMAIL,
  DELETE_ACCOUNT,
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
  };
};

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

const changePasswordAction = (userId, passwordData) => ({
  type: CHANGE_PASSWORD,
  payload: { userId, passwordData },
});

const verifyEmailAction = (status) => ({
  type: VERIFY_EMAIL,
  payload: status,
});

const deleteAccountAction = (userId) => ({
  type: DELETE_ACCOUNT,
  payload: userId,
});

export {
  logInAction,
  logOutAction,
  googleLogInAction,
  authenticateAction,
  updateUserDataAction,
  changePasswordAction,
  verifyEmailAction,
  deleteAccountAction,
};
