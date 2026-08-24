-- CreateTable
CREATE TABLE "PageVisit" (
    "id" TEXT NOT NULL DEFAULT 'home',
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PageVisit_pkey" PRIMARY KEY ("id")
);
