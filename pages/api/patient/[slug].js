import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
const models = require("../../../db/models/index");

const handler = nextConnect()
  .use(middleware)
  .get(async (req, res) => {
    const {
      query: { id, name },
    } = req;
    const { slug } = req.query;
    const patientId = slug;
    const patient = await models.Patient.findOne({
      where: {
        id: patientId,
      },
      include: [
        {
          model: models.Visit,
          as: "visit",
          include: [
            { model: models.Assignment, as: "assignment" },
            { model: models.Charge, as: "charge" },
            { model: models.PlanCoverage, as: "planCoverage" },
            { model: models.Payment, as: "payment" },
          ],
        },
        {
          model: models.Guarantor,
          as: "guarantor",
        },
      ],
    });
    return res.status(200).json(patient);
  })
  .post(async (req, res) => {})
  .put(async (req, res) => {})
  .patch(async (req, res) => {});

export default handler;
