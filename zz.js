const obj = {
  message_id: 899,
  from: {
    id: 5344355361,
    is_bot: false,
    first_name: "수환",
    last_name: "김",
    language_code: "ko",
  },
  chat: {
    id: 5344355361,
    first_name: "수환",
    last_name: "김",
    type: "private",
  },
  date: 1673507177,
  photo: [
    {
      file_id:
        "AgACAgUAAxkBAAIDg2O_sWkjmRwbPN7V7bxGLhTyfZGLAAIjsjEbQTD4VZDGPJ700ZrpAQADAgADcwADLQQ",
      file_unique_id: "AQADI7IxG0Ew-FV4",
      file_size: 1811,
      width: 90,
      height: 90,
    },
    {
      file_id:
        "AgACAgUAAxkBAAIDg2O_sWkjmRwbPN7V7bxGLhTyfZGLAAIjsjEbQTD4VZDGPJ700ZrpAQADAgADbQADLQQ",
      file_unique_id: "AQADI7IxG0Ew-FVy",
      file_size: 24226,
      width: 320,
      height: 320,
    },
    {
      file_id:
        "AgACAgUAAxkBAAIDg2O_sWkjmRwbPN7V7bxGLhTyfZGLAAIjsjEbQTD4VZDGPJ700ZrpAQADAgADeAADLQQ",
      file_unique_id: "AQADI7IxG0Ew-FV9",
      file_size: 48769,
      width: 500,
      height: 500,
    },
  ],
};
console.log(obj.photo[0]["file_id"]);
