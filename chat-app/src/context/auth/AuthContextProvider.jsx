import { useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducer';
import { isTOkenValid } from '../../utils/jwt';
import { authenticateAction } from './actions';
import { createContext, useContext } from 'react';

const authContext = createContext();
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
      if (isTOkenValid(token) && isTOkenValid(refreshToken)) {
        dispatch(authenticateAction(token, refreshToken))
      }
    }
  }, []);


  

  return (
    <authContext.Provider value={{ state, dispatch }}>
      {children}
    </authContext.Provider>
  );
};

const useAuthContext = () => {
  const AuthContext = useContext(authContext);
  if (!AuthContext) {
    throw new Error('auth context is not working');
  }
  return AuthContext;
};

export { AuthContextProvider, useAuthContext, authContext };
