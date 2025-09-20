export async function post({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const course = formData.get("course");

  // --- Варіант 1: Надсилання на пошту через nodemailer ---
  /*
  import nodemailer from "nodemailer";
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com",
    port: 587,
    auth: { user: "user@example.com", pass: "password" },
  });
  await transporter.sendMail({
    from: '"Site" <site@example.com>',
    to: "youremail@example.com",
    subject: `Нова реєстрація: ${course}`,
    text: `Ім'я: ${name}\nEmail: ${email}\nКурс: ${course}`,
  });
  */

  // --- Варіант 2: Запис у Google Sheets ---
  /*
  import { google } from "googleapis";
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A:C",
    valueInputOption: "RAW",
    requestBody: { values: [[name, email, course, new Date().toISOString()]] },
  });
  */

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
