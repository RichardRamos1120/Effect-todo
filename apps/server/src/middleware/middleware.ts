import {Effect, Context, Layer,Schema, Redacted} from "effect"
import {config} from "../config/config"
import {
    HttpApiMiddleware,
    HttpApiSchema,
    HttpApiSecurity,
  } from "@effect/platform"
import jwt from "jsonwebtoken";

class User extends Schema.Class<User>("User")({
  id: Schema.String,
  email: Schema.String
}) {}

// Define a schema for the "Unauthorized" error
class Unauthorized extends Schema.TaggedError<Unauthorized>()(
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
        Effect.promise(async () => {
          try {
            const jwtSecret = await Effect.runPromise(config.jwt_secret);

            const decoded = await jwt.verify(Redacted.value(bearerToken), jwtSecret) as { userId: string; email: string };
            console.log("Decoded token:", decoded);
            currentUser = decoded.userId
            return new User({email:decoded.email,id:decoded.userId});
          } catch (error) {
            // Log error details for debugging
            console.error("Invalid token:", error.message);
            throw new Unauthorized();
          }
        })
    };
  })
);
