// prisma/seed.ts (of waar jouw seed file staat)

import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  // =========================
  // 1) BEDRIJVEN
  // =========================
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

  // =========================
  // 2) WERKNEMERS
  //    - Upsert op unieke email
  //    - werknemer_id NIET zetten
  // =========================

  // SmileCare werknemers
  const werknemersSmileCare = await Promise.all([
    prisma.werknemer.upsert({
      where: { email: "j.devries@smilecare.nl" },
      update: {
        voornaam: "Jan",
        naam: "de Vries",
        telefoonnummer: "06-11111111",
        geboorte_datum: new Date("1980-05-15"),
        bedrijf_id: smileCare.bedrijf_id,
      },
      create: {
        voornaam: "Jan",
        naam: "de Vries",
        email: "j.devries@smilecare.nl",
        telefoonnummer: "06-11111111",
        geboorte_datum: new Date("1980-05-15"),
        bedrijf_id: smileCare.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "m.jansen@smilecare.nl" },
      update: {
        voornaam: "Maria",
        naam: "Jansen",
        telefoonnummer: "06-22222222",
        geboorte_datum: new Date("1985-08-20"),
        bedrijf_id: smileCare.bedrijf_id,
      },
      create: {
        voornaam: "Maria",
        naam: "Jansen",
        email: "m.jansen@smilecare.nl",
        telefoonnummer: "06-22222222",
        geboorte_datum: new Date("1985-08-20"),
        bedrijf_id: smileCare.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "p.bakker@smilecare.nl" },
      update: {
        voornaam: "Pieter",
        naam: "Bakker",
        telefoonnummer: "06-33333333",
        geboorte_datum: new Date("1975-03-10"),
        bedrijf_id: smileCare.bedrijf_id,
      },
      create: {
        voornaam: "Pieter",
        naam: "Bakker",
        email: "p.bakker@smilecare.nl",
        telefoonnummer: "06-33333333",
        geboorte_datum: new Date("1975-03-10"),
        bedrijf_id: smileCare.bedrijf_id,
      },
    }),
  ]);

  // BrightTeeth werknemers
  const werknemersBrightTeeth = await Promise.all([
    prisma.werknemer.upsert({
      where: { email: "l.vanderberg@brightteeth.nl" },
      update: {
        voornaam: "Lisa",
        naam: "van der Berg",
        telefoonnummer: "06-44444444",
        geboorte_datum: new Date("1982-11-25"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
      create: {
        voornaam: "Lisa",
        naam: "van der Berg",
        email: "l.vanderberg@brightteeth.nl",
        telefoonnummer: "06-44444444",
        geboorte_datum: new Date("1982-11-25"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "t.smit@brightteeth.nl" },
      update: {
        voornaam: "Tom",
        naam: "Smit",
        telefoonnummer: "06-55555555",
        geboorte_datum: new Date("1988-07-12"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
      create: {
        voornaam: "Tom",
        naam: "Smit",
        email: "t.smit@brightteeth.nl",
        telefoonnummer: "06-55555555",
        geboorte_datum: new Date("1988-07-12"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "e.dewit@brightteeth.nl" },
      update: {
        voornaam: "Emma",
        naam: "de Wit",
        telefoonnummer: "06-66666666",
        geboorte_datum: new Date("1990-01-30"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
      create: {
        voornaam: "Emma",
        naam: "de Wit",
        email: "e.dewit@brightteeth.nl",
        telefoonnummer: "06-66666666",
        geboorte_datum: new Date("1990-01-30"),
        bedrijf_id: brightTeeth.bedrijf_id,
      },
    }),
  ]);

  // HairStudio werknemers
  const werknemersHairStudio = await Promise.all([
    prisma.werknemer.upsert({
      where: { email: "s.mulder@hairstudioluxe.nl" },
      update: {
        voornaam: "Sophie",
        naam: "Mulder",
        telefoonnummer: "06-77777777",
        geboorte_datum: new Date("1992-04-18"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
      create: {
        voornaam: "Sophie",
        naam: "Mulder",
        email: "s.mulder@hairstudioluxe.nl",
        telefoonnummer: "06-77777777",
        geboorte_datum: new Date("1992-04-18"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "m.vandijk@hairstudioluxe.nl" },
      update: {
        voornaam: "Mike",
        naam: "van Dijk",
        telefoonnummer: "06-88888888",
        geboorte_datum: new Date("1987-09-05"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
      create: {
        voornaam: "Mike",
        naam: "van Dijk",
        email: "m.vandijk@hairstudioluxe.nl",
        telefoonnummer: "06-88888888",
        geboorte_datum: new Date("1987-09-05"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "a.meijer@hairstudioluxe.nl" },
      update: {
        voornaam: "Anna",
        naam: "Meijer",
        telefoonnummer: "06-99999999",
        geboorte_datum: new Date("1995-12-22"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
      create: {
        voornaam: "Anna",
        naam: "Meijer",
        email: "a.meijer@hairstudioluxe.nl",
        telefoonnummer: "06-99999999",
        geboorte_datum: new Date("1995-12-22"),
        bedrijf_id: hairStudio.bedrijf_id,
      },
    }),
  ]);

  // Kapsalon werknemers
  const werknemersKapsalon = await Promise.all([
    prisma.werknemer.upsert({
      where: { email: "d.hoekstra@kapsalontrendy.nl" },
      update: {
        voornaam: "David",
        naam: "Hoekstra",
        telefoonnummer: "06-10101010",
        geboorte_datum: new Date("1989-06-14"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
      create: {
        voornaam: "David",
        naam: "Hoekstra",
        email: "d.hoekstra@kapsalontrendy.nl",
        telefoonnummer: "06-10101010",
        geboorte_datum: new Date("1989-06-14"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "l.post@kapsalontrendy.nl" },
      update: {
        voornaam: "Laura",
        naam: "Post",
        telefoonnummer: "06-20202020",
        geboorte_datum: new Date("1993-10-28"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
      create: {
        voornaam: "Laura",
        naam: "Post",
        email: "l.post@kapsalontrendy.nl",
        telefoonnummer: "06-20202020",
        geboorte_datum: new Date("1993-10-28"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
    }),
    prisma.werknemer.upsert({
      where: { email: "r.deboer@kapsalontrendy.nl" },
      update: {
        voornaam: "Rick",
        naam: "de Boer",
        telefoonnummer: "06-30303030",
        geboorte_datum: new Date("1991-02-08"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
      create: {
        voornaam: "Rick",
        naam: "de Boer",
        email: "r.deboer@kapsalontrendy.nl",
        telefoonnummer: "06-30303030",
        geboorte_datum: new Date("1991-02-08"),
        bedrijf_id: kapsalon.bedrijf_id,
      },
    }),
  ]);

  // =========================
  // 3) BESCHIKBAARHEDEN
  //    - Maak beschikbaarheden voor alle werknemers
  //    - Standaard werkweek: maandag t/m vrijdag, 09:00 - 17:00
  // =========================

  // Verwijder bestaande beschikbaarheden eerst (optioneel, voor clean seed)
  await prisma.beschikbaarheid.deleteMany({});

  const allWerknemers = [
    ...werknemersSmileCare,
    ...werknemersBrightTeeth,
    ...werknemersHairStudio,
    ...werknemersKapsalon,
  ];

  // Maak beschikbaarheden voor elke werknemer
  for (const werknemer of allWerknemers) {
    // Standaard werkweek: maandag t/m vrijdag, 09:00 - 17:00
    // Gebruik 2026 datums en zorg dat de tijd correct is
    // We gebruiken een referentie datum in 2026 en extraheren alleen de tijd (uren/minuten)
    // De datum zelf is niet belangrijk, alleen de tijd wordt gebruikt voor vergelijking
    const beschikbaarheden = [
      { dag: "maandag", start_tijd: new Date("2026-01-05T09:00:00"), eind_tijd: new Date("2026-01-05T17:00:00") },
      { dag: "dinsdag", start_tijd: new Date("2026-01-06T09:00:00"), eind_tijd: new Date("2026-01-06T17:00:00") },
      { dag: "woensdag", start_tijd: new Date("2026-01-07T09:00:00"), eind_tijd: new Date("2026-01-07T17:00:00") },
      { dag: "donderdag", start_tijd: new Date("2026-01-08T09:00:00"), eind_tijd: new Date("2026-01-08T17:00:00") },
      { dag: "vrijdag", start_tijd: new Date("2026-01-09T09:00:00"), eind_tijd: new Date("2026-01-09T17:00:00") },
    ];

    await prisma.beschikbaarheid.createMany({
      data: beschikbaarheden.map(b => ({
        werknemer_id: werknemer.werknemer_id,
        dag: b.dag,
        start_tijd: b.start_tijd,
        eind_tijd: b.eind_tijd,
      })),
      skipDuplicates: true,
    });
  }

  console.log("✅ Seed klaar:");
  console.log("  - Bedrijven: 4");
  console.log("  - Werknemers: 12");
  console.log("  - Beschikbaarheden: 60 (5 dagen × 12 werknemers)");
  console.log("SmileCare werknemers:", werknemersSmileCare.map(w => w.werknemer_id));
  console.log("BrightTeeth werknemers:", werknemersBrightTeeth.map(w => w.werknemer_id));
  console.log("HairStudio werknemers:", werknemersHairStudio.map(w => w.werknemer_id));
  console.log("Kapsalon werknemers:", werknemersKapsalon.map(w => w.werknemer_id));
}



main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
