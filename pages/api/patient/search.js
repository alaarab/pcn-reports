import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, middleName, lastName, dob, patientNumber },
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
        patientNumber: {
          [Op.like]: `%${req.query.patientNumber}%`,
        },
      },
      include: [
        {
          model: models.Visit,
          as: "visit",
          include: [
            { model: models.Charge, as: "charge" },
            { model: models.PlanCoverage, as: "planCoverage" },
            { model: models.Payment, as: "payment" },
          ],
        },
      ],
    });
    return res.status(200).json(patients);
  });

export default handler;
