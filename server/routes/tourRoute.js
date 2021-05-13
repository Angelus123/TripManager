import express from "express";
import * as tourController from "../controllers/TourController";
import * as authController from "../controllers/AuthController"
import reviewRoute from "../routes/reviewRoute"


const tourRoute = express.Router()
tourRoute.use('/:tourId/reviews', reviewRoute)
tourRoute.route("/")
                   .post(authController.protect, 
                    tourController.setTourAndUserId ,
                    tourController.createTour)
                   .get(authController.protect, tourController.getAllTour)
                

tourRoute.route('/:id')
                   .delete(authController.protect ,
                    authController.restrictTo('admin'),
                    tourController.deleteTour)
                   .patch(authController.protect, tourController.updateTour)
                   .get(authController.protect,  tourController.getTour)
// 
export default tourRoute