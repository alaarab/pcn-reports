import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, middleName, lastName, dob, patientId },
    } = req;
    const { slug } = req.query;
    const patients = await models.Patient.findAll({
      where: {
        firstName: {
          [Op.like]: `%${req.query.firstName}%`,
        },
        middleName: {
          [Op.like]: `%${req.query.middleName}%`,
        },
        lastName: {
          [Op.like]: `%${req.query.lastName}%`,
        },
        // dob: {
        //   [Op.like]: `%${req.query.dob}%`,
        // },
        patientId: {
          [Op.like]: `%${req.query.patientId}%`,
        },
      },
    });
    return res.status(200).json(patients);
  });

export default handler;
