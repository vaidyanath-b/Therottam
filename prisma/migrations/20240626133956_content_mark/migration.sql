-- AlterTable
ALTER TABLE "StudyRoomContent" ALTER COLUMN "difficulty" SET DEFAULT 'EASY';

-- CreateTable
CREATE TABLE "ContentMark" (
    "content_id" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "studyRoom_id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "note" TEXT,
    "markedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentMark_pkey" PRIMARY KEY ("studyRoom_id","day","content_id","username")
);

-- AddForeignKey
ALTER TABLE "ContentMark" ADD CONSTRAINT "ContentMark_content_id_studyRoom_id_day_fkey" FOREIGN KEY ("content_id", "studyRoom_id", "day") REFERENCES "StudyRoomContent"("id", "studyRoom_id", "day") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentMark" ADD CONSTRAINT "ContentMark_username_fkey" FOREIGN KEY ("username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
