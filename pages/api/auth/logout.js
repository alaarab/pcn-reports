import nextConnect from "next-connect";
import middleware from "middlewares/middleware";

const handler = nextConnect();

handler.use(middleware);

handler.get((req, res) => {
  req.logOut();
  res.redirect('/');
});

export default handler;
