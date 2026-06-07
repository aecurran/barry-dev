import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lists, listItems } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET /api/lists?family_id={uuid}
export async function GET(request: NextRequest) {
  const familyId = request.nextUrl.searchParams.get('family_id');

  if (!familyId) {
    return NextResponse.json({ error: 'family_id query parameter is required' }, { status: 400 });
  }

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
}

// POST /api/lists
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { family_id, name, type } = body;

  if (!family_id || !name) {
    return NextResponse.json(
      { error: 'family_id and name are required' },
      { status: 400 },
    );
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
}
