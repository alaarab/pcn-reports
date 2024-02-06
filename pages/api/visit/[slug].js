import { createRouter } from "next-connect";
const models = require("../../../db/models/index");

const handler = createRouter()
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
  .post(async (req, res) => { })
  .put(async (req, res) => { })
  .patch(async (req, res) => { });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});