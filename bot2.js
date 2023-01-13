require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid; //텔레그램 봇아이디
const bot = new TelegramBot(token, { polling: true });

var client_id = process.env.id; //네이버 번역api 봇아이디
var client_secret = process.env.secret; //네이버 번역api 봇아이디

let onoff = false;
bot.on("message", (msg) => {
  if (msg.text === "안녕") {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "확인");
  }
});

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
