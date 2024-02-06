
import { createRouter } from "next-connect";
import session from "./session";
import passport from "./passport";

const middleware  = createRouter();

middleware.use(session).use(passport.initialize()).use(passport.session());

export default middleware;
