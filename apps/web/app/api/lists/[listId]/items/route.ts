import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/lists/[listId]/items
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ listId: string }> },
) {
  const { listId } = await params;

  const items = await db
    .select()
    .from(listItems)
    .where(eq(listItems.listId, listId))
    .orderBy(listItems.createdAt);

  return NextResponse.json({ items });
}

// POST /api/lists/[listId]/items
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> },
) {
  const { listId } = await params;
  const body = await request.json();
  const { text, added_by } = body;

  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
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
}
