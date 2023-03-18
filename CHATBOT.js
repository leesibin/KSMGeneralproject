require("dotenv").config();
//telegram
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });
//Papago
const client_id = process.env.papagoid; //네이버 번역api 봇아이디
const client_secret = process.env.papagosecret; //네이버 번역api 봇아이디
//DB
const mongoose = require("mongoose");
const USER = process.env.dbid;
const PWD = process.env.dbpw;
const HOST = process.env.dbhost;
const DB = "admin";
const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}/${DB}`;

// mongoose.set('useFindAndModify', false)/* 6.0 이후부터는 자동관리. 필요없다. */
mongoose.set("strictQuery", false); /* 6.0 이후부터 삽입구문. 권장사항. */
mongoose
  .connect(mongodbURL, { useNewUrlParser: true })
  .then((_) => console.log("connection successful"))
  .catch((err) => console.log(err));

const Message = require("./Schema.js");

const obj = {};
const obj2 = {};

/* 명령어 저장 */
bot.onText(/^봇기억해 (.+)/, (msg, mat) => {
  (async () => {
    const element = mat[1].split(" ");
    const key = element[0];
    const val = element[1];
    await Message.updateMany(
      {
        명령어: { $eq: key },
      },
      {
        $set: {
          명령어: key,
          명령: val,
          id: msg["message_id"],
        },
      },
      { upsert: true }
    );
    bot.sendMessage(msg.chat.id, "기억했습니다.");
  })();
});
/* 자료 저장 */
bot.onText(/^봇저장해 (.+)/, (msg, mat) => {
  if (msg["message_id"] - 1 == obj.명령id) {
    const element = mat[1];
    (async () => {
      await Message.updateMany(
        {
          명령어: { $eq: element },
        },
        {
          $set: {
            명령어: element,
            명령: obj.명령,
            id: msg["message_id"],
          },
        },
        { upsert: true }
      );
    })();
    bot.sendMessage(msg.chat.id, "저장했습니다.");
  } else {
    bot.sendMessage(msg.chat.id, "사진을 올리고 다시 시도해주세요.");
  }
});

bot.on("message", (msg) => {
  if ("photo" in msg) {
    obj.명령id = msg["message_id"];
    obj.명령 = msg["photo"][0]["file_id"];
  }
  (async function () {
    const r = await Message.findOne(
      {
        명령어: { $eq: msg.text },
      },
      { _id: 0, __v: 0 }
    ).lean();
    if (r !== null) {
      if (r.명령.length >= 30) {
        bot.sendPhoto(msg.chat.id, r.명령);
      } else {
        bot.sendMessage(msg.chat.id, r.명령);
      }
    }
  })();
});
let onoff = false;
bot.on("message", (msg) => {
    if (msg.text === "번역해") {
      onoff = true;
      console.log(onoff);
      bot.sendMessage(msg.chat.id, "번역시작");
    } else if (msg.text === "번역그만") {
      onoff = false;
      console.log(onoff);
      bot.sendMessage(msg.chat.id, "번역종료");
    }
  
    if (onoff) {
      const chatId = msg.chat.id;
  
      var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  
      var options = {
        url: api_url,
        form: { source: "ko", target: "en", text: msg.text },
        headers: {
          "X-Naver-Client-Id": client_id,
          "X-Naver-Client-Secret": client_secret,
        },
      };
      var request = require("request");
      request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let no = JSON.parse(body);
          let en0 = no.message.result.translatedText;
          bot.sendMessage(chatId, en0);
          console.log(no.message.result.translatedText);
        }
      });
    }
  });