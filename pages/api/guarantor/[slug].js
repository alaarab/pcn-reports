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
    const guarantorId = slug;
    const guarantor = await models.Guarantor.findOne({
      where: {
        id: guarantorId,
      },
      include: [
        {
          model: models.Patient,
          as: "patient"
        },
      ],
    });
    return res.status(200).json(guarantor);
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {});

export default handler;
