import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const crypto = ['XBT', 'BCH', 'ETH'];
  const currencies = ['USD', 'EUR', 'CAD', 'AUD', 'GBP', 'CHF', 'JPY'];

  await Promise.all(
    crypto.map(async (name) => {
      await prisma.currency.create({
        data: {
          name,
          crypto: true,
        },
      });
    }),
  );

  await Promise.all(
    currencies.map(async (name) => {
      await prisma.currency.create({
        data: {
          name,
          crypto: false,
        },
      });
    }),
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
