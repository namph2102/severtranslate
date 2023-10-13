import { renderUrlCambridge } from "../../constant";
import Cambridge from "../../services";

import Until from "../utils";

const request = require("request");
const translateBuilder = require("../../lib/translate");
class TranslateController {
  // dictionary  -- cambridge -- dùng dể tra từ điển
  static dictionary(req, res) {
    const { work, language = "english", to = "vi" } = req.body;
    // https://dictionary.cambridge.org/dictionary/english/parrot

    if (!work && !language && !to) throw new Error("Data is required");
    const url = renderUrlCambridge.dictionary(language, work);

    request(url, async (error, response, html) => {
      if (error && response?.statusCode != 200) {
        res.status(400).json({ message: "Cant dictionary ", status: 400 });
      }
      if (!error) {
        const [data = {}, ToDiction] = await Promise.all([
          Cambridge.dictionary(html),
          translateBuilder(work, { to }),
        ]);

        res.status(200).json({
          statusCode: 200,
          dictionary: ToDiction,
          ...data,
        });
      }
    });
  }
  // dịch sang tiếng anh
  static async translater(req, res) {
    const { work, from = "vi", to = "en" } = req.body;
    if (!work && !language && !to) throw new Error("Data is required");
    const entry = await translateBuilder(work, { from, to });
    const url = renderUrlCambridge.dictionary("english", entry);
    request(url, async (error, response, html) => {
      if (error && response?.statusCode != 200) {
        res.status(400).json({ message: "Cant translater ", status: 400 });
      }
      if (!error) {
        const data = (await Cambridge.dictionary(html)) || {};

        res.status(200).json({
          statusCode: 200,
          dictionary: work,
          ...data,
        });
      }
    });
  }
  static async FindImage(req, res) {
    const { work } = req.body;
    if (!work) throw new Error("Data is required");
    let entry = work;
    if (Until.isVietnameseText(work)) {
      entry = await translateBuilder(work, { to: "en" });
    }

    console.log("tạo ảnh từ chữ:", entry);
    const data = await Cambridge.renderImageFromWord(entry);
    return res.status(200).json({
      statusCode: 200,
      message: "Create Successfully list image follow vocab: " + work,
      work,
      data,
    });
  }
}
export default TranslateController;
