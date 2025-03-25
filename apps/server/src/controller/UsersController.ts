import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
} from "@effect/platform";
import { Effect } from "effect";
import { config } from "../config/config";
import { UserModel } from "../db/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserApi } from "../routes/UsersRoutes";

import { BcryptEffect } from "../services/bcryptEffect";
import { JwtEffect } from "../services/jwtEffect";


export const UserApiLive = HttpApiBuilder.group(UserApi, "Users", (handlers) =>
  handlers
    .handle(
      "register",
      (req) => Effect.gen(function*() {
        const hashPassword = yield* BcryptEffect.hash(req.payload.password, 10)
        
        const user = yield* Effect.promise(() =>
          UserModel.create({
            email: req.payload.email,
            password: hashPassword
          })
        );
        
        
        return yield* Effect.succeed(`Registration Successfully UserID: ${user.id}`);
      })
    )
    .handle(
      "login",
      (req) => Effect.gen(function*() {
        const jwtSecret = yield* Effect.orDie(config.jwt_secret)

        const user = yield* Effect.promise(() =>
          UserModel.findOne({ email: req.payload.email }).exec()
        );

        if (!user) {
          
          return yield* Effect.succeed("User cannot be found");
        }
        
        const passwordMatch = yield* BcryptEffect.compare(req.payload.password, user.password)

        if (!passwordMatch) {
          return yield* Effect.succeed("Invalid password");
        }

        
        const token = yield* JwtEffect.sign({ 
          userId: user.id, email: user.email },
          jwtSecret,
          { expiresIn: "30d" })

        return yield* Effect.succeed(`Bearer ${token}`);
      })
    )
);
