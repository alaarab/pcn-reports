import middleware from "middlewares/middleware";
import { createRouter } from "next-connect";
const handler = createRouter();
import passport from "middlewares/passport";

handler.use(middleware);

handler.post(passport.authenticate("local"), (req, res) => {
  res.json({
    type: "SESSION_LOGIN_SUCCESS",
    user: req.user,
    valid: true,
    timeLeftMS: req.session.cookie.maxAge,
  });
});

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});