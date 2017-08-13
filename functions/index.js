const functions = require('firebase-functions');

const onboard = require('./events/onboard');
const message = require('./events/message');
const welcomeMessage = require('./slash-commands/welcome-message');
const welcomeEmail = require('./slash-commands/welcome-email');

exports.events = functions.https.onRequest((req, res) => {
  if(req.method != "POST") return res.status(403).send('Forbidden');
  console.log(req.get('X-Slack-Retry-Num') == undefined); //logging for Cloud Function
  console.log(req.get('X-Slack-Retry-Num')); //logging for Cloud Function
  switch (req.body.type) {
    case 'url_verification': {
      res.send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      if (req.body.token === functions.config().slack.tokens.verification) {
        if(req.get('X-Slack-Retry-Num') == undefined){
          const event = req.body.event;
          if (event.type === 'team_join' && !event.is_bot) {
            onboard.initialMessage(event.user);
          }
          if (event.type === 'message' && !event.is_bot && event.text.indexOf(functions.config().people.ids.app) !== -1) {
            message.respondTo(event);
          }
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
    case "/stuurwelkomstemail":
      return welcomeEmail.send(event.data.key, original);
      break;
    default:
      break;
  }

});