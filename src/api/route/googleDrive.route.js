import GoogleDrive from "../controller/googledrive.controller";
import LimitMiddleware from "../middleware/LimitRequest.middleware";
import MiddleWareTryCatch from "../middleware/trycat.middlleware";
const express = require("express");

const GoogleDriveRouter = express.Router();
GoogleDriveRouter.post(
  "/create/sound",

  MiddleWareTryCatch.HandleTryCatchMiddleware(GoogleDrive.createWithSound)
)
  .post(
    "/create/current",

    MiddleWareTryCatch.HandleTryCatchMiddleware(
      GoogleDrive.createWithSoundCurrent
    )
  )
  .post(
    "/create/translate/exactly",

    MiddleWareTryCatch.HandleTryCatchMiddleware(
      GoogleDrive.createOnlyTranslateEXactly
    )
  )
  .post(
    "/create/translate",

    MiddleWareTryCatch.HandleTryCatchMiddleware(GoogleDrive.createOnlyTranslate)
  );
export default GoogleDriveRouter;
