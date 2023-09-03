import VocabModel from "../model/Vocab.model";
import GoogleDrive from "../../config/googledrive.config";
import { eventEmitter } from "../controller/googledrive.controller";

eventEmitter.on("insertVocabIntoDatabase", async function (message) {
  try {
    const data = JSON.parse(message);
    if (data.vocab_translate) {
      const vocab = data.vocab.trim().toLowerCase();
      const { vocab_translate, lang, sound, idSound } = data;
      let checkExtent = await VocabModel.findOne({
        vocab,
      });
      if (!checkExtent) {
        checkExtent = await VocabModel.create({
          vocab,
          listTranslate: {
            vocab: vocab_translate,
            lang: lang,
            sound,
            idSound,
          },
        });
      } else {
        const checkExtentInArray = await VocabModel.findOne({
          vocab,
          listTranslate: {
            $elemMatch: {
              lang: lang,
            },
          },
        });

        if (!checkExtentInArray) {
          await VocabModel.findOneAndUpdate(
            { vocab },
            {
              $push: {
                listTranslate: {
                  vocab: vocab_translate,
                  lang: lang,
                  sound,
                  idSound,
                },
              },
            }
          );
        } else {
          const getIdSoundOld = checkExtentInArray.listTranslate.find(
            (item) => item.lang == lang
          );

          // Xóa file âm thanh cũ
          if (getIdSoundOld) {
            try {
              getIdSoundOld?.idSound &&
                (await GoogleDrive.deletefile(getIdSoundOld.idSound));
            } catch (error) {}
          }
          //end Xóa file âm thanh cũ

          // Chèn âm anh mới vào
          sound &&
            (await VocabModel.updateOne(
              {
                vocab,
                "listTranslate.vocab": vocab_translate,
                "listTranslate.lang": lang,
              },
              {
                $set: {
                  "listTranslate.$.sound": sound,
                  "listTranslate.$.idSound": idSound,
                },
              }
            ));
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
});
