-- CreateEnum
CREATE TYPE "SegmentType" AS ENUM ('TRIP', 'QUESTION', 'MUSIC', 'SPECIAL');

-- CreateEnum
CREATE TYPE "TeamState" AS ENUM ('IDLE', 'STOPPED', 'STOPPED_ANSWERED', 'STOPPED_HANDLED', 'ANSWERED', 'ANSWERED_HANDLED');

-- CreateTable
CREATE TABLE "competitions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hosts" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "current_stage" INTEGER,
    "current_level" INTEGER,
    "winner_team_id" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "competitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "members" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segments" (
    "id" TEXT NOT NULL,
    "competition_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "nearest_trip" INTEGER,
    "order_of_type" INTEGER NOT NULL,
    "type" "SegmentType" NOT NULL DEFAULT 'QUESTION',
    "number_of_options" INTEGER,
    "score_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "segment_team_states" (
    "id" TEXT NOT NULL,
    "segment_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "state" "TeamState" NOT NULL DEFAULT 'IDLE',
    "stop_level" INTEGER,
    "score" INTEGER,

    CONSTRAINT "segment_team_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "state_id" TEXT NOT NULL,
    "question_number" INTEGER NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competitions_winner_team_id_key" ON "competitions"("winner_team_id");

-- CreateIndex
CREATE UNIQUE INDEX "segments_competition_id_order_key" ON "segments"("competition_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "segment_team_states_segment_id_team_id_key" ON "segment_team_states"("segment_id", "team_id");

-- CreateIndex
CREATE UNIQUE INDEX "answers_state_id_question_number_key" ON "answers"("state_id", "question_number");

-- AddForeignKey
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segments" ADD CONSTRAINT "segments_competition_id_fkey" FOREIGN KEY ("competition_id") REFERENCES "competitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_team_states" ADD CONSTRAINT "segment_team_states_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "segment_team_states" ADD CONSTRAINT "segment_team_states_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "segment_team_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
