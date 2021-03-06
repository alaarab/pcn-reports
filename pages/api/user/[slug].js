import nextConnect from "next-connect";
const models = require("../../../db/models/index");

const handler = nextConnect()
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
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {});

export default handler;
