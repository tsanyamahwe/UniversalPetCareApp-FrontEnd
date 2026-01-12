import React, { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap';
import { getFacebookAccessToken } from './AuthService';

const FacebookLogin = ({onFacebookLogin}) => {
    const[error, setError] = useState(null);
    const[loading, setLoading] = useState(false);
    const[sdkLoaded, setSdkLoaded] = useState(false);

    useEffect(() => {        
        const initializeFacebookSDK = () => {
            try {
                window.FB.init({
                    appId: import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID", 
                    cookie: true,
                    xfbml: true,
                    version: "v21.0"
                });
                setSdkLoaded(true);

                // Check login status
                window.FB.getLoginStatus(function(response){
                    console.log('Initial login status:', response);
                });
            } catch (error) {
                console.error('Error initializing Facebook SDK:', error);
                setError('Failed to initialize Facebook SDK');
            }
        };

        // Check if SDK is already loaded
        if (window.FB) {
            initializeFacebookSDK();
        } else {
            // Define fbAsyncInit before loading the script
            window.fbAsyncInit = initializeFacebookSDK;

            // Load the Facebook SDK script
            if(!document.getElementById('facebook-jssdk')){
                const script = document.createElement('script');
                script.id = 'facebook-jssdk';
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                script.async = true;
                script.defer = true;
                
                script.onerror = () => {
                    console.error('Failed to load Facebook SDK script');
                    setError('Failed to load Facebook SDK');
                };
                
                document.body.appendChild(script);
            } 
        }
    }, []);

    const handleFacebookLogin = () => {
        setLoading(true);
        setError(null);

        if(!window.FB){
            console.error('Facebook SDK not loaded');
            setError('Facebook SDK not loaded. Please refresh the page');
            setLoading(false);
            return;
        }

        window.FB.login(
            function (response) {
                handleFacebookResponse(response);
            },
            {scope: "public_profile,email"}
        );
    };

    const handleFacebookResponse = async (response) => {
        try {
            if(response.authResponse){
                const accessToken = response.authResponse.accessToken;
                const result = await getFacebookAccessToken(accessToken);
                onFacebookLogin(result);
            }else{
                setError('Login cancelled or not authorized');
            }
        } catch (error) {            
            const errorMsg = error.response?.data?.message || error.message || 'Failed to authenticate with Facebook';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div>
        {error && (
            <Alert variant='danger' dismissible onClose={() => setError(null)}>
                {error}
            </Alert>
        )}
       <Button 
            onClick={handleFacebookLogin} 
            className='btn btn-primary w-100' 
            disabled={loading || !sdkLoaded}
        >
            {loading ? 'Authenticating...' : !sdkLoaded ? 'Loading...' : 'Login with Facebook'}
       </Button>
       <div className='text-center mt-2'>
            <small className='text-muted'>
                {sdkLoaded ? 'Sign in securely with your Facebook account' : 'Loading Facebook SDK...'}
            </small>
       </div>
    </div>
  )
}

export default FacebookLogin;
