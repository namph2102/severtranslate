import pkg from "mongoose";
const { Schema, model, models } = pkg;
const VocabSchema = new Schema(
  {
    vocab: { type: String, require: true, lowercase: true },
    listTranslate: [
      {
        vocab: { type: String, require },
        lang: { type: String, require },
        sound: { type: String, default: "" },
        idSound: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);
const VocabModel = models.Vocab || model("Vocab", VocabSchema);
export default VocabModel;
