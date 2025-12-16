import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { getGoogleIdToken } from './AuthService';

const GoogleLogin = ({onGoogleLogin}) => {
    const[error, setError] = useState(null);
    const[loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        console.log('Vite Google ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);

        script.onload = () => {
            if(window.google){
                try {
                    window.google.accounts.id.initialize({
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                        callback: handleCredentialResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                    });

                    window.google.accounts.id.renderButton(
                        document.getElementById("googleSignInDiv"),
                        {
                            theme: "outline", 
                            size: "large",
                            text: "signin_with",
                            shape: "rectangular",
                            logo_alignment: "left"
                        }//customize
                    );
                    console.log('Google Sign-In initialized ✅');
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
       <div id = "googleSignInDiv" style={{marginBottom: '10px'}}></div>
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
