import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
import { getFacebookAccessToken } from './AuthService';

const FacebookLogin = ({onFacebookLogin}) => {
    const[error, setError] = useState(null);
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID", 
                cookie: true,
                xfbml: true,
                version: "v21.0" // latest as of 2025
            });
        };
    }, []);

    const handleFacebookLogin = () => {
        setLoading(true);
        setError(null);

        window.FB.login(
            async function (response) {
                try {
                    if(response.authResponse){
                        const accessToken = response.authResponse.accessToken;
                        console.log("Facebook Access Token: ", accessToken);

                        const result = await getFacebookAccessToken(accessToken);
                        onFacebookLogin(result.data);
                    }else{
                        setError('Login cancelled or not authorized');
                        console.log("User cancelled login or did not authorize.");
                    }
                } catch (error) {
                    console.error('Facebook login error:', error);
                    setError(error.message || 'Failed to authenticate with Facebbok');
                }finally{
                    setLoading(false);
                }
            },
            {scope: "public_profile,email"}
        );
    };

  return (
    <div>
        {error && (
            <Alert variant='danger' dismissible onClose={() => setError(null)}>
                {error}
            </Alert>
        )}
       <Button onClick={handleFacebookLogin} className='btn btn-primary w-100' disabled={loading}>
            {loading ? 'Authenticating...' : 'Login with Facebook'}
       </Button>
       <div className='text-center mt-2'>
            <small className='text-muted'>
                Sign in securely with your Facebook account
            </small>
       </div>
    </div>
  )
}

export default FacebookLogin;
