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
      range: "Real Data!A:G", // Adjust range as needed
    });

    return NextResponse.json(response.data.values);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (typeof window !== 'undefined') {
    return NextResponse.json({ error: "This API can only be called from the server." }, { status: 400 });
  }

  try {
    const { rowIndex } = await req.json(); // Parse the request body
    if (rowIndex === undefined || rowIndex < 0) {
      return NextResponse.json({ error: "Invalid rowIndex provided" }, { status: 400 });
    }

    const sheets = await authenticateSheets();

    const range = `Real Data!A${rowIndex + 1}:G${rowIndex + 1}`; // Adjust range as needed
    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range,
    });

    return NextResponse.json({ message: "Row deleted successfully" });
  } catch (error) {
    console.error('API Error:', error.message);
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