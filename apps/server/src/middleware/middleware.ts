import {Effect, Context, Layer, Schema, Redacted} from "effect"
import {config} from "../config/config"
import {
    HttpApiMiddleware,
    HttpApiSchema,
    HttpApiSecurity,
  } from "@effect/platform"
import jwt from "jsonwebtoken";
import { JwtEffect, User, Unauthorized } from "../services/jwtEffect";


export class CurrentUser extends Context.Tag("CurrentUser")<CurrentUser, User>() {}

// Create the Authorization middleware
export class Authorization extends HttpApiMiddleware.Tag<Authorization>()(
  "Authorization",
  {
    failure: Unauthorized,
    provides: CurrentUser,
    security: {
      myBearer: HttpApiSecurity.bearer
    }
  }
) {}

export let currentUser = {}

export const AuthorizationLive = Layer.effect(
  Authorization,
  Effect.gen(function* () {
    yield* Effect.log("Initializing Authorization middleware");

    return {
      myBearer: (bearerToken) =>
        Effect.gen(function* () {
          // Get JWT secret
          const jwtSecret = yield* Effect.orDie(config.jwt_secret);

          // Verify JWT token using JwtEffect.verify directly
          const decoded = yield* JwtEffect.verify<{ userId: string; email: string }>(
            Redacted.value(bearerToken),
            jwtSecret
          );

          // Log decoded token
          yield* Effect.sync(() => {
            console.log("Decoded token:", decoded);
            currentUser = decoded.userId;
          });

          // Return user object
          return new User({ email: decoded.email, id: decoded.userId });
        }),
    };
  })
);