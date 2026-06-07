import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// PATCH /api/lists/[listId]/items/[itemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string; itemId: string }> },
) {
  const { listId, itemId } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = {};
  if (body.checked !== undefined) updateData.checked = body.checked;
  if (body.text !== undefined) updateData.text = body.text;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'At least one field (checked, text) must be provided' },
      { status: 400 },
    );
  }

  const [item] = await db
    .update(listItems)
    .set(updateData)
    .where(and(eq(listItems.id, itemId), eq(listItems.listId, listId)))
    .returning();

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ item });
}

// DELETE /api/lists/[listId]/items/[itemId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ listId: string; itemId: string }> },
) {
  const { listId, itemId } = await params;

  const [deleted] = await db
    .delete(listItems)
    .where(and(eq(listItems.id, itemId), eq(listItems.listId, listId)))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
