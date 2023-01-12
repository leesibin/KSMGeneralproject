require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });

const mongoose = require("mongoose");
const USER = process.env.dbid;
const PWD = process.env.dbpw;
const HOST = process.env.dbhost;
const DB = "mdb";
const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}/${DB}`;

// mongoose.set('useFindAndModify', false)/* 6.0 이후부터는 자동관리. 필요없다. */
mongoose.set("strictQuery", false); /* 6.0 이후부터 삽입구문. 권장사항. */
mongoose
  .connect(mongodbURL, { useNewUrlParser: true })
  .then((_) => console.log("connection successful"))
  .catch((err) => console.log(err));

const Message = require("./schema.js");

const obj = {};
const obj2 = {};
const obj3 = {};

/* 명령어 저장 */
bot.onText(/^김시민기억해 (.+)/, (msg, mat) => {
  (async () => {
    const element = mat[1].split(" ");
    const key = element[0];
    const val = element[1];
    const _data = {
      명령어: key,
      명령: val,
      id: msg["message_id"],
    };
    const new_message = new Message(_data);
    const t = await new_message.save();
    console.log(t);
    bot.sendMessage(msg.chat.id, "기억했습니다.");
  })();
});
/* 자료 저장 */
// bot.onText(/^김시민저장해 (.+)/, (msg, mat) => {
//   if (msg["message_id"] - 1 == obj2.명령id) {
//     const element = mat[1];
//     obj3.명령어 = element;
//     obj3.명령 = obj2.명령;
//     bot.sendMessage(msg.chat.id, "저장했습니다.");
//   } else {
//     bot.sendMessage(msg.chat.id, "사진을 올리고 다시 시도해주세요.");
//   }
// });

bot.on("message", (msg) => {
  //   if ("photo" in msg) {
  //     obj2.명령id = msg["message_id"];
  //     obj2.명령 = msg["photo"][0]["file_id"];
  //   }
  //   if (obj3.명령어 == msg.text) {
  //     bot.sendPhoto(msg.chat.id, obj3.명령);
  //   }
  (async () => {
    const t = await Message.findOne({
      명령어: { $eq: msg.text },
    }).lean();
    console.log(t);
    bot.sendMessage(msg.chat.id, t.명령);
  })();
});
