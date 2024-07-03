function updateDashboard() {
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  const memberSheet = sheet.getSheetByName('Members');
  const formsSheet = sheet.getSheetByName('Forms');
  const dashboardSheet = sheet.getSheetByName('Dashboard');

  const memberData = memberSheet.getDataRange().getValues();
  const formsData = formsSheet.getDataRange().getValues();
  const dashboardData = dashboardSheet.getDataRange().getValues();

  const dashboardTasks = dashboardData.slice(1).filter(row => row[0].trim() !== '').map((row, index) => ({
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
    rowIndex: index + 2 // スプレッドシートの行インデックス（ヘッダー行を除く）
  }));

  dashboardTasks.forEach(task => {
    let targetCount = 0;
    let completedCount = 0;
    let completedCountExcludingNotImplemented = 0;

    for (let i = 1; i < memberData.length; i++) {
      const userName = memberData[i][0].trim();
      const userGrade = memberData[i][1];
      const userField = memberData[i][2];
      const userId = memberData[i][3].trim();

      if (userName && userId) {
        const isTarget = task.targetGrades[userGrade] && task.targetFields[userField];
        if (isTarget) {
          targetCount++;
          const hasCompleted = formsData.some(row => row[0].trim() === userName && row[1].trim() === task.taskName);
          const hasCompletedExcludingNotImplemented = formsData.some(row => row[0].trim() === userName && row[1].trim() === task.taskName && row[2].trim().toLowerCase() !== '実施不可');
          if (hasCompleted) {
            completedCount++;
          }
          if (hasCompletedExcludingNotImplemented) {
            completedCountExcludingNotImplemented++;
          }
        }
      }
    }

    dashboardSheet.getRange(`K${task.rowIndex}`).setValue(targetCount);
    dashboardSheet.getRange(`L${task.rowIndex}`).setValue(completedCount);
    dashboardSheet.getRange(`M${task.rowIndex}`).setValue(completedCountExcludingNotImplemented);
  });
}
