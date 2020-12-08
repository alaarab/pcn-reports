import nextConnect from "next-connect";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .get(async (req, res) => {
    const {
      query: { id, name },
    } = req;
    const { slug } = req.query;
    const visitId = slug;
    const visit = await models.Visit.findOne({
      where: {
        visitId: visitId,
      },
    });
    return res.status(200).json(visit);
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {});

export default handler;
