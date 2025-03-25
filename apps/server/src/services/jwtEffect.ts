import { Effect, Schema, Context } from "effect";
import jwt from "jsonwebtoken";
import { Redacted } from "effect";
import {
  HttpApiMiddleware,
  HttpApiSchema,
  HttpApiSecurity,
} from "@effect/platform";

// JWT operations wrapped in Effect

export class User extends Schema.Class<User>("User")({
  id: Schema.String,
  email: Schema.String,
}) {}

// Define a schema for the "Unauthorized" error
export class Unauthorized extends Schema.TaggedError<Unauthorized>()(
  "Unauthorized",
  {},
  // Specify the HTTP status code for unauthorized errors
  HttpApiSchema.annotations({ status: 401 })
) {}

export class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, User>() {}

// Create the Authorization middleware
export class Authorization extends HttpApiMiddleware.Tag<Authorization>()(
  "Authorization",
  {
    failure: Unauthorized,
    provides: CurrentUser,
    security: {
      myBearer: HttpApiSecurity.bearer,
    },
  }
) {}

export const JwtEffect = {
  // Sign a JWT token
  sign: <T extends Record<string, unknown>>(
    payload: T,
    secret: string,
    options?: jwt.SignOptions
  ) =>
    Effect.sync(() => jwt.sign(payload, secret, options)),

  // Verify a JWT token
  verify: <T>(token: string, secret: string) =>
    Effect.tryPromise(() =>
      new Promise<T>((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded as T);
          }
        });
      })
    ).pipe(
      Effect.catchAll(() => {
        console.error("Invalid token:");
        return Effect.fail(new Unauthorized());
      })
    ),
};
