-- Redesign CountryVisit to track visits per country per day instead of a lifetime total.
DROP TABLE "CountryVisit";

CREATE TABLE "CountryVisit" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CountryVisit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CountryVisit_country_date_key" ON "CountryVisit"("country", "date");

CREATE INDEX "CountryVisit_date_idx" ON "CountryVisit"("date");
