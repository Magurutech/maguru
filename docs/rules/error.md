(base) PS D:\.maguru\maguru> npx prisma generate
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma\schema.prisma.

✔ Generated Prisma Client (v7.4.2) to .\prisma\generated\prisma in 634ms

Start by importing your Prisma Client (See: https://pris.ly/d/importing-client)


(base) PS D:\.maguru\maguru> npx prisma migrate dev --name add_content_management_models
Loaded Prisma config from prisma.config.ts.

Prisma schema loaded from prisma\schema.prisma.
Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-1-ap-south-1.pooler.supabase.com:5432"

Applying migration `20250710130222_add_enrollment_model`

The following migration(s) have been applied:

migrations/
  └─ 20250710130222_add_enrollment_model/
    └─ migration.sql
Applying migration `20260308023835_add_content_management_models`


The following migration(s) have been created and applied from new schema changes:

prisma\migrations/
  └─ 20260308023835_add_content_management_models/
    └─ migration.sql

Your database is now in sync with your schema.

(base) PS D:\.maguru\maguru> 