const FirebaseREST = require('firebase-rest').default;

module.exports = function(context, cb) {
  if(context.data.token === context.secrets.SLACK_VERIFICATION_TOKEN)
  {
    var jsonClient = new FirebaseREST.JSONClient(context.secrets.FB_URL);
    jsonClient.post('/slash-commands', context.data).then(function(resp){
      cb(null, { text: '...'});
    });
  } else{
    cb(null, { "text": "error" });
  }
}