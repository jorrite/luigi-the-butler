const functions = require('firebase-functions');

const onboard = require('./onboard');
const welcomeMessage = require('./welcome-message');

exports.events = functions.https.onRequest((req, res) => {
  if(req.method != "POST") res.status(403).send('Forbidden');
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

exports.slashCommands = functions.database.ref('/slash-commands/{pushId}/').onCreate(event => {
  const original = event.data.val();

  switch(original.command){
    case "/welkomstbericht":
      return welcomeMessage.get(event.data.key, original);
      break;
    default:
      break;
  }

});