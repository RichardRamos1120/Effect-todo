import {
    HttpApi,
    HttpApiEndpoint,
    HttpApiGroup,
  } from "@effect/platform";
  import { Schema } from "effect";
  import { todoSchema } from "../schemas/Schema";
  import { Authorization } from "../middleware/middleware";
  
  
export const TodoApi = HttpApi.make("TodoApi").add(
    HttpApiGroup.make("Todos")
      .add(
        HttpApiEndpoint.get("getTodo", "/todos")
          .addSuccess(Schema.Array(Schema.Object))
          .middleware(Authorization) // Now inside the endpoint chain
      )
      .add(
        HttpApiEndpoint.post("postTodo", "/todos")
          .setPayload(todoSchema)
          .addSuccess(Schema.Object)
          .middleware(Authorization)
      )
      .add(
        HttpApiEndpoint.del("deleteTodo", `/todos/:idParam`)
          .setPath(Schema.Struct({idParam:Schema.String}))
          .setPayload(todoSchema)
          .addSuccess(Schema.Object)
          .middleware(Authorization)
      )
      .add(
        HttpApiEndpoint.patch("updateTodo", `/todos/:idParam`)
          .setPath(Schema.Struct({idParam:Schema.String}))
          .setPayload(todoSchema)
          .addSuccess(Schema.Object)
          .middleware(Authorization)
      )
  );