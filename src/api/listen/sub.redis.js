import VocabModel from "../model/Vocab.model";
import GoogleDrive from "../../config/googledrive.config";
import { eventEmitter } from "../controller/googledrive.controller";
import TranslateModel from "../model/Translate.model";

eventEmitter.on("insertVocabIntoDatabase", async function (message) {
  try {
    const data = JSON.parse(message);
    if (data.vocab_translate) {
      const { vocab_translate, lang, sound, idSound, vocab } = data;
      let vocabFind = await VocabModel.findOne({
        vocab,
      });
      if (!vocabFind) {
        const result = await TranslateModel.create({
          vocab: vocab_translate,
          lang: lang,
          sound,
          idSound,
        });

        result._id &&
          (await VocabModel.create({
            vocab,
            translate: result._id,
          }));
      } else {
        if (!sound) {
          return true;
        }
        // kiểm tra thử lang có trong ngô ngữ dịch không
        const checkExtentInArray = await TranslateModel.findOne({
          vocab: vocab_translate,
          lang: lang,
        });

        if (!checkExtentInArray) {
          const result = await TranslateModel.create({
            vocab: vocab_translate,
            lang: lang,
            sound,
            idSound,
          });

          result._id &&
            (await VocabModel.findByIdAndUpdate(vocabFind._id, {
              $push: { translate: result._id },
            }));
        } else {
          if (checkExtentInArray.idSound) {
            await GoogleDrive.deletefile(idSound);
          } else {
            checkExtentInArray._id &&
              idSound &&
              sound &&
              (await TranslateModel.findByIdAndUpdate(checkExtentInArray._id, {
                sound,
                idSound,
              }));
          }
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
});
