import { jwtDecode } from 'jwt-decode';
import {
  AUTHENTICATE,
  GOOGLE_LOGIN,
  LOG_IN,
  LOG_OUT,
  UPDATE_USER_PROFILE,
} from './constants';
import { toggleLocalStorage } from '../../utils/jwt';

const initialState = {
  isAuthenticated: false,
  user: null,
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOG_IN:
    case GOOGLE_LOGIN: {
      if (payload?.token) {
        const { token } = payload;
        const user = jwtDecode(token);
        toggleLocalStorage(token);
        console.log("User: ", user)
        return { isAuthenticated: true, user };
      } else {
        console.error('Payload missing token');
        return state;
      }
    }
    case LOG_OUT: {
      toggleLocalStorage();
      return { isAuthenticated: false, user: null };
    }
    case AUTHENTICATE: {
      try {
        const user = jwtDecode(payload);
        console.log("Authenth User", user)
        return { isAuthenticated: true, user };
      } catch (error) {
        console.error('Error decoding token: ', error);
        return state;
      }
    }
    case UPDATE_USER_PROFILE: {
      try {
        const updatedUser = { ...state.user, ...payload };
        console.log('Reducer Payload : ', updatedUser);
        return { ...state, user: updatedUser };
      } catch (error) {
        console.error('Error updating user: ', error);
        return state;
      }
    }
    default:
      return state;
  }
};
export { initialState, reducer };
