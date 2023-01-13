require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });

let obj = {};
let obj2 = {};
bot.onText(/^김시빈저장해 (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "기억합니다 ";
  const chat = match[1].split(" "); //띄우기를 해줘야 구분이 가능
  let key = chat[0];
  let value = chat[1];

  obj.계획대로 = key;
  obj.되고있어 = value;
  bot.sendMessage(chatId, resp);
});
bot.onText(/^김시빈번역해 (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = "번역합니다 ";
  const chat2 = match[1];
  let key = chat2;
  obj2 = key;
  console.log(msg);
  bot.sendMessage(chatId, resp);
});

bot.on("message", (msg) => {
  if (msg.text === obj.계획대로) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, obj.되고있어);
  }
});

bot.on("message", (msg) => {
  if (msg.text === obj2) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "확인");
  }
});
