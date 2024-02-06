import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = createRouter()
  .use(middleware)
  .post(async (req, res) => {
    const {
      body: { correctionId },
    } = req;

    const correction = await models.Correction.destroy({
      where: { id: correctionId },
    });

    return res.status(200).json(correction);
  });
  
export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});