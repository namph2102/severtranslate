const translateBuilder = require("../../lib");
const events = require("events");
import TranslateModel from "../model/Translate.model";
export const eventEmitter = new events.EventEmitter();

class GoogleDrive {
  static async createWithSoundCurrent(req, res) {
    const { message, from, to } = req.body;

    if (!message) throw new Error("data is required");
    const builder = new translateBuilder(message, to);
    const result = await builder.renderLanguageWithSoundCurrent(from);

    if (!result || result.statusCode !== 200) {
      throw new Error(result.message);
    } else {
      eventEmitter.emit("insertVocabIntoDatabase", JSON.stringify(result));
    }
    const soundCheck = await TranslateModel.findOne({
      vocab: result.vocab_translate,
      lang: result.lang,
    });
    if (soundCheck?.sound && soundCheck?.idSound) {
      result.sound = soundCheck.sound;
      result.idSound = soundCheck.idSound;
    }
    res.status(201).json(result);
  }
  static async createWithSound(req, res) {
    const { message, lang } = req.body;

    if (!message) throw new Error("data is required");
    const builder = new translateBuilder(message, lang);
    const result = await builder.renderLanguageWithSound(lang);

    if (!result || result.statusCode !== 200) {
      throw new Error(result.message);
    } else {
      eventEmitter.emit("insertVocabIntoDatabase", JSON.stringify(result));
    }
    const soundCheck = await TranslateModel.findOne({
      vocab: result.vocab_translate,
      lang: result.lang,
    });
    if (soundCheck?.sound && soundCheck?.idSound) {
      result.sound = soundCheck.sound;
      result.idSound = soundCheck.idSound;
    }
    res.status(201).json(result);
  }
  static async createOnlyTranslate(req, res) {
    const { message, lang } = req.body;
    if (!message) throw new Error("data is required");

    const builder = new translateBuilder(message, lang);
    const result = await builder.renderLanguage();
    if (!result || result.statusCode !== 200) {
      throw new Error(result.message);
    } else {
      eventEmitter.emit("insertVocabIntoDatabase", JSON.stringify(result));
    }
    try {
      delete result.idSound;
      delete result.sound;
    } catch {}
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
    try {
      delete result.idSound;
      delete result.sound;
    } catch {}

    res.status(201).json(result);
  }
}

export default GoogleDrive;
