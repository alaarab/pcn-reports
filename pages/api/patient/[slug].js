import nextConnect from "next-connect";
import middleware from "middlewares/middleware";
import { Op } from "sequelize";
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
            {
              model: models.Assignment,
              as: "assignment",
              required: false,
              where: { amount: { [Op.gt]: 0 } },
              order: [
                { model: models.Assignment, as: "assignment" },
                "chargeLine",
                "asc",
              ],
              include: [
                {
                  model: models.Payment,
                  as: "payment",
                  include: [
                    { model: models.InsurancePlan, as: "insurancePlan" },
                  ],
                },
              ],
            },
            {
              model: models.Charge,
              as: "charge",
              include: [
                { model: models.Procedure, as: "procedure" },
                {
                  model: models.DiagCode,
                  as: "diagCode",
                  include: [{ model: models.DiagCode, as: "diagCodeLegacy" }],
                },
              ],
            },
            { model: models.PlanCoverage, as: "planCoverage" },
          ],
        },
        {
          model: models.PatientPlan,
          as: "patientPlan",
          include: [{ model: models.InsurancePlan, as: "insurancePlan" }],
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
