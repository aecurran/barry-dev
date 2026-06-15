import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { families, agentInstances } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isUuid, badRequest, notFound, serverError } from '@/lib/validate';

// GET /api/agents?family_id={uuid}
export async function GET(request: NextRequest) {
  const familyId = request.nextUrl.searchParams.get('family_id');

  if (!isUuid(familyId)) {
    return badRequest('family_id query parameter is required and must be a valid UUID');
  }

  try {
    const [agent] = await db
      .select()
      .from(agentInstances)
      .where(eq(agentInstances.familyId, familyId));

    if (!agent) {
      return notFound('Agent not found');
    }

    return NextResponse.json({ agent });
  } catch (err) {
    return serverError('GET /api/agents', err);
  }
}

// POST /api/agents — register a new agent instance
export async function POST(request: NextRequest) {
  let body: { family_id?: string; container_id?: string; port?: number };
  try {
    body = await request.json();
  } catch {
    return badRequest('Request body must be valid JSON');
  }

  const { family_id, container_id, port } = body;

  if (!isUuid(family_id)) {
    return badRequest('family_id is required and must be a valid UUID');
  }

  try {
    const [family] = await db
      .select({ id: families.id })
      .from(families)
      .where(eq(families.id, family_id));

    if (!family) {
      return notFound('Family not found');
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
  } catch (err) {
    // Unique constraint: one agent per family (idempotency guard for provisioning)
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === '23505') {
      return NextResponse.json(
        { error: 'An agent instance already exists for this family' },
        { status: 409 },
      );
    }
    return serverError('POST /api/agents', err);
  }
}
