import GoogleDriveRouter from "./googleDrive.route";
import CambrigeRouter from "./Cambrige.route";
import GoogleTranslaterRouter from "./GoogleTranslate";

function initRoutes(app) {
  app.use("/api", GoogleDriveRouter);
  app.use("/api", CambrigeRouter);
  app.use("/api/v3", GoogleTranslaterRouter);
}
export default initRoutes;
