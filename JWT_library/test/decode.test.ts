import { decode, sign } from '../src';

describe('decode', () =>{
    it('Should decode the token payload', () => {
        const token = sign({ payload: { name: 'StudentKrzysztof' }, secret: '@#%32hfes' });

        const decoded = decode({ token });

        expect(decoded.name).toBe('StudentKrzysztof');
    });
});