import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, lastName, page, sizePerPage },
    } = req;

    const patients = await models.Patient.findAndCountAll({
      where: {
        firstName: {
          [Op.iLike]: `%${firstName}%`,
        },
        lastName: {
          [Op.iLike]: `%${lastName}%`,
        },
      },
      offset: (page - 1) * sizePerPage,
      limit: sizePerPage,
    });
    return res.status(200).json(patients);
  });

export default handler;
