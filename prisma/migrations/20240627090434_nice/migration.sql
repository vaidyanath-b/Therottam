-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studyRoom_id_quizId_day_fkey" FOREIGN KEY ("studyRoom_id", "quizId", "day") REFERENCES "StudyRoomQuiz"("studyRoom_id", "quizId", "day") ON DELETE RESTRICT ON UPDATE CASCADE;
