import express from "express";
import * as articleControl from "../controllers/articleController";
import article from "../models/Article";
import * as authControl from "../controllers/AuthController"


const articleRoute = express.Router()

articleRoute.route("/")
                   .post(authControl.protect, articleControl.createArticle)
                   .get(authControl.protect, articleControl.getAllArticles)
                

articleRoute.route('/:id')
                   .delete(authControl.protect ,
                    authControl.restrictTo('admin'),
                    articleControl.deleteArticle)
                   .patch(authControl.protect, articleControl.updateArticle)
                   .get(authControl.protect,  articleControl.getArticle)


export default articleRoute;