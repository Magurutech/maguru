import 'dotenv/config'
import prisma from '../lib/client'

async function applyMigration() {
  console.log('🔄 Menjalankan migrasi DDL untuk course_releases & publishedVersion...')

  try {
    // 1. Tambah kolom publishedVersion ke courses jika belum ada
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "publishedVersion" INTEGER;
    `)
    console.log('✅ Kolom publishedVersion pada courses siap.')

    // 2. Buat tabel course_releases jika belum ada
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "course_releases" (
        "id" TEXT NOT NULL,
        "courseId" VARCHAR(255) NOT NULL,
        "version" INTEGER NOT NULL,
        "title" VARCHAR(100) NOT NULL,
        "description" TEXT NOT NULL,
        "totalLessons" INTEGER NOT NULL DEFAULT 0,
        "snapshot" JSONB NOT NULL,
        "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "creatorId" VARCHAR(255) NOT NULL,
        CONSTRAINT "course_releases_pkey" PRIMARY KEY ("id")
      );
    `)
    console.log('✅ Tabel course_releases siap.')

    // 3. Buat indeks & foreign key
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "course_releases_courseId_version_key" ON "course_releases"("courseId", "version");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "course_releases_courseId_idx" ON "course_releases"("courseId");
    `)
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "course_releases_courseId_version_idx" ON "course_releases"("courseId", "version");
    `)

    // Foreign key constraint (aman jika sudah ada)
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'course_releases_courseId_fkey'
        ) THEN
          ALTER TABLE "course_releases" 
          ADD CONSTRAINT "course_releases_courseId_fkey" 
          FOREIGN KEY ("courseId") REFERENCES "courses"("id") 
          ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `)
    console.log('✅ Indeks dan Foreign Key course_releases siap.')

    console.log('🎉 Migrasi DDL berhasil!')
  } catch (error) {
    console.error('❌ Gagal menjalankan migrasi DDL:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

applyMigration()
