import express from "express";
import * as tourController from "../controllers/TourController";
import * as authControl from "../controllers/AuthController"



const tourRoute = express.Router()

tourRoute.route("/")
                   .post(authControl.protect, tourController.createTour)
                   .get(authControl.protect, tourController.getAllTour)
                

tourRoute.route('/:id')
                   .delete(authControl.protect ,
                    authControl.restrictTo('admin'),
                    tourController.deleteTour)
                   .patch(authControl.protect, tourController.updateTour)
                   .get(authControl.protect,  tourController.getTour)


export default tourRoute