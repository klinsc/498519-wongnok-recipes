# 498519-wongnok-recipes

## Online Demo: [https://wongnok.chatbordin.com/](https://wongnok.chatbordin.com/)

### ขั้นตอนการติดตั้ง

1. โคลน Repository:

```bash
git clone https://github.com/klinsc/498519-wongnok-recipes
cd 498519-wongnok-recipes
```

2. ติดตั้ง Dependencies:

```bash
pnpm install
```

3. สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

4. หากต้องการสร้างฐานข้อมูลที่ Docker บนเครืองของคุณเอง ให้ใช้คำสั่ง: (ต้องติดตั้ง Docker ก่อน)

5. ตั้งค่า Environment Variables ในไฟล์ `.env` ให้ครบถ้วน
   - `DATABASE_URL` สำหรับการเชื่อมต่อกับฐานข้อมูล MySQL
   - `FIREBASE_STORAGE_BUCKET` สำหรับการเชื่อมต่อกับ Firebase Storage
   - `AUTH_SECRET` สำหรับการเข้ารหัสข้อมูล

```bash
start-database.sh
npx prisma db push
```

6. ทำการสร้างไฟล์ build และเริ่มเซิร์ฟเวอร์:

```bash
pnpm build
pnpm start
```

7. เปิดเบราว์เซอร์และไปที่ [http://localhost:3000](http://localhost:3000) เพื่อดูแอปพลิเคชัน
8. หากต้องการให้แอปพลิเคชันทำงานตลอดเวลา สามารถใช้คำสั่ง `pm2` หรือ `forever` เพื่อรันแอปพลิเคชันในพื้นหลังได้

```bash
npm install -g pm2
pm2 start build/index.js --name "wongnok-recipes"
```

### การใช้งาน

- เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
- ค้นหาสูตรอาหารที่สนใจ
- สร้างและจัดการสูตรอาหารของคุณเอง
- แชร์สูตรอาหารกับผู้ใช้คนอื่น
- แสดงความคิดเห็นและให้คะแนนสูตรอาหาร
- บันทึกสูตรอาหารที่คุณชื่นชอบ
- ดูสูตรอาหารที่ได้รับความนิยม
