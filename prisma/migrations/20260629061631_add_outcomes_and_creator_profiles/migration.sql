-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "outcomes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "creator_profiles" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(100),
    "title" VARCHAR(100),
    "bio" TEXT,
    "experience" TEXT,
    "avatarUrl" VARCHAR(255),
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creator_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creator_profiles_userId_key" ON "creator_profiles"("userId");
