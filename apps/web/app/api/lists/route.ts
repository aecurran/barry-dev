import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { families, lists, listItems } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { isUuid, badRequest, notFound, serverError } from '@/lib/validate';

// GET /api/lists?family_id={uuid}
export async function GET(request: NextRequest) {
  const familyId = request.nextUrl.searchParams.get('family_id');

  if (!isUuid(familyId)) {
    return badRequest('family_id query parameter is required and must be a valid UUID');
  }

  try {
    const result = await db
      .select({
        id: lists.id,
        name: lists.name,
        type: lists.type,
        createdAt: lists.createdAt,
        itemCount: sql<number>`count(${listItems.id})::int`,
      })
      .from(lists)
      .leftJoin(listItems, eq(lists.id, listItems.listId))
      .where(eq(lists.familyId, familyId))
      .groupBy(lists.id)
      .orderBy(lists.createdAt);

    return NextResponse.json({ lists: result });
  } catch (err) {
    return serverError('GET /api/lists', err);
  }
}

// POST /api/lists
export async function POST(request: NextRequest) {
  let body: { family_id?: string; name?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('Request body must be valid JSON');
  }

  const { family_id, name, type } = body;

  if (!isUuid(family_id) || !name) {
    return badRequest('family_id (UUID) and name are required');
  }

  try {
    const [family] = await db
      .select({ id: families.id })
      .from(families)
      .where(eq(families.id, family_id));

    if (!family) {
      return notFound('Family not found');
    }

    const [list] = await db
      .insert(lists)
      .values({
        familyId: family_id,
        name,
        type: type || 'custom',
      })
      .returning();

    return NextResponse.json({ list }, { status: 201 });
  } catch (err) {
    return serverError('POST /api/lists', err);
  }
}
