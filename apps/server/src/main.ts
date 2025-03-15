import {
  HttpApiBuilder,
} from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Effect, Layer } from "effect";
import { createServer } from "node:http";
import { config } from "./config/config";
import { MongooseLive } from "./db/db";
import { AuthorizationLive } from "./middleware/middleware";
import { TodoApi } from "./routes/TodoRoutes";
import { TodoApiLive } from "./controller/TodoController";
import { UserApi } from "./routes/UsersRoutes";
import { UserApiLive } from "./controller/UsersController";

const MyTodoApiLive = HttpApiBuilder.api(TodoApi).pipe(Layer.provide(TodoApiLive));
const MyUserApiLive = HttpApiBuilder.api(UserApi).pipe(Layer.provide(UserApiLive));

const ServerLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const port = yield* config.port;

    return HttpApiBuilder.serve().pipe(
      Layer.provide(MongooseLive),
      Layer.provide(MyUserApiLive),
      Layer.provide(MyTodoApiLive),
      Layer.provide(AuthorizationLive),
      Layer.provide(NodeHttpServer.layer(createServer, { port })),
    );
  })
);


Layer.launch(ServerLive).pipe(NodeRuntime.runMain)