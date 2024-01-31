const express = require("express");
const middleware = require("@line/bot-sdk").middleware;
const JSONParseError = require("@line/bot-sdk").JSONParseError;
const SignatureValidationFailed =
  require("@line/bot-sdk").SignatureValidationFailed;

const app = express();

const config = {
  channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
  channelSecret: "YOUR_CHANNEL_SECRET",
};

const client = new line.Client(lineConfig);
app.use(middleware(config));

app.post("/webhook", (req, res) => {
  const event = req.body.events[0];

  switch (event.type) {
    case "join":
    case "follow":
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "Hello, Wellcome you!",
      });
    case "message":
      switch (event.message.type) {
        case "text":
          switch (event.message.text) {
            case "hello":
              return client.replyMessage(event.replyToken, {
                type: "text",
                text: "Can we help you?",
              });
            case "I want book ticket":
              return client.replyMessage(event.replyToken, {
                type: "text",
                text: "Where do you want to book tickets?",
              });
          }
      }
  }
});

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
});

app.listen(3000);
