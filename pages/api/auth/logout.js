
import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";

const handler = createRouter();

handler.use(middleware);

handler.get((req, res) => {
  req.logOut();
  res.redirect("/");
});

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
})