// Difference between verify and sign:
// -> verify will check the secret and sign won't

import decode from "./decode";
import { createSignature } from "./sign";

export interface VerifyInput{
    token: string;
    secret: string;
}

const dateInPast = function({exp}: {exp: number}){
    const currentDate = new Date();

    return new Date(exp).setHours(0,0,0,0) <= currentDate.setHours(0,0,0,0);
};

function verify({ token, secret }: VerifyInput){
    const parts = token.split('.');

    if(parts.length !== 3){
        throw new Error('Invalid token');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const candidateSignature = createSignature({ secret, encodedHeader, encodedPayload });

    if(signature !== candidateSignature){
        throw new Error('Invalid signature');
    }

    const decoded = decode({token});
    const {exp} = decoded;

    // Check the expiry here
    if(dateInPast({exp})){
        throw new Error('Token has expired');
    }

    return decoded;
}

export default verify;