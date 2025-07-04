/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" VARCHAR(255),
    "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT',
    "students" INTEGER NOT NULL DEFAULT 0,
    "lessons" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL DEFAULT '0 jam',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "category" VARCHAR(50) NOT NULL,
    "creatorId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);
