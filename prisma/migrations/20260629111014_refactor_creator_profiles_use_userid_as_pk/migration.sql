/*
  Warnings:

  - The primary key for the `creator_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `creator_profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "creator_profiles_userId_key";

-- AlterTable
ALTER TABLE "creator_profiles" DROP CONSTRAINT "creator_profiles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "creator_profiles_pkey" PRIMARY KEY ("userId");
