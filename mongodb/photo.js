const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PhotoSchema = new Schema({
  albumId: Number,
  명령어: String,
  발동: String,
});

module.exports = mongoose.model("Photo", PhotoSchema); //("Photo", PhotoSchema, "Photo");3번째 매개변수로 collection으로 고정
