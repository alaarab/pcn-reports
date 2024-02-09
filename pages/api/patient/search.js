import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, lastName, practiceId, page, sizePerPage },
    } = req;

    const where = {
      firstName: {
        [Op.iLike]: `%${firstName}%`,
      },
      lastName: {
        [Op.iLike]: `%${lastName}%`,
      },
    };

    const include = [{
      model: models.Practice,
      as: "practice",
      where: {},
    }];

    if (practiceId) {
      include[0].where = {
        id: practiceId // Assuming practiceId is already an integer
      };
    }

    const patients = await models.Patient.findAndCountAll({
      where: where,
      include: include,
      offset: (page - 1) * sizePerPage,
      limit: sizePerPage,
    });

    return res.status(200).json(patients);
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});