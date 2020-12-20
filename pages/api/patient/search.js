import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { id, firstName, middleName, lastName, dob, page, pageSize },
    } = req;

    const patients = await models.Patient.findAndCountAll({
      where: {
        id: {
          [Op.iLike]: `%${id}%`,
        },
        firstName: {
          [Op.iLike]: `%${firstName}%`,
        },
        middleName: {
          [Op.iLike]: `%${middleName}%`,
        },
        lastName: {
          [Op.iLike]: `%${lastName}%`,
        },
        // dob: {
        //   [Op.like]: `%${dob}%`,
        // },
      },
      offset: page - 1,
      limit: 10,
    });
    return res.status(200).json(patients);
  });

export default handler;
