import React from "react";
import { fetchAuthSession } from '@aws-amplify/auth';

const getAccessToken = async () => {
    try {
        const session = await fetchAuthSession();   // Fetch the authentication session
        // const accessToken = jwtDecode(session.tokens.accessToken);
        return session.tokens.accessToken;
        // console.log('Access Token:', session.tokens.accessToken.toString());
        // console.log('ID Token:', session.tokens.idToken.toString());
    }
    catch (e) { console.log(e); }
};

export default getAccessToken;