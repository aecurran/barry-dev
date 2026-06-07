import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentInstances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/agents?family_id={uuid}
export async function GET(request: NextRequest) {
  const familyId = request.nextUrl.searchParams.get('family_id');

  if (!familyId) {
    return NextResponse.json({ error: 'family_id query parameter is required' }, { status: 400 });
  }

  const [agent] = await db
    .select()
    .from(agentInstances)
    .where(eq(agentInstances.familyId, familyId));

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  return NextResponse.json({ agent });
}

// POST /api/agents — register a new agent instance
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { family_id, container_id, port } = body;

  if (!family_id) {
    return NextResponse.json({ error: 'family_id is required' }, { status: 400 });
  }

  const [agent] = await db
    .insert(agentInstances)
    .values({
      familyId: family_id,
      containerId: container_id || null,
      port: port || null,
      status: container_id ? 'running' : 'pending',
    })
    .returning();

  return NextResponse.json({ agent }, { status: 201 });
}
