import { createRouter } from "next-connect";
const models = require("../../../db/models/index");

const handler = createRouter()
  .get(async (req, res) => {
    const {
      query: { id, name },
    } = req;
    const { slug } = req.query;
    const userId = slug;
    const user = await models.User.findOne({
      where: {
        id: userId,
      },
    });
    return res.status(200).json(user);
  })
  .post(async (req, res) => { })
  .put(async (req, res) => { })
  .patch(async (req, res) => { });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});