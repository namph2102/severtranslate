const fs = require("fs");
const { getCodeSound } = require("./voices");
const synthesize = require("./synthesize");
const translate = require("./translate");
const casual = require("casual");

import GoogleDrive from "../config/googledrive.config";
import langs from "./languages";

function renderCountry(lang = "en") {
  try {
    return langs[lang] || null;
  } catch (error) {
    return null;
  }
}
// notice that `tts.synthesize` returns a Promise<Buffer>
const saveSpeakFollowVoice = async (text, voice) => {
  const buffer = await synthesize({
    text,
    voice: getCodeSound(voice) || "en",
    slow: false, // optional
  });

  // const url = rootPath + "/public/" + casual.uuid.substring(0, 8) + ".mp3";
  const url = "/" + casual.uuid.substring(0, 8) + ".mp3";

  await fs.writeFileSync(url, buffer);
  const result = await GoogleDrive.upLoadSound(url);
  return { sound: "https://drive.google.com/uc?id=" + result, id: result };
};

class translateBuilder {
  constructor(text, lang = "en") {
    this.text = text.toLowerCase().trim();
    this.lang = lang;

    this.error = `Server Not supported  sound with language -> ${this.lang}`;
    this.errTranslate = `Server Not supported  translate with language -> ${this.lang}`;
  }
  renderLanguageWithSoundCurrent(from = "auto") {
    if (!getCodeSound(from)) throw new Error(this.error);
    const textToSpeak = this.text;
    return translate(this.text, { from, to: this.lang })
      .then(async (newLang) => {
        const { sound, id } = await saveSpeakFollowVoice(textToSpeak, from);

        return {
          sound,
          idSound: id,
          vocab: this.text,
          vocab_translate: newLang,
          lang: this.lang,
          country: renderCountry(this.lang) || this.error,
          lang_current: from,
          country_current: renderCountry(from) || this.error,
          statusCode: 200,
        };
      })
      .catch((err) => {
        throw new Error(err?.message || this.error);
      });
  }
  renderLanguageWithSound(lang = this.lang) {
    if (!getCodeSound(lang)) throw new Error(this.error);
    return translate(this.text, { to: this.lang })
      .then(async (newLang) => {
        const { sound, id } = await saveSpeakFollowVoice(newLang, lang);

        return {
          sound,
          idSound: id,
          vocab: this.text,
          vocab_translate: newLang,
          lang: this.lang,
          country: renderCountry(this.lang) || this.error,
          statusCode: 200,
        };
      })
      .catch((err) => {
        throw new Error(err?.message || this.error);
      });
  }
  renderLanguage(lang = this.lang) {
    return translate(this.text, {
      to: lang,
    })
      .then((newLang) => {
        return {
          vocab: this.text,
          vocab_translate: newLang,
          sound: null,
          idSound: null,
          country: renderCountry(lang) || this.errTranslate,
          lang,
          statusCode: 200,
        };
      })
      .catch((err) => {
        throw new Error(err?.message || this.error);
      });
  }
  renderLanguageExactly(lang = this.lang, from = "vn") {
    return translate(this.text, {
      from: from,
      to: lang,
    })
      .then((newLang) => {
        return {
          vocab: this.text,
          vocab_translate: newLang,
          sound: null,
          idSound: null,
          country: renderCountry(lang) || this.errTranslate,
          lang,
          statusCode: 200,
        };
      })
      .catch((err) => {
        throw new Error(err?.message || this.error);
      });
  }
}

module.exports = translateBuilder;
