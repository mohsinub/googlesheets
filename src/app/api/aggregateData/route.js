// app/api/sheets/route.js

import { google } from "googleapis";
import { NextResponse } from 'next/server';

export async function GET() {
  if (typeof window !== 'undefined') {
    return NextResponse.json({ error: "This API can only be called from the server." }, { status: 400 });
  }

  try {
    const sheets = await authenticateSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "COUNTS!A:B", // Adjust range as needed
    });

    return NextResponse.json(response.data.values);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function authenticateSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Updated scope for read and write access
  });

  return google.sheets({ version: "v4", auth });
}