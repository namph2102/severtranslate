import RedisServer from "../../config/redis.config";

const limit = 50;
const LimitMiddleware = async (req, res, next) => {
  const ip = res.header["x-forwarded-for"] || res.connection.remoteAddress;
  let ss;
  let numberRequest = await RedisServer.incr(ip);
  try {
    if (numberRequest == 1) {
      await RedisServer.expire(ip, limit);
      ss = limit;
    } else {
      ss = await RedisServer.ttl(ip);
    }
    if (ss < 0) {
      await RedisServer.expire(ip, limit);
    }
    if (numberRequest > limit) {
      throw new Error("Sever is busy!");
    }

    next();
  } catch (error) {
    res.status(503).json({
      status: false,
      timeExpire: ss,
      numberRequest,
      message: error.message,
    });
  }
};
export default LimitMiddleware;
