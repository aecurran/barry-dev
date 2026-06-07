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

  console.log('Seeding database...');

  // Create test family
  const [family] = await db
    .insert(schema.families)
    .values({
      name: 'Test Family',
      agentName: 'Barry',
      timezone: 'Australia/Melbourne',
      status: 'active',
    })
    .returning();

  console.log(`  Created family: ${family.name} (${family.id})`);

  // Create family members
  const members = await db
    .insert(schema.familyMembers)
    .values([
      {
        familyId: family.id,
        name: 'Amy',
        role: 'parent',
        telegramId: process.env.TELEGRAM_USER_ID || null,
        email: 'amy@zamapps.com',
      },
      {
        familyId: family.id,
        name: 'Test Child',
        role: 'child',
        age: 10,
      },
    ])
    .returning();

  console.log(`  Created ${members.length} family members`);

  // Create lists
  const [groceries] = await db
    .insert(schema.lists)
    .values({
      familyId: family.id,
      name: 'Groceries',
      type: 'groceries',
    })
    .returning();

  const [houseItems] = await db
    .insert(schema.lists)
    .values({
      familyId: family.id,
      name: 'House Items',
      type: 'house',
    })
    .returning();

  const [kidsWants] = await db
    .insert(schema.lists)
    .values({
      familyId: family.id,
      name: 'Things Kids Want',
      type: 'kids_wants',
    })
    .returning();

  console.log('  Created 3 lists');

  // Add sample items
  await db.insert(schema.listItems).values([
    { listId: groceries.id, text: 'Milk', addedBy: 'Amy' },
    { listId: groceries.id, text: 'Bread', addedBy: 'Amy' },
    { listId: groceries.id, text: 'Bananas', addedBy: 'Amy' },
    { listId: groceries.id, text: 'Chicken breast', addedBy: 'Amy' },
    { listId: houseItems.id, text: 'Batteries (AA)', addedBy: 'Amy' },
    { listId: houseItems.id, text: 'Light globes', addedBy: 'Amy' },
    { listId: kidsWants.id, text: 'New footy boots', addedBy: 'Test Child' },
  ]);

  console.log('  Created 7 list items');

  // Create email addresses (for later phases, but schema is ready)
  await db.insert(schema.emailAddresses).values([
    {
      familyId: family.id,
      address: 'test-family@barry.au',
      addressType: 'friendly',
      status: 'active',
    },
    {
      familyId: family.id,
      address: 'tf8k2x@barry.au',
      addressType: 'slug',
      status: 'active',
    },
  ]);

  console.log('  Created 2 email addresses');

  // Seed sender allowlist
  await db.insert(schema.emailSenderAllowlist).values([
    {
      familyId: family.id,
      emailOrDomain: 'amy@zamapps.com',
      label: "Amy's email",
      addedBy: 'onboarding',
    },
  ]);

  console.log('  Created 1 allowlist entry');

  console.log('\nSeed complete!');
  console.log(`\nTest family ID: ${family.id}`);
  console.log('Use this ID for API testing and agent provisioning.\n');

  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
