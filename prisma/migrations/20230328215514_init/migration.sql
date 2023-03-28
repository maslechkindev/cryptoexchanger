-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "crypto" BOOLEAN NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balances" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "currencyId" INTEGER NOT NULL,
    "sum" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "balanceHistory" (
    "id" SERIAL NOT NULL,
    "balanceId" INTEGER NOT NULL,
    "currencyExchangeId" INTEGER NOT NULL,
    "sum" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balanceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_key" ON "currencies"("name");

-- AddForeignKey
ALTER TABLE "balances" ADD CONSTRAINT "balances_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balances" ADD CONSTRAINT "balances_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balanceHistory" ADD CONSTRAINT "balanceHistory_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "balances"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "balanceHistory" ADD CONSTRAINT "balanceHistory_currencyExchangeId_fkey" FOREIGN KEY ("currencyExchangeId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
