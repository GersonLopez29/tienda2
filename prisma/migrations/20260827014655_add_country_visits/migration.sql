-- CreateTable
CREATE TABLE "CountryVisit" (
    "country" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CountryVisit_pkey" PRIMARY KEY ("country")
);
