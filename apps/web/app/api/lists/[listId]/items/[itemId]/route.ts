import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { listItems } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { isUuid, badRequest, notFound, serverError } from '@/lib/validate';

// PATCH /api/lists/[listId]/items/[itemId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string; itemId: string }> },
) {
  const { listId, itemId } = await params;

  if (!isUuid(listId) || !isUuid(itemId)) {
    return badRequest('listId and itemId must be valid UUIDs');
  }

  let body: { checked?: boolean; text?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest('Request body must be valid JSON');
  }

  const updateData: Record<string, unknown> = {};
  if (body.checked !== undefined) updateData.checked = body.checked;
  if (body.text !== undefined) updateData.text = body.text;

  if (Object.keys(updateData).length === 0) {
    return badRequest('At least one field (checked, text) must be provided');
  }

  try {
    const [item] = await db
      .update(listItems)
      .set(updateData)
      .where(and(eq(listItems.id, itemId), eq(listItems.listId, listId)))
      .returning();

    if (!item) {
      return notFound('Item not found');
    }

    return NextResponse.json({ item });
  } catch (err) {
    return serverError('PATCH /api/lists/[listId]/items/[itemId]', err);
  }
}

// DELETE /api/lists/[listId]/items/[itemId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ listId: string; itemId: string }> },
) {
  const { listId, itemId } = await params;

  if (!isUuid(listId) || !isUuid(itemId)) {
    return badRequest('listId and itemId must be valid UUIDs');
  }

  try {
    const [deleted] = await db
      .delete(listItems)
      .where(and(eq(listItems.id, itemId), eq(listItems.listId, listId)))
      .returning();

    if (!deleted) {
      return notFound('Item not found');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return serverError('DELETE /api/lists/[listId]/items/[itemId]', err);
  }
}
