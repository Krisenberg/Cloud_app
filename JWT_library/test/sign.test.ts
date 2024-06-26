import { sign } from '../src';

describe('sign', () => {

    it('Should produce different signatures for different payloads', () => {
        
        // Different secrets are possible to utilize, some will use public + private keys,
        // and some will just take secret signing keys
        const secret = 'SomeSecretValue';

        const token1 = sign({
            payload: { name: 'Tom' },
            secret,
            options: { expiresIn: 8.64e7 } // One day in milliseconds
        });

        console.log('JWT 1: ', token1); // Print generated token to verify it manually in jwt.io
        const jwtOne = token1.split('.')[2];

        const jwtTwo = sign({
            payload: { name: 'Tom' },
            secret: `${secret}^2358u!241@3`,
            options: { expiresIn: 8.64e7 } // One day in milliseconds
        }).split('.')[2];

        expect(jwtOne).not.toBe(jwtTwo);

    });

    it('Should add the expiry to the payload', () => {

        const secret = '!%135&425@%$';

        const jwtOne = sign({
            payload: { name: 'Tom' },
            secret,
            options: { expiresIn: 8.64e7 } // One day in milliseconds
        }).split('.')[1];

        expect(typeof JSON.parse(atob(jwtOne)).exp).toBe('number');
    });

});