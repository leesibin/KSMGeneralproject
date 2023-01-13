/* 텔레그램봇 호출 */
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });

/* 로또 크롤러 호출 */
const cheerio = require("cheerio");
const axios = require("axios");
const url = "https://dhlottery.co.kr/gameResult.do?method=byWin";

/* 몽고DB 호출/선언 */
const mongoose = require("mongoose");
const USER = process.env.dbid;
const PWD = process.env.dbpw;
const HOST = process.env.dbhost;
const DB = "mdb";
const mongodbURL = `mongodb://${USER}:${PWD}@${HOST}/${DB}`;

/* 몽구스 링크 연결 */
mongoose.set("strictQuery", false);
mongoose
  .connect(mongodbURL, { useNewUrlParser: true })
  .then((_) => console.log("connection successful"))
  .catch((err) => console.log(err));

/* 몽고DB 스키마 클래스 호출 */
const Message = require("./schema.js");

/* 사진 임시 저장용 객체 */
const obj = {};

/* 명령어 저장 */
bot.onText(/^김시민기억해 (.+)/, (msg, mat) => {
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
bot.onText(/^김시민저장해 (.+)/, (msg, mat) => {
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
  /* 사진 임시저장 */
  if ("photo" in msg) {
    obj.명령id = msg["message_id"];
    obj.명령 = msg["photo"][0]["file_id"];
  }
  /* 명령 호출 */
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
  /* 로또 명령 */
  if (msg.text == "로또") {
    const arr = [];
    const ar = [];
    /* 로또 사이트 크롤링 */
    axios.get(url).then((res) => {
      (async () => {
        const $ = cheerio.load(res.data);
        await $(".win_result>h4>strong").each(function () {
          const text = $(this).text();
          let count = "";
          for (let i = 0; i < text.length; i++) {
            if (!isNaN(text[i] * 1)) {
              count += text[i];
            } else {
              count += "회 결과는 다음과 같습니다.";
              break;
            }
          }
          arr.push(count);
        });

        await $(".win>p>span").each(function () {
          ar.push($(this).text());
        });
        arr.push(`당첨번호 : ${ar.join(",")}`);

        await $(".num.bonus>p>span").each(function () {
          ar.length = 0;
          ar.push($(this).text());
        });
        arr.push(`보너스 번호 : ${ar[0]}`);
        // console.log(arr);

        /* 랜덤 로또 생성. */
        let reco1 = "";
        let lot = new Array(6).fill(0);
        for (let i = 0; i < lot.length; i++) {
          const ranNum = Math.floor(Math.random() * 45) + 1;
          if (lot.indexOf(ranNum) == -1) {
            lot[i] = ranNum;
          } else {
            --i;
          }
        }
        lot = lot.sort((a, b) => a - b);
        reco1 += "추천번호1 : " + lot.join(",");
        while (1) {
          const ranNum = Math.floor(Math.random() * 45) + 1;
          if (lot.indexOf(ranNum) == -1) {
            reco1 += " + 보너스번호" + ranNum;
            break;
          }
        }
        arr.push(reco1);

        let reco2 = "";
        let lot2 = new Array(6).fill(0);
        for (let i = 0; i < lot2.length; i++) {
          const ranNum = Math.floor(Math.random() * 45) + 1;
          if (lot2.indexOf(ranNum) == -1) {
            lot2[i] = ranNum;
          } else {
            --i;
          }
        }
        lot2 = lot2.sort((a, b) => a - b);
        reco2 += "추천번호2 : " + lot2.join(",");
        while (1) {
          const ranNum = Math.floor(Math.random() * 45) + 1;
          if (lot2.indexOf(ranNum) == -1) {
            reco2 += " + 보너스번호" + ranNum;
            break;
          }
        }
        arr.push(reco2);
        /* 로또 출력 */
        bot.sendMessage(msg.chat.id, arr.join("\n"));
      })();
    });
  }
});
