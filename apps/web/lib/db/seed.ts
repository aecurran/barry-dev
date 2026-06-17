import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

async function seed() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('Seeding central platform database...');

  // Create test family account
  const [family] = await db
    .insert(schema.families)
    .values({
      name: 'Test Family',
      status: 'active',
    })
    .returning();

  console.log(`  Created family: ${family.name} (${family.id})`);

  // Create a pending agent instance for the test family
  const [agent] = await db
    .insert(schema.agentInstances)
    .values({
      familyId: family.id,
      status: 'pending',
    })
    .returning();

  console.log(`  Created agent instance: ${agent.id} (status: ${agent.status})`);

  console.log('\nSeed complete!');
  console.log(`\nTest family ID: ${family.id}`);
  console.log('Use this ID for API testing and agent provisioning.');
  console.log('Family-specific data (members, lists, emails) is seeded');
  console.log('into the container SQLite by the provisioning script.\n');

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
