import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
import { calculatePatientBalance } from "../patient/search";
const models = require("../../../db/models/index");

// Helper function to calculate guarantor balance, use calculatePatientBalance on the guarantor's patients
export const calculateGuarantorBalance = (guarantor) => {
  return guarantor.patient
    .map(calculatePatientBalance)
    .reduce((a, b) => a + b, 0);
};

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, lastName, page, practiceId, sizePerPage, all },
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
        model: models.Patient,
        as: "patient",
        include: [
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
        ],
      },
    ];

    // Adding condition for practiceId
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

    const guarantors = await models.Guarantor.findAndCountAll(queryOptions);

    const guarantorsWithTotal = guarantors.rows.map(guarantor => ({
      ...guarantor.toJSON(),
      balance: calculateGuarantorBalance(guarantor),
    }));

    return res.status(200).json({
      rows: guarantorsWithTotal,
      count: guarantors.count,
    });
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
