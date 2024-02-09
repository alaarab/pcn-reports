import { createRouter } from "next-connect";
import middleware from "../../../middlewares/middleware";
const models = require("../../../db/models/index");

const handler = createRouter();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const practices = await models.Practice.findAll({
      attributes: ['id', 'name'] // Fetch only necessary attributes
    });
    res.status(200).json(practices);
  } catch (error) {
    console.error("Error fetching practices:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default handler.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});