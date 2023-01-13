require("dotenv").config();
const Photo = require("./ori.js");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid; //텔레그램 봇아이디
const bot = new TelegramBot(token, { polling: true });

let ok = {};
//명령어 + 명령어내용
bot.onText(/^김시빈저장해 (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "저장합니다 ";
  const chat = match[1].split(" ");
  let key = chat[0];
  let value = chat[1];

  ok.key = key;
  ok.value = value;
  //몽고db데이터값저장
  // const main = async () => {
  //   const _data = {
  //     명령어: ok.key,
  //     발동: ok.value,
  //   };
  //   const new_photo = new Photo(_data);
  //   const t = await new_photo.save();
  //   console.log(t);
  // };
  // main();
  //몽고db데이터 저장2
  const main = async () => {
    const t = await Photo.updateMany(
      {
        명령어: {
          $eq: ok.key,
        },
      },
      {
        $set: {
          발동: ok.value,
          명령어: ok.key,
        },
      },
      {
        upsert: true,
      }
    ).lean(); //속도 4배정도 빠르다.

    console.log(t);
  };
  main();
  bot.sendMessage(chatId, resp);
});
bot.on("message", (msg) => {
  if (msg.text === ok.key) {
    console.log(msg);
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, ok.value);
  }
});
//텔레그램 채팅 번역
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
