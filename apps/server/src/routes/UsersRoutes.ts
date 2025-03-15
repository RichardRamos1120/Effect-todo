import {
    HttpApi,
    HttpApiEndpoint,
    HttpApiGroup,
  } from "@effect/platform";

  import { Schema } from "effect";
  import { userSchema } from "../schemas/Schema";


export const UserApi = HttpApi.make("UserApi").add(
    HttpApiGroup.make("Users")
      .add(
        HttpApiEndpoint.post("register", "/users")
          .setPayload(userSchema)
          .addSuccess(Schema.String)
      )
      .add(
        HttpApiEndpoint.post("login", "/users/login")
          .setPayload(userSchema)
          .addSuccess(Schema.String)
      )
  );