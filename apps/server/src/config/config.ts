import { Effect, Config } from "effect"
require("dotenv").config()


// Define a program that loads HOST and PORT configuration
export const config = {
    port:Config.number("PORT"),
    mongo_uri: Config.string("MONGODB_URI"),
    jwt_secret:Config.string("JWT_SECRET")
}