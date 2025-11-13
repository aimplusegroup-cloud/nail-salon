import { prisma } from "@/lib/prisma";

async function main() {
  // همه رکوردهایی که مسیرشان با /uploads شروع می‌شود → static
  await prisma.galleryItem.updateMany({
    where: {
      imageUrl: {
        startsWith: "/uploads/",
      },
    },
    data: {
      source: "static",
    },
  });

  console.log("✅ همه رکوردهای استاتیک به source=static تغییر کردند");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
