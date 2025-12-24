import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create companies
  const smileCare = await prisma.bedrijf.upsert({
    where: { bedrijf_id: 1 },
    update: {},
    create: {
      bedrijf_id: 1,
      naam: "Tandartsenpraktijk SmileCare",
      email: "info@smilecare.nl",
      telefoonnummer: "020-1234567",
    },
  });

  const brightTeeth = await prisma.bedrijf.upsert({
    where: { bedrijf_id: 2 },
    update: {},
    create: {
      bedrijf_id: 2,
      naam: "Tandheelkundig Centrum BrightTeeth",
      email: "info@brightteeth.nl",
      telefoonnummer: "020-2345678",
    },
  });

  const hairStudio = await prisma.bedrijf.upsert({
    where: { bedrijf_id: 3 },
    update: {},
    create: {
      bedrijf_id: 3,
      naam: "HairStudio Luxe",
      email: "info@hairstudioluxe.nl",
      telefoonnummer: "020-3456789",
    },
  });

  const kapsalon = await prisma.bedrijf.upsert({
    where: { bedrijf_id: 4 },
    update: {},
    create: {
      bedrijf_id: 4,
      naam: "Kapsalon Trendy",
      email: "info@kapsalontrendy.nl",
      telefoonnummer: "020-4567890",
    },
  });

  // Create employees for Tandartsenpraktijk SmileCare
  const werknemersSmileCare = await Promise.all([
    prisma.werknemer.upsert({
      where: { clerkUserId: "smilecare_tandarts_1" },
      update: {},
      create: {
        clerkUserId: "smilecare_tandarts_1",
        voornaam: "Jan",
        naam: "de Vries",
        email: "j.devries@smilecare.nl",
        telefoonnummer: "06-11111111",
        geboorte_datum: new Date("1980-05-15"),
        bedrijf_id: smileCare.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "smilecare_tandarts_2" },
      update: {},
      create: {
        clerkUserId: "smilecare_tandarts_2",
        voornaam: "Maria",
        naam: "Jansen",
        email: "m.jansen@smilecare.nl",
        telefoonnummer: "06-22222222",
        geboorte_datum: new Date("1985-08-20"),
        bedrijf_id: smileCare.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "smilecare_tandarts_3" },
      update: {},
      create: {
        clerkUserId: "smilecare_tandarts_3",
        voornaam: "Pieter",
        naam: "Bakker",
        email: "p.bakker@smilecare.nl",
        telefoonnummer: "06-33333333",
        geboorte_datum: new Date("1975-03-10"),
        bedrijf_id: smileCare.bedrijf_id,
      },
    }),
  ]);

  // Create employees for Tandheelkundig Centrum BrightTeeth
  const werknemersBrightTeeth = await Promise.all([
    prisma.werknemer.upsert({
      where: { clerkUserId: "brightteeth_tandarts_1" },
      update: {},
      create: {
        clerkUserId: "brightteeth_tandarts_1",
        voornaam: "Lisa",
        naam: "van der Berg",
        email: "l.vanderberg@brightteeth.nl",
        telefoonnummer: "06-44444444",
        geboorte_datum: new Date("1982-11-25"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "brightteeth_tandarts_2" },
      update: {},
      create: {
        clerkUserId: "brightteeth_tandarts_2",
        voornaam: "Tom",
        naam: "Smit",
        email: "t.smit@brightteeth.nl",
        telefoonnummer: "06-55555555",
        geboorte_datum: new Date("1988-07-12"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "brightteeth_tandarts_3" },
      update: {},
      create: {
        clerkUserId: "brightteeth_tandarts_3",
        voornaam: "Emma",
        naam: "de Wit",
        email: "e.dewit@brightteeth.nl",
        telefoonnummer: "06-66666666",
        geboorte_datum: new Date("1990-01-30"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
    }),
  ]);

  // Create employees for HairStudio Luxe
  const werknemersHairStudio = await Promise.all([
    prisma.werknemer.upsert({
      where: { clerkUserId: "hairstudio_kapper_1" },
      update: {},
      create: {
        clerkUserId: "hairstudio_kapper_1",
        voornaam: "Sophie",
        naam: "Mulder",
        email: "s.mulder@hairstudioluxe.nl",
        telefoonnummer: "06-77777777",
        geboorte_datum: new Date("1992-04-18"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "hairstudio_kapper_2" },
      update: {},
      create: {
        clerkUserId: "hairstudio_kapper_2",
        voornaam: "Mike",
        naam: "van Dijk",
        email: "m.vandijk@hairstudioluxe.nl",
        telefoonnummer: "06-88888888",
        geboorte_datum: new Date("1987-09-05"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "hairstudio_kapper_3" },
      update: {},
      create: {
        clerkUserId: "hairstudio_kapper_3",
        voornaam: "Anna",
        naam: "Meijer",
        email: "a.meijer@hairstudioluxe.nl",
        telefoonnummer: "06-99999999",
        geboorte_datum: new Date("1995-12-22"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
    }),
  ]);

  // Create employees for Kapsalon Trendy
  const werknemersKapsalon = await Promise.all([
    prisma.werknemer.upsert({
      where: { clerkUserId: "kapsalon_kapper_1" },
      update: {},
      create: {
        clerkUserId: "kapsalon_kapper_1",
        voornaam: "David",
        naam: "Hoekstra",
        email: "d.hoekstra@kapsalontrendy.nl",
        telefoonnummer: "06-10101010",
        geboorte_datum: new Date("1989-06-14"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "kapsalon_kapper_2" },
      update: {},
      create: {
        clerkUserId: "kapsalon_kapper_2",
        voornaam: "Laura",
        naam: "Post",
        email: "l.post@kapsalontrendy.nl",
        telefoonnummer: "06-20202020",
        geboorte_datum: new Date("1993-10-28"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { clerkUserId: "kapsalon_kapper_3" },
      update: {},
      create: {
        clerkUserId: "kapsalon_kapper_3",
        voornaam: "Rick",
        naam: "de Boer",
        email: "r.deboer@kapsalontrendy.nl",
        telefoonnummer: "06-30303030",
        geboorte_datum: new Date("1991-02-08"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
    }),
  ]);

  const allWerknemers = [
    ...werknemersSmileCare,
    ...werknemersBrightTeeth,
    ...werknemersHairStudio,
    ...werknemersKapsalon,
  ];

  console.log(`Created ${allWerknemers.length} employees`);

  // Generate availability for all employees for the next 30 days
  const slotDuration = 30; // minutes
  const startHour = 9;
  const endHour = 17;
  const daysToGenerate = 30;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const beschikbaarheden: Array<{
    werknemerId: number;
    start_datum: Date;
    eind_datum: Date;
    isBeschikbaar: boolean;
  }> = [];

  for (const werknemer of allWerknemers) {
    for (let day = 0; day < daysToGenerate; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + day);

      // Skip weekends (Saturday = 6, Sunday = 0)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      // Generate slots from 09:00 to 17:00
      const slotStart = new Date(currentDate);
      slotStart.setHours(startHour, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(endHour, 0, 0, 0);

      while (slotStart < dayEnd) {
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

        beschikbaarheden.push({
          werknemerId: werknemer.werknemer_id,
          start_datum: new Date(slotStart),
          eind_datum: new Date(slotEnd),
          isBeschikbaar: true,
        });

        slotStart.setMinutes(slotStart.getMinutes() + slotDuration);
      }
    }
  }

  // Delete existing beschikbaarheden to ensure idempotency
  await prisma.beschikbaarheid.deleteMany({});

  // Create all beschikbaarheden in batches
  const batchSize = 1000;
  for (let i = 0; i < beschikbaarheden.length; i += batchSize) {
    const batch = beschikbaarheden.slice(i, i + batchSize);
    await prisma.beschikbaarheid.createMany({
      data: batch,
    });
    console.log(`Created ${Math.min(i + batchSize, beschikbaarheden.length)}/${beschikbaarheden.length} availability slots`);
  }

  console.log(`Seed completed. Created ${beschikbaarheden.length} availability slots.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

