const ErrorHandler = (err, req, res) => {
  try {
    const errStatus = err.statusCode || 404;
    const errMsg = err.message || "Server Busy!";
    const errMessage = {
      success: false,
      statusCode: errStatus,
      message: errMsg,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    };
    if (!process.env.NODE_ENV === "development") {
      delete errMessage.stack;
    }

    res.status(errStatus).json(errMessage);
  } catch {
    res.status(404).json({ statusCode: 404, message: "Server Busy !" });
  }
};
class MiddleWareTryCatch {
  static HandleTryCatchMiddleware(controller) {
    return async (req, res) => {
      try {
        await controller(req, res);
      } catch (error) {
        await ErrorHandler(error, req, res);
      }
    };
  }
}
export default MiddleWareTryCatch;
