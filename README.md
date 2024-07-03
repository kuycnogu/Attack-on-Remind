# Attack-on-Remind
# LINE Bot Reminder System

**Note: This README was generated using ChatGPT.**

This project is a Google Apps Script (GAS) based system that integrates with the LINE Messaging API to remind users to complete specific tasks through a LINE Bot. The system utilizes Google Sheets for data management, where members' information and task details are stored.

## Features
- Register user information via LINE Bot messages.
- Send reminder messages to users who haven't completed tasks.
- Update task status in Google Sheets.
- Handle multiple bots for different user groups (e.g., different school grades).

## Prerequisites
- Google Account with access to Google Sheets and Google Apps Script.
- LINE Developer account to create and manage LINE Bots.
- Basic knowledge of JavaScript and Google Apps Script.

## Project Structure
.
├── .gitignore
├── .env (not included in the repository for security reasons)
├── env.gs
├── line-callback.gs
├── send-reminder.gs
├── get-bot-key.gs
└── README.md

## Setup

### 1. Create Google Sheets
1. Create a new Google Sheet.
2. Name the sheets as follows: `Members`, `Forms`, `Dashboard`.

#### Members Sheet Structure
| 名前      | 学年 | 文理 | UserID   |
|-----------|------|------|----------|
| 山田太郎 | 1    | 文系 | U123456  |
| 佐藤花子 | 2    | 理系 | U789012  |
| 鈴木一郎 | 3    | 文系 | U345678  |
| 野口陽矢 | 4    | 理系 | U901234  |

#### Forms Sheet Structure
| 名前      | 案件名 | 実施or実施不可 |
|-----------|--------|----------------|
| 山田太郎 | 案件A  | 実施          |
| 佐藤花子 | 案件B  | 実施不可      |
| 鈴木一郎 | 案件C  | 実施          |
| 野口陽矢 | 案件D  | 実施不可      |

#### Dashboard Sheet Structure
| 案件名 | 追加日時  | 1回生は対象か | 2回生は対象か | 3回生は対象か | 4回生は対象か | 文系は対象か | 理系は対象か | リマインド | 案件URL                | 対象人数 | フォーム回答者数 | 真の実施人数 |
|--------|------------|----------------|----------------|----------------|----------------|--------------|--------------|------------|------------------------|------------|-------------------|--------------|
| 案件A  | 2024/06/01 | TRUE           | TRUE           | TRUE           | TRUE           | TRUE         | TRUE         | TRUE       | https://example.com/a  |            |                   |              |
| 案件B  | 2024/06/02 | TRUE           | TRUE           | TRUE           | TRUE           | TRUE         | TRUE         | TRUE       | https://example.com/b  |            |                   |              |
| 案件C  | 2024/06/03 | TRUE           | TRUE           | TRUE           | TRUE           | TRUE         | TRUE         | TRUE       | https://example.com/c  |            |                   |              |
| 案件D  | 2024/06/04 | TRUE           | TRUE           | TRUE           | TRUE           | TRUE         | TRUE         | TRUE       | https://example.com/d  |            |                   |              |

### 2. Set Up Google Apps Script
1. Open the Google Sheets, go to `Extensions` > `Apps Script`.
2. Create the following files and paste the respective code from this repository:
    - `env.gs`
    - `line-callback.gs`
    - `send-reminder.gs`
    - `get-bot-key.gs`

### 3. Add Script Properties
1. Go to `File` > `Project Properties` > `Script Properties`.
2. Add the properties listed in the `.env` file manually.

### 4. Configure LINE Messaging API
1. Create LINE bots in the LINE Developer Console.
2. Obtain the Channel Access Token and Channel Secret for each bot.
3. Set the Webhook URL to the URL of your Google Apps Script Web App.

### 5. Deploy Google Apps Script
1. In the Apps Script editor, click on `Deploy` > `New deployment`.
2. Select `Web App`, configure access settings, and deploy.
3. Copy the deployment URL and set it as the Webhook URL in the LINE Developer Console.

### 6. Add .gitignore
Create a `.gitignore` file and add the following line to exclude the `.env` file from being uploaded to GitHub:


## System Overview
This system connects users, LINE bots, Google Sheets, and Google Forms in the following manner:
- **Users** interact with the LINE bots to register their information and receive reminders.
- **LINE Bots** are created for different user groups (e.g., botA for 1st grade, botB for 2nd grade, etc.) and send/receive messages to/from users.
- **Google Sheets** store the members' information (`Members` sheet), task details (`Dashboard` sheet), and responses from Google Forms (`Forms` sheet).
- **Google Forms** responses are automatically populated into the `Forms` sheet of the Google Sheets.

## Code Explanation

### env.gs
Defines environment variables, including Google Sheets ID and LINE API credentials.

### line-callback.gs
Handles incoming messages from LINE users, registers users, and sends confirmation messages.

### send-reminder.gs
Checks task completion status and sends reminder messages to users who haven't completed tasks.

### get-bot-key.gs
Determines the bot key based on user grade, either from a message or Google Sheets data.

## Usage

### Registering Users
Users can register their information by sending a message in the format:
登録 名前 学年 文系/理系
Example:
登録 山田太郎 2 文系


### Sending Reminders
1. The `sendReminders` function checks the `Dashboard` and `Forms` sheets to identify users who haven't completed tasks.
2. Reminders are sent via the respective LINE Bots with the following format:
{ユーザー名}さん、以下の案件が未提出です:
案件A（https://example.com/a）
案件B（https://example.com/b）
提出をお願いします。

Googleフォームのリンクはこちらです: https://forms.gle/A5DiWiDBZfR9aXH5A


## Troubleshooting
- Ensure all environment variables are correctly set in Script Properties.
- Verify that the Webhook URL is correctly set in the LINE Developer Console.
- Check the execution logs in Google Apps Script for any errors.

## Contributing
Please fork this repository and submit pull requests for any enhancements or bug fixes.

## License
This project is free to use.

---

For detailed information on how to use the LINE Messaging API, please refer to the [official documentation](https://developers.line.biz/en/docs/messaging-api/overview/).
