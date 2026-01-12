import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { getGoogleIdToken } from './AuthService';

const GoogleLogin = ({onGoogleLogin}) => {
    const[error, setError] = useState(null);
    const[loading, setLoading] = useState(false);
    const googleButtonRef = useRef(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if(window.google){
                try {
                    //disable auto-select FIRST before initializing
                    window.google.accounts.id.disableAutoSelect();

                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        callback: handleCredentialResponse,
                        auto_select: false, //disable auto-select
                        cancel_on_tap_outside: true,
                    });

                    //cancell any pending prompts
                    window.google.accounts.id.cancel();

                    //clear the div before rendering to ensure fresh button
                    if(googleButtonRef.current){
                        googleButtonRef.current.innerHTML = '';

                        //render the button using the ref 
                        window.google.accounts.id.renderButton(
                            googleButtonRef.current,
                            {
                                theme: "outline", 
                                size: "large",
                                text: "signin_with",
                                shape: "rectangular",
                                logo_alignment: "left"
                            }//customize
                        );
                    }  
                } catch (error) {
                    console.error('Google Sign_In initialization error:', error);
                    setError('Failed to initialize Google Sign-In');
                }
            }else{
                console.error('Google script did not load properly');
                setError('Google Sign-In script failed to load');
            }
        };

        return () => {
            //clean up: cancel Google One Tap when component unmounts
            if(window.google?.accounts?.id){
                window.google.accounts.id.disableAutoSelect();
                window.google.accounts.id.cancel();
            }
            if(document.body.contains(script)){
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleCredentialResponse = async (response) => {
        try {
            setLoading(true);
            setError(null);

            const idToken = response.credential;

            const loginData = {
                token: idToken,
                provider: 'GOOGLE'
            };

            const result = await getGoogleIdToken(loginData);
            onGoogleLogin(result);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to authenticate with Google';
            setError(errorMessage);
        }finally{
            setLoading(false);
        }
    };

  return (
    <div className='social-login-container'>
        {error && (
            <Alert variant='danger' dismissible onClose={() => setError(null)}>
                {error}
            </Alert>
        )}
       <div ref={googleButtonRef} style={{marginBottom: '10px'}}></div>
       {loading && <div className='text-muted'>Authenticating...</div>}
       <div className='text-center mt-2'>
            <small className='text-muted'>
                Sign in securely with your Google account
            </small>
       </div>
    </div>
  )
}

export default GoogleLogin;
