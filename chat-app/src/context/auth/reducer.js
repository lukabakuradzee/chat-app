import { jwtDecode } from 'jwt-decode';
import {
  AUTHENTICATE,
  GOOGLE_LOGIN,
  LOG_IN,
  LOG_OUT,
  UPDATE_USER_PROFILE,
  CHANGE_PASSWORD,
  VERIFY_EMAIL,
  DELETE_ACCOUNT,
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
        return { isAuthenticated: true, user };
      } catch (error) {
        console.error('Error decoding token: ', error);
        return state;
      }
    }
    case UPDATE_USER_PROFILE: {
      try {
        const updatedUser = { ...state.user, ...payload };
        return { ...state, user: updatedUser };
      } catch (error) {
        console.error('Error updating user: ', error);
        return state;
      }
    }

    case CHANGE_PASSWORD: {
      const { passwordData } = payload;
      try {
        if (state.user) {
          const updatedUser = {
            ...state.user,
            password: passwordData.newPassword,
          };
          return { ...state, user: updatedUser };
        }
        console.error('User not authenticated');
        return state;
      } catch (error) {
        console.error('Error changing password: ', error);
        return state;
      }
    }

    case VERIFY_EMAIL: {
      return {
        ...state,
        emailVerified: payload,
      };
    }

    case DELETE_ACCOUNT: {
      toggleLocalStorage();
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    default:
      return state;
  }
};
export { initialState, reducer };
