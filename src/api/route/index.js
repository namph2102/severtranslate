import GoogleDriveRouter from "./googleDrive.route";

function initRoutes(app) {
  app.use("/api", GoogleDriveRouter);
}
export default initRoutes;
