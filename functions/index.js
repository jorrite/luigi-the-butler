const functions = require('firebase-functions');  
const qs = require('querystring');
const bodyParser = require('body-parser');
const onboard = require('./onboard');
const welcomeMessage = require('./welcome-message');
const app = require('express')();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/events', (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      res.send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      if (req.body.token === functions.config().slack.tokens.verification) {
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

app.post('/welkomstbericht', (req, res) => {
  if (req.body.token === functions.config().slack.tokens.verification) {
    //return initial response as fast as possible.
    res.status(200).send(welcomeMessage.handlingMessage);
    welcomeMessage.get(req.body.user_id, req.body.text === 'nogeenkeer', req.body.response_url);
  } else { res.sendStatus(500); }
});

app.use((req, res) =>{
  res.redirect("/");
});
exports.slack = functions.https.onRequest(app);