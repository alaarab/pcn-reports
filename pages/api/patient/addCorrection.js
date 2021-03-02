import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .post(async (req, res) => {
    const {
      body: { patientId, date, amount, notes },
    } = req;

    const correction = await models.Correction.create({ patientId, date, amount, notes });

    return res.status(200).json(correction);
  });

export default handler;
