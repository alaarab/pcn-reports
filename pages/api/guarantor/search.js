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

    const guarantor = await models.Guarantor.findAndCountAll({
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
      offset: page-1,
      limit: 10,
    });
    return res.status(200).json(guarantor);
  });

export default handler;
