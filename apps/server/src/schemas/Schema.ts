import {Schema} from "effect"

const userSchema = Schema.Struct({
    id:Schema.optional(Schema.String),
    email:Schema.String,
    password:Schema.String
})

const todoSchema = Schema.Struct({
    id: Schema.optional(Schema.String),
    text: Schema.optional(Schema.String),
    creator: Schema.optional(Schema.String),
    completedAt: Schema.optional(Schema.Date),
    completed: Schema.optional(Schema.Boolean)
});

const currentUserSchema = Schema.Struct({
    id: Schema.String,
    email: Schema.String
  });
  
  

export {userSchema,todoSchema,currentUserSchema}


