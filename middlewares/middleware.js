import nextConnect from "next-connect";
import session from "./session";
import passport from "./passport";

const middleware = nextConnect();

middleware
  .use(session)
  .use(passport.initialize())
  .use(passport.session())

export default middleware;
