function getBotKeyFromUserGradeBySpreadSheet(userId) {
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  const memberSheet = sheet.getSheetByName('Members');
  const data = memberSheet.getDataRange().getValues();
    
  const user = data.find(row => row[3] === userId);
  if (!user) {
    return 'botA';
  }

  const userGrade = String(user[1]).trim();
  switch(userGrade) {
    case '1':
      return 'botA';
    case '2':
      return 'botB';
    case '3':
      return 'botC';
    case '4':
      return 'botD';
    default:
      return 'botA';
  }
}

function getBotKeyFromUserGradeByMessage(grade) {
  switch (grade) {
    case '1':
      return 'botA';
    case '2':
      return 'botB';
    case '3':
      return 'botC';
    case '4':
      return 'botD';
    default:
      throw new Error('Invalid grade');
  }
}
