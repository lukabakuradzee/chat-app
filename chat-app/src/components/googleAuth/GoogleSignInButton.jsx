import React, {useState} from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthContext } from '../../context/auth/AuthContextProvider';
import { googleLogInAction } from '../../context/auth/actions';
import { HOME_PAGE } from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { authGoogle } from '../../api/auth';
import { handleAsyncOperation } from '../../utils/handleAsyncOperation';
import { BarLoader } from 'react-spinners';



const GoogleSignInButton = () => {
  const { dispatch } = useAuthContext();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();


  const responseGoogle = async (response) => {
    if (response.credential) {
      await handleAsyncOperation(async () =>{
        const data = await authGoogle(response.credential); 
        dispatch(googleLogInAction({ token: data.token, user: data.user }));
        navigate(HOME_PAGE);
      }, setLoading, (error) => setError(error.message))
  };
}

  const onFailure = (error) => {
    console.error('Google login failed', error);
  };

  return (
    <>
    {loading && (
        <div className="bar-loader" style={{}}>
          <BarLoader color="#fe3c72" />
        </div>
      )}
    {error && <p>Error: {error}</p>}
    <GoogleLogin onSuccess={responseGoogle} onError={onFailure} />
    </>
  )
};

export default GoogleSignInButton;
