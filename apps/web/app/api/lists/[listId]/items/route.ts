import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { lists, listItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { isUuid, badRequest, notFound, serverError } from '@/lib/validate';

// GET /api/lists/[listId]/items
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ listId: string }> },
) {
  const { listId } = await params;

  if (!isUuid(listId)) {
    return badRequest('listId must be a valid UUID');
  }

  try {
    const items = await db
      .select()
      .from(listItems)
      .where(eq(listItems.listId, listId))
      .orderBy(listItems.createdAt);

    return NextResponse.json({ items });
  } catch (err) {
    return serverError('GET /api/lists/[listId]/items', err);
  }
}

// POST /api/lists/[listId]/items
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> },
) {
  const { listId } = await params;

  if (!isUuid(listId)) {
    return badRequest('listId must be a valid UUID');
  }

  let body: { text?: string; added_by?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('Request body must be valid JSON');
  }

  const { text, added_by } = body;

  if (!text) {
    return badRequest('text is required');
  }

  try {
    const [list] = await db.select({ id: lists.id }).from(lists).where(eq(lists.id, listId));

    if (!list) {
      return notFound('List not found');
    }

    const [item] = await db
      .insert(listItems)
      .values({
        listId,
        text,
        addedBy: added_by || null,
      })
      .returning();

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    return serverError('POST /api/lists/[listId]/items', err);
  }
}
