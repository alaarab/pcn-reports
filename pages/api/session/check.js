import middleware from "middlewares/middleware";
import { createRouter } from "next-connect";
const handler = createRouter();

handler.use(middleware);

handler.get(async (req, res) => {
  if (req.user) {
    res.status(200).json({
      type: "SESSION_CHECK_DONE",
      valid: true,
      timeLeftMS: req.session.cookie.maxAge,
      user: req.user,
    });
  } else {
    res.status(200).json({
      type: "SESSION_CHECK_DONE",
      valid: false,
      timeLeftMS: 0,
      user: req.user,
    });
  }
});

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});