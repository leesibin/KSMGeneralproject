require("dotenv").config();
const Photo = require("./ori.js");
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid; //텔레그램 봇아이디
const bot = new TelegramBot(token, { polling: true });

let ok = {};

bot.onText(/^김시빈저장해 (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "저장합니다 ";
  const chat = match[1].split(" ");
  let key = chat[0];
  let value = chat[1];

  ok.key = key;
  ok.value = value;
  const main = async () => {
    const _data = {
      명령어: ok.key,
      발동: ok.value,
    };
    const new_photo = new Photo(_data);
    const t = await new_photo.save();
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
