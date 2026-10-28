import bcrypt from "bcryptjs";
import { prisma } from "../src/utils/prisma.js";

const users = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "Password123!",
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "Password123!",
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "Password123!",
  },
];

const reasons = {
  Income: [
    "Monthly salary",
    "Freelance project",
    "Client payment",
    "Business revenue",
    "Online sale",
    "Investment return",
    "Consulting service",
    "Bonus payment",
    "Side hustle",
    "Cashback reward",
  ],
  Expense: [
    "Groceries",
    "Restaurant",
    "Rent",
    "Transportation",
    "Internet bill",
    "Electricity bill",
    "Shopping",
    "Coffee",
    "Fuel",
    "Phone bill",
    "Gym membership",
    "Entertainment",
    "Medical expenses",
    "Clothing",
    "Household supplies",
    "Subscription",
    "Travel",
    "Food delivery",
  ],
};

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomAmount(type) {
  if (type === "Income") {
    return Math.floor(Math.random() * 4500) + 200;
  }

  return Math.floor(Math.random() * 500) + 20;
}

function randomDateInDay(year, month, day) {
  const date = new Date(year, month, day);

  // Random time during the day, between 08:00 and 22:59.
  date.setHours(
    Math.floor(Math.random() * 15) + 8,
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60),
    0,
  );

  return date;
}

function randomTrackType() {
  return Math.random() < 0.3 ? "Income" : "Expense";
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // Delete existing data in the correct relation order.
  await prisma.track.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️ Existing users and tracks deleted.");

  // September 1, 2026 through October 27, 2026, inclusive.
  const startDate = new Date(2026, 8, 1);
  const yesterday = new Date(2026, 9, 27);

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    let trackCount = 0;

    for (
      let day = new Date(startDate);
      day <= yesterday;
      day.setDate(day.getDate() + 1)
    ) {
      // Each user gets 1–6 tracks every day.
      const tracksPerDay = Math.floor(Math.random() * 6) + 1;

      for (let i = 0; i < tracksPerDay; i++) {
        const type = randomTrackType();

        await prisma.track.create({
          data: {
            userId: user.id,
            type,
            amount: randomAmount(type),
            reason: randomItem(reasons[type]),
            createdAt: randomDateInDay(
              day.getFullYear(),
              day.getMonth(),
              day.getDate(),
            ),
          },
        });

        trackCount++;
      }
    }

    console.log(`✅ ${user.name}: created ${trackCount} tracks`);
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
