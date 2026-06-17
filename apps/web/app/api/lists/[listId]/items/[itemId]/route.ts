import { NextResponse } from 'next/server';

// List item management has moved to per-container SQLite databases.
// In Phase 1, this route will proxy requests to the appropriate
// family's agent container. For Phase 0, list items are managed
// directly by the agent via its local SQLite database.

export async function PATCH() {
  return NextResponse.json(
    { message: 'List item management is handled by each family\'s agent container. This endpoint will proxy to containers in Phase 1.' },
    { status: 410 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'List item management is handled by each family\'s agent container. This endpoint will proxy to containers in Phase 1.' },
    { status: 410 }
  );
}
