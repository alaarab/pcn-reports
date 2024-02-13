import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
import { calculatePatientBalance } from "../patient/search"; // Import patient balance calculation
import { calculateGuarantorBalance } from "../guarantor/search"; // Import guarantor balance calculation
import { formatAmount } from "assets/util";
const models = require("../../../db/models/index");

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { start, end, page, sizePerPage },
    } = req;

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Include Patient and Guarantor in the query
    const include = [
      {
        model: models.Patient,
        as: 'patient',
        include: [
          {
            model: models.Guarantor,
            as: 'guarantor',
            include: [
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
                    model: models.Correction,
                    as: "correction",
                  },
                ],
              },
            ]
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
            model: models.Correction,
            as: "correction",
          }
        ]
      }
    ];

    let queryOptions = {
      where: {
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      include: include,
      order: [['date', 'ASC']]
    };

    if (!isNaN(page) && !isNaN(sizePerPage)) {
      queryOptions = {
        ...queryOptions,
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
      };
    }

    const corrections = await models.Correction.findAndCountAll(queryOptions);

    const correctionsWithDetails = corrections.rows.map(correction => ({
      patientName: `${correction.patient.firstName} ${correction.patient.lastName}`,
      guarantorName: correction.patient.guarantor ? `${correction.patient.guarantor.firstName} ${correction.patient.guarantor.lastName}` : 'N/A',
      amount: formatAmount(correction.amount),
      date: correction.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      patientBalance: calculatePatientBalance(correction.patient),
      guarantorBalance: calculateGuarantorBalance(correction.patient.guarantor),
    }));

    return res.status(200).json({
      rows: correctionsWithDetails,
      count: corrections.count,
    });
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
