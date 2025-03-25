import {
    HttpApiBuilder,
  } from "@effect/platform";
  import { Effect } from "effect";
  import {TodoModel } from "../db/db";
  import { currentUser } from "../middleware/middleware";
  import { TodoApi } from "../routes/TodoRoutes";


export const TodoApiLive = HttpApiBuilder.group(TodoApi, "Todos", (handlers) =>
    handlers
      .handle("getTodo", (req) => Effect.gen(function*() {
        const todos = yield* Effect.promise(() => 
          TodoModel.find({ creator: currentUser }).lean().exec()
        );
        return [...todos];
      }))

      .handle("postTodo", (req) => Effect.gen(function*() {
        const todo = yield* Effect.promise(() => 
          TodoModel.create({...req.payload, creator: currentUser, completed: false, completedAt: new Date()})
        );
        return todo;
      }))

      .handle("deleteTodo", ({path, payload}) => Effect.gen(function*() {
        const todo = yield* Effect.promise(() => 
          TodoModel.findByIdAndDelete(path.idParam).exec()
        );
        return {message: "Deleted Succesfully", todo};
      }))

      .handle("updateTodo", ({path, payload}) => Effect.gen(function*() {
        console.log(path.idParam);
        const updatedTodo = yield* Effect.promise(() => 
          TodoModel.findByIdAndUpdate(path.idParam, {text: payload.text}).exec()
        );
        return {message: "Updated Succesfully", text: payload.text, id: path.idParam};
      }))
  );