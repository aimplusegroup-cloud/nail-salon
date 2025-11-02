// hash-password.js
import bcrypt from "bcrypt";

const password = process.argv[2]; // رمز رو از خط فرمان می‌گیره

if (!password) {
  console.error("لطفاً رمز عبور رو به عنوان آرگومان وارد کنید");
  process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log("رمز هش‌شده:");
  console.log(hash);
});
