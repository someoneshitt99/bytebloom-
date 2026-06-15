import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const pool = new pg.Pool({ 
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const MOCK_COURSES = [
  {
    id: 'topic-1',
    title: 'Section 1 Pengenalan Web Development',
    description: 'Belajar dasar-dasar membangun halaman web pertamamu!',
    order: 1,
    lessons: [
      {
        id: 'lesson-1',
        topicId: 'topic-1',
        title: 'Level 1 Introduction',
        description: 'Perkenalan dunia web dan robot Bloomie.',
        order: 1,
        xpReward: 20,
        challenges: [
          {
            id: 't1-l1-c1',
            lessonId: 'lesson-1',
            type: 'THEORY',
            order: 1,
            instructions: 'Hai! Aku Bloomie! Di sini kita akan belajar membuat website keren menggunakan HTML, CSS, dan Javascript. HTML bertugas menyusun tulisan, gambar, dan tombol. Yuk kita coba!',
            choices: [],
            correctAnswer: 'next'
          },
          {
            id: 't1-l1-c2',
            lessonId: 'lesson-1',
            type: 'MULTIPLE_CHOICE',
            order: 2,
            instructions: 'Manakah bahasa utama yang digunakan untuk membuat struktur halaman web?',
            choices: ['HTML', 'CSS', 'JavaScript'],
            correctAnswer: 'HTML'
          },
          {
            id: 't1-l1-c3',
            lessonId: 'lesson-1',
            type: 'CODE_PUZZLE',
            order: 3,
            instructions: 'Bantu Bloomie melangkah ke kanan 2 kali untuk mengambil bintang HTML! Lengkapi blok kode di bawah.',
            codeTemplate: 'bloomie.moveRight();\nbloomie.[BLANK];',
            choices: ['moveRight()', 'moveLeft()', 'jump()'],
            correctAnswer: 'moveRight()',
            expectedOutput: 'right,right'
          }
        ]
      },
      {
        id: 'lesson-2',
        topicId: 'topic-1',
        title: 'Level 2 HTML Dasar',
        description: 'Belajar membuat elemen dasar HTML.',
        order: 2,
        xpReward: 25,
        challenges: [
          {
            id: 't1-l2-c1',
            lessonId: 'lesson-2',
            type: 'FILL_IN_BLANK',
            order: 1,
            instructions: 'Lompati lubang batu lalu berjalan ke kiri! Lengkapi kode di bawah.',
            codeTemplate: 'bloomie.[BLANK]();\nbloomie.[BLANK]();',
            choices: ['jump', 'moveLeft', 'moveRight'],
            correctAnswer: 'jump,moveLeft',
            expectedOutput: 'jump,left'
          }
        ]
      },
      {
        id: 'lesson-3',
        topicId: 'topic-1',
        title: 'Level 3 Tag & Elemen',
        description: 'Belajar tag Heading untuk tulisan besar.',
        order: 3,
        xpReward: 30,
        challenges: [
          {
            id: 't1-l3-c1',
            lessonId: 'lesson-3',
            type: 'THEORY',
            order: 1,
            instructions: 'Tag Heading seperti `<h1>` digunakan untuk membuat judul tulisan menjadi besar dan tebal! Sedangkan tag `<p>` digunakan untuk menulis teks isi cerita biasa.',
            choices: [],
            correctAnswer: 'next'
          },
          {
            id: 't1-l3-c2',
            lessonId: 'lesson-3',
            type: 'MULTIPLE_CHOICE',
            order: 2,
            instructions: 'Tag HTML mana yang kamu gunakan untuk membuat teks menjadi Judul Utama yang sangat besar?',
            choices: ['<h1>', '<p>', '<img>'],
            correctAnswer: '<h1>'
          },
          {
            id: 't1-l3-c3',
            lessonId: 'lesson-3',
            type: 'CODE_PUZZLE',
            order: 3,
            instructions: 'Bantu Bloomie melengkapi tag paragraf di bawah untuk menulis isi cerita! Pilihlah kata yang tepat di bawah.',
            codeTemplate: '<p>Aku suka belajar [BLANK]</p>',
            choices: ['coding', '<h1>', '</html>'],
            correctAnswer: 'coding'
          }
        ]
      },
      {
        id: 'lesson-4',
        topicId: 'topic-1',
        title: 'Level 4 Struktur Halaman',
        description: 'Menyusun elemen halaman web yang rapi.',
        order: 4,
        xpReward: 35,
        challenges: [
          {
            id: 't1-l4-c1',
            lessonId: 'lesson-4',
            type: 'THEORY',
            order: 1,
            instructions: 'Tag pembungkus utama seperti `<main>` sangat berguna untuk menyatukan seluruh judul dan paragraf di dalam satu rumah kontainer yang rapi!',
            choices: [],
            correctAnswer: 'next'
          },
          {
            id: 't1-l4-c2',
            lessonId: 'lesson-4',
            type: 'FILL_IN_BLANK',
            order: 2,
            instructions: 'Bantu Bloomie membungkus judul kita menggunakan tag kontainer utama pembungkus yang benar!',
            codeTemplate: '<[BLANK]>\n  <h1>ByteBloom</h1>\n</[BLANK]>',
            choices: ['main', 'h1', 'p', 'body'],
            correctAnswer: 'main,main'
          }
        ]
      }
    ]
  },
  {
    id: 'topic-2',
    title: 'Section 2 Interactive',
    description: 'Tambahkan logika ajaib JavaScript agar halaman web bisa beraksi!',
    order: 2,
    lessons: [
      { id: 'lesson-5', topicId: 'topic-2', title: 'Lv 1', description: 'Pengenalan aksi klik.', order: 1, xpReward: 20, challenges: [{ id: 't2-l1-c1', lessonId: 'lesson-5', type: 'THEORY', order: 1, instructions: 'Buka petualangan interaktif!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-6', topicId: 'topic-2', title: 'Lv 2', description: 'Kotak dialog pesan.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-7', topicId: 'topic-2', title: 'Lv 3', description: 'Animasi ketukan.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-8', topicId: 'topic-2', title: 'Lv 4', description: 'Logika bersyarat.', order: 4, xpReward: 20, challenges: [] }
    ]
  },
  {
    id: 'topic-3',
    title: 'HTML & CSS Sederhana',
    description: 'Hias halaman web pertamamu dengan warna dan gaya yang cerah!',
    order: 3,
    lessons: [
      { id: 'lesson-9', topicId: 'topic-3', title: 'Lv 1', description: 'Mewarnai latar belakang.', order: 1, xpReward: 20, challenges: [{ id: 't3-l1-c1', lessonId: 'lesson-9', type: 'THEORY', order: 1, instructions: 'Belajar CSS dasar!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-10', topicId: 'topic-3', title: 'Lv 2', description: 'Gaya huruf.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-11', topicId: 'topic-3', title: 'Lv 3', description: 'Ukuran kotak.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-12', topicId: 'topic-3', title: 'Lv 4', description: 'Border playful.', order: 4, xpReward: 20, challenges: [] }
    ]
  },
  {
    id: 'topic-4',
    title: 'Flexbox',
    description: 'Atur posisi elemen sejajar mendatar atau menurun dengan Flexbox!',
    order: 4,
    lessons: [
      { id: 'lesson-13', topicId: 'topic-4', title: 'Lv 1', description: 'Arah susunan flex.', order: 1, xpReward: 20, challenges: [{ id: 't4-l1-c1', lessonId: 'lesson-13', type: 'THEORY', order: 1, instructions: 'Flexbox dasar!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-14', topicId: 'topic-4', title: 'Lv 2', description: 'Perataan tengah.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-15', topicId: 'topic-4', title: 'Lv 3', description: 'Jarak antar elemen.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-16', topicId: 'topic-4', title: 'Lv 4', description: 'Bungkus baris.', order: 4, xpReward: 20, challenges: [] }
    ]
  },
  {
    id: 'topic-5',
    title: 'Grid',
    description: 'Desain layout papan catur ajaib menggunakan CSS Grid!',
    order: 5,
    lessons: [
      { id: 'lesson-17', topicId: 'topic-5', title: 'Lv 1', description: 'Membuat kolom grid.', order: 1, xpReward: 20, challenges: [{ id: 't5-l1-c1', lessonId: 'lesson-17', type: 'THEORY', order: 1, instructions: 'Grid dasar!', choices: [], correctAnswer: 'next' }] },
      { id: 'lesson-18', topicId: 'topic-5', title: 'Lv 2', description: 'Mengatur ukuran baris.', order: 2, xpReward: 20, challenges: [] },
      { id: 'lesson-19', topicId: 'topic-5', title: 'Lv 3', description: 'Menggabungkan kolom.', order: 3, xpReward: 20, challenges: [] },
      { id: 'lesson-20', topicId: 'topic-5', title: 'Lv 4', description: 'Halaman penuh Grid.', order: 4, xpReward: 20, challenges: [] }
    ]
  }
];

async function main() {
  console.log("Memulai seeding kurikulum...");
  
  try {
    await prisma.$transaction(async (tx) => {
      // Hapus data lama
      console.log("Membersihkan data lama...");
      await tx.challenge.deleteMany();
      await tx.lesson.deleteMany();
      await tx.courseTopic.deleteMany();

      console.log("Memasukkan data kurikulum baru...");
      for (const topic of MOCK_COURSES) {
        await tx.courseTopic.create({
          data: {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            order: topic.order,
            lessons: {
              create: topic.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                description: lesson.description,
                order: lesson.order,
                xpReward: lesson.xpReward,
                challenges: {
                  create: lesson.challenges.map((c) => ({
                    id: c.id,
                    type: c.type as any,
                    order: c.order,
                    instructions: c.instructions,
                    codeTemplate: c.codeTemplate || null,
                    correctAnswer: c.correctAnswer,
                    choices: c.choices,
                    expectedOutput: (c as any).expectedOutput || null,
                  }))
                }
              }))
            }
          }
        });
      }
    }, {
      maxWait: 20000,
      timeout: 60000
    });
    console.log("Seeding kurikulum berhasil selesai!");
  } catch (error) {
    console.error("Gagal melakukan seeding:", error);
  } finally {
    await prisma.$disconnect();
    pool.end();
  }
}

main();
