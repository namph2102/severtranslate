import GoogleTranslateController from "../controller/googletranslate.controller";
import LimitMiddleware from "../middleware/LimitRequest.middleware";
import MiddleWareTryCatch from "../middleware/trycat.middlleware";
const express = require("express");

const GoogleTranslaterRouter = express.Router();
GoogleTranslaterRouter.post(
  "/dictionary",
  MiddleWareTryCatch.HandleTryCatchMiddleware(
    GoogleTranslateController.translator
  )
);
export default GoogleTranslaterRouter;
