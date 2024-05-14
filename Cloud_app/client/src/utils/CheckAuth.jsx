import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

// Get and set the access token (refresh automatically)
export async function checkAccessToken() {

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
}

export async function checkAuth(setUser) {

    getCurrentUser({
        // Optional, false by default. 
        // If set to true, this call will
        // send a request to Cognito to get the latest user data
        bypassCache: false 
    })
    .then((cognito_user) => {
        console.log('cognito_user', cognito_user);
        setUser({
            name: cognito_user.attributes.name,
            handle: cognito_user.attributes.preferred_username
        })
        return fetchAuthSession()
    }).then((cognito_user_session) => {
        console.log('cognito_user_session', cognito_user_session);
        localStorage.setItem(`${process.env.REACT_APP_LOCAL_STORAGE_AUTH_TOKEN}`, cognito_user_session.accessToken.jwtToken)
    })
    .catch((err) => console.log(err));
}

export default checkAuth;