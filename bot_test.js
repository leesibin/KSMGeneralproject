require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });

const Message = require("./schema.js");

// bot.on("message", (msg, type) => {
//   //   const chatId = msg.chat.id;
//   //   console.log(msg);
//   //   console.log(type);

//   if (msg.text == /김시빈저장해/) {

//   }

//   bot.sendMessage(chatId, "ㅎㅇ");
// });

// --------------------------------------- 테스트 ------------------------------------
const obj = {};
const obj2 = {};
const obj3 = {};

/* 명령어 저장 */
bot.onText(/^김시민기억해 (.+)/, (msg, mat) => {
  //   console.log(msg);
  //   console.log(mat);

  //   console.log(mat[1]);
  //   console.log(mat[1].split(" "));
  const element = mat[1].split(" ");
  const key = element[0];
  const val = element[1];
  //   console.log(key);
  //   console.log(val);
  obj.명령어 = key;
  obj.명령 = val;

  bot.sendMessage(msg.chat.id, "기억했습니다.");
});
/* 자료 저장 */
bot.onText(/^김시민저장해 (.+)/, (msg, mat) => {
  if (msg["message_id"] - 1 == obj2.명령id) {
    const element = mat[1];
    obj3.명령어 = element;
    obj3.명령 = obj2.명령;
    bot.sendMessage(msg.chat.id, "저장했습니다.");
  } else {
    bot.sendMessage(msg.chat.id, "사진을 올리고 다시 시도해주세요.");
  }
});

bot.on("message", (msg) => {
  if ("photo" in msg) {
    obj2.명령id = msg["message_id"];
    obj2.명령 = msg["photo"][0]["file_id"];
  }
  if (obj3.명령어 == msg.text) {
    bot.sendPhoto(msg.chat.id, obj3.명령);
  }
  if (obj.명령어 == msg.text) {
    bot.sendMessage(msg.chat.id, obj.명령);
  }
  console.log(obj);
  console.log(obj2);
  console.log(obj3);
  console.log(msg);
});
// bot.sendPhoto(-679408568, "AQADI7IxG0Ew-FVy");
