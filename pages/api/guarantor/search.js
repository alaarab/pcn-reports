import { createRouter } from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
const models = require("../../../db/models/index");

const handler = createRouter()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { firstName, lastName, page, sizePerPage },
    } = req;

    const guarantor = await models.Guarantor.findAndCountAll({
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
    return res.status(200).json(guarantor);
  });

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});