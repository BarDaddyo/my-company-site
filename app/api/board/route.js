import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const KEY = 'myboard_v1';

export async function GET() {
  try {
    const data = await redis.get(KEY);
    return Response.json(data || { roles: [], tasks: [] });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await redis.set(KEY, body);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
