import {
    HttpApiBuilder,
  } from "@effect/platform";
  import { Effect } from "effect";
  import {TodoModel } from "../db/db";
  import { currentUser } from "../middleware/middleware";
  import { TodoApi } from "../routes/TodoRoutes";


export const TodoApiLive = HttpApiBuilder.group(TodoApi, "Todos", (handlers) =>
    handlers
      .handle("getTodo", (req) => Effect.promise(async () => {
        const todos = await TodoModel.find({ creator: currentUser }).lean().exec();
        return [...todos];
        
        }))
        .handle("postTodo", (req) =>
          Effect.promise(async () => {
    
            const todo = await TodoModel.create({...req.payload,creator:currentUser,completed:false,completedAt:new Date()});
            return todo
          })
        )
        .handle("deleteTodo", ({path, payload}) =>
          
          Effect.promise(async () => {
            const todo = await TodoModel.findByIdAndDelete(path.idParam).exec();
            return {message:"Deleted Succesfully",todo}
          })
        )
        .handle("updateTodo", ({path, payload}) =>
          Effect.promise(async () => {
            console.log(path.idParam)
            const updatedTodo = await TodoModel.findByIdAndUpdate(path.idParam,{text:payload.text}).exec()
            return {message:"Updated Succesfully",text:payload.text,id:path.idParam}
          })
        )
  );