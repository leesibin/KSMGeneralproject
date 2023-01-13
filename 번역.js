require("dotenv").config();
var express = require("express");
var app = express();
var client_id = process.env.id; //네이버 내애플리케이션 아이디,시크릿 작성하기(env)
var client_secret = process.env.secret;
var query = "감사합니다";
app.get("/", function (req, res) {
  var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  var request = require("request");
  var options = {
    url: api_url,
    form: { source: "ko", target: "en", text: query },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let no = JSON.parse(body);
      res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });
      console.log(no);
      res.end(no.message.result.translatedText);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});
app.listen(3000, function () {
  console.log("http://127.0.0.1:3000/translate app listening on port 3000!");
});
