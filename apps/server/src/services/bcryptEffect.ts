import { Effect} from "effect";
import bcrypt from "bcryptjs";

// Bcrypt operations wrapped in Effect
export const BcryptEffect = {
  // Hash a password with the given salt rounds
  hash: (password: string, saltRounds: number = 10) => 
    Effect.promise(() => bcrypt.hash(password, saltRounds)),
  
  // Compare a plain password with a hashed password
  compare: (plainPassword: string, hashedPassword: string) => 
    Effect.promise(() => bcrypt.compare(plainPassword, hashedPassword))
};
