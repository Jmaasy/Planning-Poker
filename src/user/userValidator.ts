import * as dotenv from 'dotenv';
import { createHmac } from 'crypto';

const env = dotenv.config();

class UserValidator {  
    encoder = new TextEncoder();
    decoder = new TextDecoder();

    private encrypt(m: string): string {
        const data = this.encoder.encode(m + process.env.SALT);
        return createHmac('sha512', data).digest('hex');
    }

    getIdentifier(clientId: string): string {
        return this.encrypt(clientId);
    }
}

export default UserValidator;