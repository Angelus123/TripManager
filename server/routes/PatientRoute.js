import express from "express";
import * as patientControl from "../controllers/PatientControllers";
import PatientInfos from "../models/Patient";

const patientRouter = express.Router()

patientRouter.route("/")
                   .post(patientControl.createPatient)
                   .get(patientControl.getAllPatient)
                   

patientRouter.route('/:id')
                   .delete(patientControl.deletePatient)
                   .patch(patientControl.updatePatient)
                   .get(patientControl.getPatient)


export default patientRouter;