function sendMessage(userId, message, botKey) {
  var url = LINE_API_URLS.messagePush;
  var payload = {
    to: userId,
    messages: [{
      type: 'text',
      text: message
    }]
  };

  var options = {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + LINE_ACCESS_TOKENS[botKey]
    },
    payload: JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
  } catch (error) {
  }
}

function sendQuickReply(replyToken, message, botKey) {
  var url = LINE_API_URLS.messageReply;
  var payload = {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: message
    }]
  };

  var options = {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + LINE_ACCESS_TOKENS[botKey]
    },
    payload: JSON.stringify(payload)
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
  } catch (error) {
    Logger.log('Quick reply error: ' + error);
  }
}
