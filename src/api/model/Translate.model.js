import pkg from "mongoose";
const { Schema, model, models } = pkg;
const TranslateSchema = new Schema(
  {
    vocab: { type: String, require, lowercase: true },
    lang: { type: String, require },
    sound: { type: String, default: "" },
    idSound: { type: String, default: "" },
  },
  { timestamps: true }
);
const TranslateModel = models.Translate || model("Translate", TranslateSchema);
export default TranslateModel;
