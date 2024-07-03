function sendReminders() {
  updateDashboard();  // ダッシュボードを更新
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  const memberSheet = sheet.getSheetByName('Members');
  const formsSheet = sheet.getSheetByName('Forms');
  const dashboardSheet = sheet.getSheetByName('Dashboard');

  const memberData = memberSheet.getDataRange().getValues();
  const formsData = formsSheet.getDataRange().getValues();
  const dashboardData = dashboardSheet.getDataRange().getValues();

  const dashboardTasks = dashboardData.slice(1).filter(row => row[0].trim() !== '').map(row => ({
    taskName: row[0].trim(),
    targetGrades: {
      '1': row[2],
      '2': row[3],
      '3': row[4],
      '4': row[5]
    },
    targetFields: {
      '文系': row[6],
      '理系': row[7]
    },
    remind: row[8],  // リマインドチェックボックス
    taskURL: row[9], // 案件URL
  }));

  memberData.slice(1).forEach(member => {
    const userId = member[3].trim();
    const userName = member[0].trim();
    const userGrade = String(member[1]).trim();
    const userField = member[2].trim();

    const userTasks = formsData.filter(row => row[0].trim() === userName).map(row => row[1].trim());
    const missingTasks = dashboardTasks.filter(task =>
      task.remind &&  // リマインドがチェックされているか
      !userTasks.includes(task.taskName) &&
      task.targetGrades[userGrade] &&
      task.targetFields[userField]
    ).map(task => ({
      name: task.taskName,
      url: task.taskURL
    }));

    if (missingTasks.length > 0) {
      const messageTasks = missingTasks.map(task => `${task.name}（${task.url}）`).join('\n');
      const message = `${userName}さん、以下の案件が未提出です:\n${messageTasks}\n提出をお願いします。\n\nGoogleフォームのリンクはこちらです: https://forms.gle/A5DiWiDBZfR9aXH5A`;
      const botKey = getBotKeyFromUserGradeBySpreadSheet(userId);
      sendMessage(userId, message, botKey);
    }
  });
}
