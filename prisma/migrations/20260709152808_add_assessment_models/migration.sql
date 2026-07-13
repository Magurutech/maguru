-- CreateTable
CREATE TABLE "assessment_questions" (
    "id" TEXT NOT NULL,
    "courseId" VARCHAR(255) NOT NULL,
    "sectionId" VARCHAR(255),
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct" CHAR(1) NOT NULL,
    "topic" VARCHAR(100) NOT NULL,
    "difficulty" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_assessments" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "courseId" VARCHAR(255) NOT NULL,
    "sectionId" VARCHAR(255),
    "score" DOUBLE PRECISION NOT NULL,
    "type" VARCHAR(20) NOT NULL DEFAULT 'PRE_TEST',
    "answers" JSONB NOT NULL,
    "durationSeconds" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assessment_questions_courseId_idx" ON "assessment_questions"("courseId");

-- CreateIndex
CREATE INDEX "assessment_questions_sectionId_idx" ON "assessment_questions"("sectionId");

-- CreateIndex
CREATE INDEX "assessment_questions_topic_idx" ON "assessment_questions"("topic");

-- CreateIndex
CREATE INDEX "assessment_questions_courseId_topic_idx" ON "assessment_questions"("courseId", "topic");

-- CreateIndex
CREATE INDEX "user_assessments_userId_idx" ON "user_assessments"("userId");

-- CreateIndex
CREATE INDEX "user_assessments_courseId_idx" ON "user_assessments"("courseId");

-- CreateIndex
CREATE INDEX "user_assessments_sectionId_idx" ON "user_assessments"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_assessments_userId_courseId_sectionId_type_key" ON "user_assessments"("userId", "courseId", "sectionId", "type");

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_assessments" ADD CONSTRAINT "user_assessments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_assessments" ADD CONSTRAINT "user_assessments_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
