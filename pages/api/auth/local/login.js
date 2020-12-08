import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import passport from "middlewares/passport";

const handler = nextConnect();

handler.use(middleware);

handler.post(passport.authenticate("local"), (req, res) => {
  res.json({
    type: "SESSION_LOGIN_SUCCESS",
    user: req.user,
    valid: true,
    timeLeftMS: req.session.cookie.maxAge,
  });
});

export default handler;
