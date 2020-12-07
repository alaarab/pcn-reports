import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { id, name },
    } = req;
    const { slug } = req.query;
    const patientNumber = slug;
    const user = await models.Patient.findOne({
      where: {
        patientNumber: patientNumber,
      },
    });
    return res.status(200).json(user);
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {});

export default handler;
