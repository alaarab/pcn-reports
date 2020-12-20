import middleware from "middlewares/middleware";
import nextConnect from "next-connect";
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
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
  } catch (error) {
    if (error.type === "ERROR") {
      res.status(error.status).json(error);
    } else {
      res.status(500).json({
        type: "UNKNOWN_ERROR",
        message: error.message,
      });
    }
  }
});

export default handler;
