import {OAuth2Client} from 'google-auth-library';
import jwt from 'jsonwebtoken';
import pool from './Database';
import { response } from 'express';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return{
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            googleId: payload.sub,
            emailVerified: payload.email_verified
        };
    } catch (error) {
        throw new Error('Invalid Google token');
    }
}

async function verifyFacebookToken(accessToken){
    try {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`);
        if(!response.ok){
            throw new Error('Failed to verify Facebook token');
        }

        const data = await response.json();
        if(!data.email){
            throw new Error('Email permission not granted');
        }

        return{
            id: data.id,
            email: data.email,
            name: data.name,
            picture: data.picture?.data?.url || null
        };
    } catch (error) {
        throw new Error('Invalid Facebbok token');
    }
}

//Universal Social Login
export const handleSocialAndFacebookLogin = async (request, response) => {
    const{provider, token} = request.body;

    if(!provider || !token){
        return response.status(400).json({
            error: 'Provider and token are required'
        });
    }
    try {
        switch(provider.toUpperCase()){
            case 'GOOGLE':
                return await googleLogin(request, response);
            case 'FACEBOOK':
                return await facebookLogin(request, response);
            default:
                return response.status(400).json({
                    error: 'Invalid provider. Supported: GOOGLE, FACEBOOK'
                });
        }
    } catch (error) {
        console.error('Social login error:', error);
        response.status(500).json({error: 'Authentication failed'})
    }
}

//Google Login
export const googleLogin = async (request, response) => {
    let connection;
    try{
        const{token} = request.body;
        if(!token){
            return response.status(400).json({error: 'Token is required'});
        }
        const googleUser = await verifyGoogleToken(token);
        connection = await pool.getConnection();

        const[existingUsers] =await connection.execute('SELECT * FROM users WHERE email = ?', [googleUser.email]);

        let user;
        if(existingUsers.length === 0){
            const[result] = await connection.execute(
                `INSERT INTO users (email, name, picture, google_id, auth_provider, email_verified, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                 [
                    googleUser.email,
                    googleUser.name,
                    googleUser.picture,
                    googleUser.googleId,
                    'google',
                    googleUser.emailVerified ? 1 : 0,
                 ]
            );
            user = {
                id: result.insertId,
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                google_id: googleUser.googleId,
                auth_provider: 'google',
                email_verified: googleUser.emailVerified
            };
        }else{
            user = existingUsers[0];

            if(!user.google_id){
                await connection.execute(
                    'UPDATE users SET google_id = ?, auth_provider = ? WHERE id = ?', [googleUser.googleId, 'google', user.id]
                );
                user.google_id = googleUser.googleId;
            }
        }
        const appToken = generateJWT(user);
        if(request.session){
            request.session.userId = user.id;
        }

        response.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
            token: appToken
        });
    }catch (error) {
        console.error('Google login error:', error);
        response.status(401).json({error: 'Authentication failed: '+ error.message});
    }finally{
        if(connection){
            connection.release();
        }
    }
};

//Facebook Login
export const facebookLogin = async (request, response) => {
    let connection;
    try {
        const{token} = request.body;
        if(!token){
            return response.status(400).json({error: 'Token is required'});
        }

        const facebookUser = await verifyFacebookToken(token);
        connection = await pool.getConnection();

        const[existingUsers] = await connection.execute('SELECT * FROM users WHERE email = ?', [facebookUser.email]);

        let user;
        if(existingUsers.length === 0){
            const[result] = await connection.execute(
                `INSERT INTO users (email, name, picture, facebook_id, auth_provider, email_verified, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW())`,
                 [
                    facebookUser.email,
                    facebookUser.name,
                    facebookUser.picture,
                    facebookUser.id,
                    'facebook',
                    1
                 ]
            );
            user = {
                id: result.insertId,
                email: facebookUser.email,
                name: facebookUser.name,
                picture: facebookUser.picture,
            }
        }else{
            user = existingUsers[0];

            if(!user.facebook_id){
                await connection.execute(
                    'UPDATED users SET facebook_id = ?, auth_provider = ? WHERE id = ?', [facebookUser.id, 'facebook', user.id]
                );
                user.facebook_id = facebookUser.id;
            }
        }

        const appToken = generateJWT(user);
        if(request.session){
            request.session.userId = user.id;
        }

        response.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: user.picture,
            },
            token: appToken
        });
    } catch (error) {
        console.error('Facebook login error:', error);
        response.status(401).json({error: 'Authentication failed: ' + error.message});
    }finally{
        if(connection){
            connection.release();
        }
    }
};

function generateJWT(user){
    return jwt.sign(
        {userId: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );
}

export default {handleSocialAndFacebookLogin, googleLogin, facebookLogin};