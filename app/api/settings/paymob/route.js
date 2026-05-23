import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(process.cwd(), '.paymob-config.json');

function readConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch {}
  return {
    mode: 'live',
    live: { apiKey: '', secretKey: '', publicKey: '', hmacSecret: '', integrations: {} },
    test: { apiKey: '', secretKey: '', publicKey: '', hmacSecret: '', integrations: {} },
  };
}

function writeConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

/** Get active config based on current mode */
export function getActivePaymobConfig() {
  const config = readConfig();
  const mode = config.mode || 'live';
  const active = config[mode] || config.live || {};
  return { ...active, mode };
}

/** GET /api/settings/paymob */
export async function GET() {
  const config = readConfig();
  return NextResponse.json({ success: true, config });
}

/** POST /api/settings/paymob */
export async function POST(request) {
  try {
    const body = await request.json();
    writeConfig(body);
    return NextResponse.json({ success: true, message: 'Paymob settings saved!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
