import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // ---------------------- سرویس‌ها ----------------------
  const services = [
    { id: "svc_manicure", name: "مانیکور لوکس", durationMin: 45, price: 200000 },
    { id: "svc_pedicure", name: "پدیکور حرفه‌ای", durationMin: 60, price: 250000 },
    { id: "svc_gel", name: "لاک ژل رزگلد", durationMin: 50, price: 300000 },
    { id: "svc_french", name: "فرنچ کلاسیک", durationMin: 40, price: 220000 },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  // ---------------------- پرسنل ----------------------
  const staffList = [
    { id: "stf_sara", name: "سارا", bio: "تخصص در ژل و فرنچ" },
    { id: "stf_nazanin", name: "نازنین", bio: "طراحی مینیمال و نگین‌گذاری" },
    { id: "stf_hanie", name: "هانیه", bio: "مانیکور و پدیکور حرفه‌ای" },
  ];
  for (const st of staffList) {
    await prisma.staff.upsert({ where: { id: st.id }, update: {}, create: st });
  }

  // ---------------------- کاربر تستی ----------------------
  const user = await prisma.user.upsert({
    where: { phone: "09120000000" },
    update: {},
    create: { name: "نگار محمدی", phone: "09120000000", city: "تهران" },
  });

  // ---------------------- رزرو تستی ----------------------
  await prisma.reservation.upsert({
    where: { id: "seed-reservation" },
    update: {},
    create: {
      id: "seed-reservation",
      serviceId: "svc_manicure",
      staffId: "stf_sara",
      userId: user.id, // 👈 هماهنگ با schema جدید
      startsAt: "1404/08/02 10:30",
      endsAt: "1404/08/02 11:30",
      status: "PENDING",
      notes: "رزرو تستی برای بررسی سیستم",
    },
  });

  // ---------------------- گالری ----------------------
  const galleryItems = [
    { id: "gal_french", title: "فرنچ کلاسیک", style: "کلاسیک", imageUrl: "/sample1.jpg", tags: "فرنچ,کلاسیک,ساده" },
    { id: "gal_gel", title: "لاک ژل رزگلد", style: "ژل", imageUrl: "/sample2.jpg", tags: "ژل,رزگلد,براق" },
    { id: "gal_stone", title: "دیزاین نگین‌دار", style: "فانتزی", imageUrl: "/sample3.jpg", tags: "نگین,فانتزی,براق" },
  ];
  for (const g of galleryItems) {
    await prisma.galleryItem.upsert({ where: { id: g.id }, update: {}, create: g });
  }

  // ---------------------- محتوای سایت ----------------------
  const siteContents = [
    { key: "hero_badge", value: "لوکس و حرفه‌ای" },
    { key: "hero_title", value: "سالن ناخن رز" },
    { key: "hero_subtitle", value: "تجربه‌ای متفاوت از زیبایی ناخن ..." },
    { key: "hero_cta2", value: "مشاهده گالری" },
    { key: "hero_cta3", value: "مشاهده خدمات" },
    { key: "feature1_title", value: "محیط لوکس و آرامش‌بخش" },
    { key: "feature1_desc", value: "طراحی داخلی مدرن و فضایی آرام ..." },
    { key: "info_address_title", value: "آدرس" },
    { key: "info_address_text", value: "تهران، ایران — همه روزه از ۱۰ صبح تا ۸ شب" },
    { key: "info_contact_title", value: "تماس" },
    { key: "info_contact_text", value: "۰۹۱۲-۰۰۰-۰۰۰۰ — واتس‌اپ فعال" },
    { key: "info_reserve_title", value: "رزرو آنلاین" },
    { key: "info_reserve_text", value: "با چند کلیک زمان خودت رو هماهنگ کن" },
  ];
  for (const item of siteContents) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }

  // ---------------------- ادمین ----------------------
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: { email: "admin@example.com", password: hashedPassword },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
