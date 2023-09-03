const translateBuilder = require("../../lib");
const events = require("events");
export const eventEmitter = new events.EventEmitter();

class GoogleDrive {
  static async createWithSound(req, res) {
    const { message, lang } = req.body;
    if (!message || !lang) throw new Error("data is required");
    const builder = new translateBuilder(message, lang);
    const result = await builder.renderLanguageWithSound();

    if (!result || result.statusCode !== 200) {
      throw new Error(result.message);
    } else {
      eventEmitter.emit("insertVocabIntoDatabase", JSON.stringify(result));
    }
    res.status(201).json(result);
  }
  static async createOnlyTranslate(req, res) {
    console.log(req.body);
    const { message, lang } = req.body;
    if (!message || !lang) throw new Error("data is required");

    const builder = new translateBuilder(message, lang);
    const result = await builder.renderLanguage();
    if (!result || result.statusCode !== 200) {
      throw new Error(result.message);
    } else {
      eventEmitter.emit("insertVocabIntoDatabase", JSON.stringify(result));
    }
    res.status(201).json(result);
  }
  static async createOnlyTranslateEXactly(req, res) {
    const { message, from, to } = req.body;
    const builder = new translateBuilder(message, to);
    const result = await builder.renderLanguageExactly(to, from);
    if (!result || result.statusCode !== 200) {
      throw new Error(result.message);
    } else {
      eventEmitter.emit("insertVocabIntoDatabase", JSON.stringify(result));
    }
    res.status(201).json(result);
  }
}

export default GoogleDrive;
