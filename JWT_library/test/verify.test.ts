import { verify, sign } from '../src';

describe('verify', () => {

    it('Should verify and decode a valid token', () => {
        const secret = '@#5325egW!';

        const token = sign({ payload: { name: 'StudentKrzysztof'}, secret});

        const verified = verify({ token, secret });

        expect(verified.name).toBe('StudentKrzysztof');
    });

    it('Should throw if the signature is invalid', () => {
        const secretOne = '@#5325egW!';
        const secretTwo = '&346@2^$#@';

        const token = sign({ payload: { name: 'StudentKrzysztof'}, secret: secretOne});

        try{
            verify({ token, secret: secretTwo})
        }catch(e){
            expect(e.message).toBe('Invalid signature');
        }

    });

    it('Should throw if the token has expired', () => {
        const secret = '@#5325egW!';

        const token = sign({
            payload: { name: 'StudentKrzysztof' },
            secret,
            options: {
                expiresIn: -8.64e7
            }
        });

        try{
            verify({ token, secret })
        }catch(e){
            expect(e.message).toBe('Token has expired');
        }
    });

})