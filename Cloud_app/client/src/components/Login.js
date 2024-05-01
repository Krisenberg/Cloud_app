// import { useState, useEffect } from "react";
// import { Button } from 'react-bootstrap';

// import { Authenticator } from '@aws-amplify/ui-react';
// import { fetchAuthSession } from '@aws-amplify/auth';

// const Login = ({ setIsLoggedIn }) => {

//     // Function to print access token and id token
//     const printAccessTokenAndIdToken = async () => {
//         try {
//         const session = await fetchAuthSession();   // Fetch the authentication session
//         console.log('Access Token:', session.tokens.accessToken.toString());
//         console.log('ID Token:', session.tokens.idToken.toString());
//         }
//         catch (e) { console.log(e); }
//     };

//     return (
//         <Authenticator>
//             {({ signOut, user }) => {
//                 setIsLoggedIn(true);
//                 return (
//                     <main>
//                         <h1>Hello {user.username}, you are already signed in!</h1>
//                         <Button variant='primary' onClick={() => { setIsLoggedIn(false); signOut(); }}>Sign out</Button>
//                         <Button onClick={printAccessTokenAndIdToken}>Print Tokens</Button>
//                     </main>
//                 );
//             }}
//         </Authenticator>
//     )
// }

// export default Login;

