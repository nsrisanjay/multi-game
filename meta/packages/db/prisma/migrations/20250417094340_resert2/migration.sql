/*
  Warnings:

  - You are about to drop the column `static` on the `Element` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Map` table. All the data in the column will be lost.
  - Made the column `avatarId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_avatarId_fkey";

-- AlterTable
ALTER TABLE "Element" DROP COLUMN "static";

-- AlterTable
ALTER TABLE "Map" DROP COLUMN "thumbnail";

-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "height" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
