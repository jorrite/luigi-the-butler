require('dotenv').config();

const qs = require('querystring');
const express = require('express');
const bodyParser = require('body-parser');
const onboard = require('./onboard');
const welcomeMessage = require('./welcomeMessage');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      res.send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
        const event = req.body.event;
        if (event.type === 'team_join' && !event.is_bot) {
          onboard.initialMessage(event.user);
        }
        res.sendStatus(200);
      } else { res.sendStatus(500); }
      break;
    }
    default: { res.sendStatus(500); }
  }
});

app.post('/interactive-messages', (req, res) => {
  const body = JSON.parse(req.body.payload);
  if (body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    // simplest case with only a single button in the application
    // check `callback_id` and `value` if handling multiple buttons
  } else { res.sendStatus(500); }
});

app.post('/welkomstbericht', (req, res) => {
  if (req.body.token === process.env.SLACK_VERIFICATION_TOKEN) {
    res.status(200).send(welcomeMessage.get(req.body.user_id, req.body.text === 'nogeenkeer'));
  } else { res.sendStatus(500); }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}!`);
});
