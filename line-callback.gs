function doPost(e) {
  const startTime = Date.now();
  try {
    var json = JSON.parse(e.postData.contents);
    var userId = json.events[0].source.userId;
    var replyToken = json.events[0].replyToken;
    var userMessage = json.events[0].message.text;
    
    if (json.events[0].type === 'message' && userMessage.startsWith('登録 ')) {
      handleUserRegistration(userId, userMessage, replyToken);
    } else {
      sendQuickReply(replyToken, `「登録 名前 学年 文系/理系」の形式でメッセージを送信してください。`);
    }
  } catch (error) {
    Logger.log('Error: ' + error);
    sendQuickReply(replyToken, 'エラーが発生しました。');
  }

  const endTime = Date.now();
  Logger.log('Execution time: ' + (endTime - startTime) + 'ms');
  return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON).setStatus(200);
}

function handleUserRegistration(userId, userMessage, replyToken) {
  var parts = userMessage.replace('登録 ', '').trim().split(' ');
  if (parts.length === 3) {
    var userName = parts[0];
    var userGrade = parts[1];
    var userField = parts[2];
    
    var botKey;
    try {
      botKey = getBotKeyFromUserGradeByMessage(userGrade);
    } catch (error) {
      sendQuickReply(replyToken, `「学年」は1から4の間で入力してください。`);
      return;
    }

    if (isValidGrade(userGrade) && isValidField(userField)) {
      var result = registerUser(userId, userName, userGrade, userField, botKey);
      sendMessage(userId, result.message, botKey);
    } else {
      sendQuickReply(replyToken, `「学年」は1から4、「文系/理系」は文系または理系で入力してください。`, botKey);
    }
  } else {
    sendQuickReply(replyToken, `「登録 名前 学年 文系/理系」の形式でメッセージを送信してください。`, botKey);
  }
}

function isValidGrade(grade) {
  return ['1', '2', '3', '4'].includes(grade);
}

function isValidField(field) {
  return ['文系', '理系'].includes(field);
}

function registerUser(userId, userName, userGrade, userField, botKey) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    const memberSheet = sheet.getSheetByName('Members');
    const data = memberSheet.getDataRange().getValues();

    userName = userName.trim();
    userGrade = userGrade.trim();
    userField = userField.trim();
    userId = userId.trim();

    for (let i = 1; i < data.length; i++) {
      if (data[i][3] === userId) {
        return { success: false, message: `${data[i][0]}さんは既に登録されています。` };
      }
    }

    for (let i = 1; i < data.length; i++) {
      if (data[i][0].trim() === userName) {
        memberSheet.getRange(i + 1, 2).setValue(userGrade);
        memberSheet.getRange(i + 1, 3).setValue(userField);
        memberSheet.getRange(i + 1, 4).setValue(userId);
        return { success: true, message: `${userName}さんの登録が完了しました。` };
      }
    }

    memberSheet.appendRow([userName, userGrade, userField, userId]);
    return { success: true, message: `${userName}さんの登録が完了しました。` };
  } catch (error) {
    return { success: false, message: '登録に失敗しました。エラーが発生しました。' };
  }
}
