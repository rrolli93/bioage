-- CreateTable
CREATE TABLE "ProtocolEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startDate" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "compound" TEXT NOT NULL,
    "dose" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "source" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProtocolEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BioAgeEntry" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TIMESTAMP(3) NOT NULL,
    "chronoAge" DOUBLE PRECISION NOT NULL,
    "phenoAge" DOUBLE PRECISION NOT NULL,
    "delta" DOUBLE PRECISION NOT NULL,
    "metabolicAge" DOUBLE PRECISION,
    "immuneAge" DOUBLE PRECISION,
    "inflammatoryAge" DOUBLE PRECISION,
    "hematologicalAge" DOUBLE PRECISION,
    "rawInputs" JSONB NOT NULL,

    CONSTRAINT "BioAgeEntry_pkey" PRIMARY KEY ("id")
);
