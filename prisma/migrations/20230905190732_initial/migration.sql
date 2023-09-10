/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Message" (
    "id" STRING NOT NULL,
    "text" STRING NOT NULL,
    "likes" INT4 NOT NULL DEFAULT 0,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
