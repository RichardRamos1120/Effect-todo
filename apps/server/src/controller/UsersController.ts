import {
    HttpApi,
    HttpApiBuilder,
    HttpApiEndpoint,
    HttpApiGroup,
    HttpApiSchema
  } from "@effect/platform";
  import { Effect } from "effect";
  import { config } from "../config/config";
  import { UserModel } from "../db/db";
  import bcrypt from "bcryptjs";
  import jwt from "jsonwebtoken";
  import { UserApi } from "../routes/UsersRoutes";

export const UserApiLive = HttpApiBuilder.group(UserApi, "Users", (handlers) =>
    handlers
      .handle(
        "register",
        (req) =>
          Effect.promise(async () => {
            try {
              const hashPassword = await bcrypt.hash(req.payload.password, 10);
              const user = await UserModel.create({
                email: req.payload.email,
                password: hashPassword
              });
              return `Registration Successfully UserID: ${user.id}`;
            } catch (err) {
              throw new Error(`Error Message: ${err.message}`);
            }
          })
      )
      .handle(
        "login",
        (req) =>
          Effect.promise(async () => {
            try {
              const jwtSecret = await Effect.runPromise(config.jwt_secret);
              const user = await UserModel.findOne({ email: req.payload.email }).exec();
  
              if (!user) {
                throw new Error("User cannot be found");
              }
  
              // Compare the hashed password
              const passwordMatch = await bcrypt.compare(
                req.payload.password,
                user.password
              );
  
              if (!passwordMatch) {
                throw new Error("Invalid password");
              }
  
              // Generate JWT Token
              const token = await jwt.sign(
                { userId: user.id, email: user.email },
                jwtSecret,
                { expiresIn: "30d" }
              );
  
              // We can copy this token in the frontend for login implementation
              return `Bearer ${token}`;
            } catch (err) {
              throw new Error(`Error Message: ${err.message}`);
            }
          })
      )
  );