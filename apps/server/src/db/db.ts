import {Effect, Context, Layer} from "effect"
import mongoose from "mongoose"
import {config} from "../config/config"
import { Schema as MongooseSchema, model } from "mongoose"

// Mongoose Schemas
const UserMongooseSchema = new MongooseSchema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  const TodoMongooseSchema = new MongooseSchema({
    text: { type: String, required: true },
    creator: { type: String, required: false },
    completedAt: { type: Date, required: false },
    completed: { type: Boolean, required: false },
  });

// Mongoose Models
const UserModel = model("User", UserMongooseSchema);
const TodoModel = model("Todo", TodoMongooseSchema);


// Define an interface for your Mongoose connection
interface MongooseConnection {
    connection: typeof mongoose.connection
  }
  
  // Create a tag for the Mongoose connection
  class MongooseTag extends Context.Tag("MongooseTag")<MongooseTag,MongooseConnection>() {}
  
  // Define a live layer that connects to MongoDB and provides the connection
const MongooseLive = Layer.unwrapEffect(
    Effect.gen(function*(){

        const baseurl = yield* config.mongo_uri

        return Layer.effect(
            MongooseTag,
            Effect.tryPromise(() =>
              mongoose.connect(baseurl).then(() => ({
                connection: mongoose.connection,
                useNewUrlParser: true,
                useUnifiedTopology: true
              })).finally(()=>Effect.runPromise(Effect.logInfo("Connected to Mongo")))
            )
          )

    })
  )

  export {MongooseLive, UserModel, TodoModel}