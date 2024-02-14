import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

// Helper function to calculate patient balance
export const calculatePatientBalance = (patient) => {
  const visitTotal = patient.visit
    .reduce((total, { charge, assignment }) => {
      const chargeTotal = charge.reduce((sum, { amount }) => sum + amount, 0);
      const paymentTotal = assignment.reduce((sum, { amount }) => sum + amount, 0);
      return total + chargeTotal - paymentTotal;
    }, 0);

  const correctionTotal = patient.correction
    .reduce((total, { amount }) => total + parseFloat(amount), 0);

  return visitTotal - correctionTotal;
};

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, lastName, practiceId, page, sizePerPage, all },
    } = req;

    const where = {
      firstName: {
        [Op.iLike]: `%${firstName}%`,
      },
      lastName: {
        [Op.iLike]: `%${lastName}%`,
      },
    };

    const include = [
      {
        model: models.Practice,
        as: "practice",
        where: {},
      },
      {
        model: models.Visit,
        as: "visit",
        include: [
          { model: models.Charge, as: "charge" },
          { model: models.Assignment, as: "assignment" },
        ],
      },
      {
        model: models.Practice,
        as: "practice",
      },
      {
        model: models.Correction,
        as: "correction",
      },
    ];

    if (practiceId) {
      include.push({
        model: models.Practice,
        as: "practice",
        where: { id: practiceId },
      });
    }

    let queryOptions = {
      where: where,
      include: include,
      order: [['lastName', 'ASC'], ['firstName', 'ASC']],
    };

    if (!all) {
      queryOptions = {
        ...queryOptions,
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
      };
    }

    const patientData = await models.Patient.findAll(queryOptions);

    // Count total patients with same filters but without pagination
    const patientCount = await models.Patient.count({
      where: where,
      include: practiceId ? [{ model: models.Practice, as: "practice", where: { id: practiceId } }] : []
    });

    const patientsWithTotal = patientData.map(patient => ({
      ...patient.toJSON(),
      balance: calculatePatientBalance(patient),
    }));

    return res.status(200).json({
      rows: patientsWithTotal,
      count: patientCount,
    });
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});