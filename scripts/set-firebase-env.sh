#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FBCMD=firebase
if [ -f $DIR/../.env ]; then
    source $DIR/../.env
else
  FBCMD="firebase --token $FIREBASE_TOKEN"
fi

eval $FBCMD functions:config:set slack.tokens.app="$SLACK_TOKEN"  \
  slack.tokens.verification="$SLACK_VERIFICATION_TOKEN"  \
  mailgun.config.api_key="$MG_API_KEY"  \
  mailgun.config.domain="$MG_DOMAIN"  \
  mailgun.config.email_from="$MG_EMAIL_FROM"  \
  mailgun.config.name_from="$MG_NAME_FROM"  \
  people.names.bride="$BRIDE"  \
  people.names.groom="$GROOM"  \
  people.names.ceremony_master_1="$MASTERS_OF_CEREMONY_1"  \
  people.names.ceremony_master_2="$MASTERS_OF_CEREMONY_2"  \
  people.ids.admin_1="$ADMIN_1_ID"  \
  people.ids.app="$APP_ID"  \
  channels.ids.general="$GENERAL_CHANNEL_ID"   \
  channels.ids.tickets="$TICKETS_CHANNEL_ID"  \
  channels.ids.accomodation="$ACCOMODATION_CHANNEL_ID"  \
  channels.ids.sicily="$SICILY_CHANNEL_ID"  \
  channels.ids.getting_ready="$GETTING_READY_CHANNEL_ID"  \
  channels.ids.masters_of_cermony="$MASTERS_OF_CEREMONY_CHANNEL_ID"  \
  tags.instagram="$INSTAGRAM_TAG" \
  links.men_dresscode="$DRESSCODE_MEN_LINK" \
  links.women_dresscode="$DRESSCODE_WOMEN_LINK" \
  links.program="$PROGRAM_LINK" --non-interactive

eval $FBCMD database:set /_secrets/slack_verification_token -d '\"$SLACK_VERIFICATION_TOKEN\"' -y
