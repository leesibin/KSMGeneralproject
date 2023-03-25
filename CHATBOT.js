require("dotenv").config();
//telegram
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.botid;
const bot = new TelegramBot(token, { polling: true });
//크롤링 및 API
const axios = require('axios')
const cheerio = require('cheerio')
const request = require("request");
const key = process.env.key
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

  //API 활용

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id
  const resp = match[1]
  bot.sendMessage(chatId, resp)
})

bot.on('message', (msg) => {
  const text = msg.text
  const chatId = msg.chat.id

  // 환율 시작
  const money =
    'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD'
  fetch(money)
    .then((response) => response.json())
    .then((data) => {
      if (text == '환율') {
        bot.sendMessage(
          chatId,
          '환율정보 ' +
            '\n' +
            data[0].currencyCode +
            '\n' +
            data[0].name +
            '\n' +
            '날짜 : ' +
            data[0].date +
            '\n' +
            '현재시간 : ' +
            data[0].time +
            '\n' +
            '현재환율 : 1달러 = ' +
            data[0].basePrice +
            '원 \n' +
            '고가 : ' +
            data[0].highPrice +
            '원\n' +
            '저가 : ' +
            data[0].lowPrice +
            '원'
        )
      }
    }) // 환율 끝

  //   미세먼지 시작
  let aa = new Date()
      let year = aa.getFullYear()
      let month = aa.getMonth() + 1
      let date3 = aa.getDate() -2
      let day = year + '-0' + month + '-' + date3
      console.log(day)
      const key2 = process.env.keycorona
      const surl = 'https://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api?serviceKey='+key+'&pageNo=1&numOfRows=500&std_day=2023-03-22&gubun=%EC%84%9C%EC%9A%B8&apiType=JSON'
        console.log(surl)
      fetch(surl)
        .then((res) => res.json())
        .then((body) => {
          const _ = body
          const op2 = _.items[0].stdDay
          const op = _.items[0].localOccCnt
          const op1 = _.items[0].gubun
          console.log(_)
          console.log(op)
          if (text == '코로나') {
            bot.sendMessage(chatId, `날짜 : ${op2}  지역 : ${op1}  코로나 확진자: ${op}`)
          }
        })

  //   영화순위 시작
  const movie = 'https://movie.daum.net/ranking/reservation'
  axios.get(movie).then((res) => {
    let $ = cheerio.load(res.data)
    let lank = []

    $('.link_txt').each(function () {
      lank.push($(this).text().trim())
    })

    const movie = []
    lank.forEach(function (v, i) {
      if (i < 10) movie.push(`${i + 1}위 :${v.trim()}`)
    })

    if (text == '영화순위') {
      bot.sendMessage(chatId, '영화순위 \n\n' + movie.join('\n'))
      console.log(movie)
    }
    // if (text == '영화순위') {
    //   bot.sendMessage(-1001686288502, movie.join('\n'))
    //   console.log(lank)
    // }
  })
  // 식단
  const rise =
    'https://www.pusan.ac.kr/kor/CMS/MenuMgr/menuListOnBuilding.do?mCode=MN202'

  axios.get(rise).then((res) => {
    let $ = cheerio.load(res.data)
    let menu = [],
      day = [],
    date2 = []

    // const date = new Date()
    // const Tomonth = date.getMonth() + 1
    // const Today = date.getDate()
    // const date = new Date()
    // console.log(date.getDay())

    $('div.date').each(function () {
      date2.push($(this).text())
    })
    $('div.day').each(function () {
      day.push($(this).text())
    })
    $('.menu-tit01~p').each(function () {
      menu.push($(this).text())
    })
    for (i in menu) {
      // console.log(`${date2[i]}(${day[i]})\n${menu[i]}`);
      if (text == '식단') {
        bot.sendMessage(chatId, `${date2[i]}(${day[i]})\n${menu[i]}`)
      }
    }
  }) // 식단 끝

  // 버스 도착알림 시작
  const bus =
    'https://apis.data.go.kr/6260000/BusanBIMS/stopArrByBstopid?serviceKey=' +
    key +
    '&bstopid=505870000'
  // const a = async () =>
  request(bus, (e, res, body) => {
    // const rr = parser.parse(body);
    const rs = body
    // console.log(e)
    return rs
  })
  // console.log(msg)
  // console.log(bus)
  const date = new Date()
  if (text == '현재시간') {
    bot.sendMessage(chatId, date.toLocaleString())
  }
})

// 아침수업
setInterval(() => {
  const date = new Date()
  const curTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  //   console.log(date);
  if (curTime == '9:30:0') {
    const money =
      'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD'
    fetch(money)
      .then((response) => response.json())
      .then((data) => {
        bot.sendMessage(
          -679408568,
          '환율정보 ' +
            '\n' +
            data[0].currencyCode +
            '\n' +
            data[0].name +
            '\n' +
            '날짜 : ' +
            data[0].date +
            '\n' +
            '현재시간 : ' +
            data[0].time +
            '\n' +
            '현재환율 : 1달러 = ' +
            data[0].basePrice +
            '원 \n' +
            '고가 : ' +
            data[0].highPrice +
            '원\n' +
            '저가 : ' +
            data[0].lowPrice +
            '원'
        )
      })
  }
}, 1000)

// 점심시간
setInterval(() => {
  const date = new Date()
  const curTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  if (curTime == '13:0:0') {
    const url =
      'https://apis.data.go.kr/6260000/AirQualityInfoService/getAirQualityInfoClassifiedByStation?serviceKey=' +
      key +
      '&pageNo=1&numOfRows=10&resultType=json'
    request(url, (e, res, body) => {
      const rst = JSON.parse(body)
      const _ = rst.getAirQualityInfoClassifiedByStation.body.items.item[3]
      bot.sendMessage(
        -679408568,
        `점 심 시 간 @@ \n\n현재 미세먼지 \n초미세먼지 : ${_.pm25} \n미세먼지 : ${_.pm10}`
      )
    })
  }
}, 1000)

// 집가기전
setInterval(() => {
  const date = new Date()
  const curTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  if (curTime == '17:45:0') {
    const movie = 'https://movie.daum.net/ranking/reservation'
    axios.get(movie).then((res) => {
      let $ = cheerio.load(res.data)
      let lank = []

      $('.link_txt ').each(function () {
        lank.push($(this).text().trim())
      })

      const movie = []
      lank.forEach(function (v, i) {
        if (i < 10) movie.push(`${i + 1}위 :${v.trim()}`)
      })
      bot.sendMessage(
        -679408568,
        '\n\n' + '영화순위 @\n' + movie.join('\n')
      )
    })
  }
}, 1000)