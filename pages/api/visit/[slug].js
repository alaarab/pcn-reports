import nextConnect from "next-connect";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .get(async (req, res) => {
    const {
      query: { id, name },
    } = req;
    const { slug } = req.query;
    const visitNumber = slug;
    const visit = await models.Visit.findOne({
      where: {
        visitNumber: visitNumber,
      },
    });
    res.statusCode = 200;
    return res.json({ status: "success", data: visit });
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {});

export default handler;
