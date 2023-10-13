import TranslateController from "../controller/translate.controller";
import LimitMiddleware from "../middleware/LimitRequest.middleware";
import MiddleWareTryCatch from "../middleware/trycat.middlleware";
const express = require("express");

const CambrigeRouter = express.Router();
CambrigeRouter.post(
  "/dictionary",
  MiddleWareTryCatch.HandleTryCatchMiddleware(TranslateController.dictionary)
)
  .post(
    "/translater",
    MiddleWareTryCatch.HandleTryCatchMiddleware(TranslateController.translater)
  )
  .post(
    "/image",
    MiddleWareTryCatch.HandleTryCatchMiddleware(TranslateController.FindImage)
  );
export default CambrigeRouter;
