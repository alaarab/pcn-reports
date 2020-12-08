import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { id, firstName, middleName, lastName, dob },
    } = req;
    const patients = await models.Patient.findAll({
      where: {
        id: {
          [Op.like]: `%${id}%`,
        },
        firstName: {
          [Op.like]: `%${firstName}%`,
        },
        middleName: {
          [Op.like]: `%${middleName}%`,
        },
        lastName: {
          [Op.like]: `%${lastName}%`,
        },
        // dob: {
        //   [Op.like]: `%${dob}%`,
        // },
      },
    });
    return res.status(200).json(patients);
  });

export default handler;
