import { hash, hashSync } from "bcrypt"

export const hashPasswordTransform = {
    to(password: string): string | null {
        if (!password)
            return null;
        return hashSync(password, 10);
    },
    from(hash: string): string {
        return hash;
    }
}