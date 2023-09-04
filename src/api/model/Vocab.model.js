import pkg from "mongoose";
const { Schema, model, models } = pkg;
const VocabSchema = new Schema({
  vocab: { type: String, require: true, lowercase: true },
  translate: [{ type: Schema.Types.ObjectId, ref: "Translate" }],
});
const VocabModel = models.Vocab || model("Vocab", VocabSchema);
export default VocabModel;
