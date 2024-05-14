import React from "react";
import { fetchAuthSession } from '@aws-amplify/auth';

const getAccessToken = async () => {
    // try {
    //     const session = await fetchAuthSession();   // Fetch the authentication session
    //     // const accessToken = jwtDecode(session.tokens.accessToken);
    //     return session.tokens.accessToken;
    //     // console.log('Access Token:', session.tokens.accessToken.toString());
    //     // console.log('ID Token:', session.tokens.idToken.toString());
    // }
    // catch (e) { console.log(e); }
    try {
        const session = await fetchAuthSession({bypassCache: true});   // Fetch the authentication session
        const accessToken = session.tokens.accessToken;
        localStorage.setItem(`${process.env.REACT_APP_LOCAL_STORAGE_AUTH_TOKEN}`, accessToken)
        return true;
    }
    catch (e) {
        localStorage.removeItem(`${process.env.REACT_APP_LOCAL_STORAGE_AUTH_TOKEN}`)
        console.log(e); 
        return false;
    }
};

export default getAccessToken;