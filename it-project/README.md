# AI Voice Assistant - Afsprakenplatform

Een moderne Next.js applicatie met AI-gestuurde voice assistant voor het boeken en beheren van afspraken. Het platform ondersteunt zowel bedrijven als klanten met volledige authenticatie, werknemersbeheer, beschikbaarheidsplanning en een intuïtief dashboard.

## Features

### Voor Bedrijven
- **Agenda Beheer** - Volledig overzicht van alle afspraken
- **Werknemersbeheer** - Toevoegen, bewerken en beheren van werknemers
- **Beschikbaarheidsplanning** - Individuele beschikbaarheid per werknemer instellen
- **Dashboard** - Overzicht van statistieken en volgende afspraken
- **Klantenbeheer** - Overzicht van alle klanten en hun gegevens
- **AI Voice Assistant** - 24/7 beschikbare AI assistent voor boekingen

### Voor Klanten
- **Voice Assistant** - Boek afspraken via spraak
- **Agenda** - Bekijk al je afspraken
- **Automatische Herinneringen** - Ontvang notificaties voor afspraken
- **Snelle Booking** - Boek direct en eenvoudig afspraken

### Admin Features
- **Admin Dashboard** - Volledig overzicht van het systeem
- **Statistieken** - Bedrijven, klanten en afspraken overzicht
- **System Status** - Database en systeem health monitoring
- **Bedrijvenbeheer** - Beheer alle bedrijven in het systeem

## Tech Stack

- **Framework**: Next.js 15.5.0 (App Router)
- **Database**: PostgreSQL met Prisma ORM
- **Authenticatie**: Clerk
- **Voice AI**: Vapi AI
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## Vereisten

- Node.js 18+ 
- npm of yarn
- PostgreSQL database (bijv. Neon, Supabase, of lokaal)
- Een [Clerk](https://clerk.com) account voor authenticatie
- Een [Vapi](https://vapi.ai) account voor de AI Voice Assistant
- [ngrok](https://ngrok.com) voor tunneling (gratis account)

## Installatie

1. **Clone de repository:**
```bash
git clone <repository-url>
cd it-project
```

2. **Installeer dependencies:**
```bash
npm install
```

3. **Installeer ngrok:**
```bash
# Via npm (global)
npm install -g ngrok

# Of download van https://ngrok.com/download
```

4. **Setup Prisma:**
```bash
npx prisma generate
npx prisma db push
```

5. **Maak een `.env.local` bestand:**
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL="postgresql://..."

# Vapi AI Voice Assistant
NEXT_PUBLIC_VAPI_API_KEY=jouw_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=jouw_vapi_assistant_id
```

## Configuratie

### Clerk Setup

1. Maak een account op [Clerk](https://clerk.com)
2. Maak een nieuwe applicatie aan
3. Kopieer de **Publishable Key** naar `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
4. Kopieer de **Secret Key** naar `CLERK_SECRET_KEY`
5. Na het starten van ngrok, configureer de redirect URLs in Clerk Dashboard met je ngrok URL:
   - `https://jouw-ngrok-url.ngrok-free.app/auth-callback`
   - `https://jouw-ngrok-url.ngrok-free.app/*`

### Vapi AI Setup

1. Ga naar [Vapi Dashboard](https://dashboard.vapi.ai)
2. Maak een account aan of log in
3. Ga naar **Assistants** en maak een nieuwe assistant aan
4. Kopieer de **Assistant ID** naar `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
5. Ga naar **Account Settings** → **API Keys**
6. Kopieer je **Public Key** naar `NEXT_PUBLIC_VAPI_API_KEY`

### Database Setup

1. Maak een PostgreSQL database aan (bijv. via [Neon](https://neon.tech) of [Supabase](https://supabase.com))
2. Kopieer de connection string naar `DATABASE_URL`
3. Run database migrations:
```bash
npx prisma db push
npx prisma generate
```

## Aan de slag

1. **Start de development server:**
```bash
npm run dev
```

2. **Start ngrok in een nieuwe terminal:**
```bash
ngrok http 3000
```

3. **Kopieer de ngrok HTTPS URL:**
   - ngrok geeft je een URL zoals: `https://abc123.ngrok-free.app`
   - Deze URL is toegankelijk vanaf het internet

4. **Update Clerk Redirect URLs:**
   - Ga naar je Clerk Dashboard → Settings → Redirect URLs
   - Voeg toe: `https://jouw-ngrok-url.ngrok-free.app/auth-callback`
   - Voeg ook toe: `https://jouw-ngrok-url.ngrok-free.app/*`

5. **Open de ngrok URL in je browser**

## Deployment met ngrok

ngrok maakt je lokale server toegankelijk via het internet. Dit is ideaal voor development, testing en demo's.

### Stappen:

1. **Start de Next.js development server:**
```bash
npm run dev
```

2. **Start ngrok in een nieuwe terminal:**
```bash
ngrok http 3000
```

3. **Kopieer de ngrok HTTPS URL:**
   - ngrok geeft je een URL zoals: `https://abc123.ngrok-free.app`
   - Deze URL is toegankelijk vanaf het internet

4. **Update Clerk Redirect URLs:**
   - Ga naar je Clerk Dashboard → Settings → Redirect URLs
   - Voeg toe: `https://jouw-ngrok-url.ngrok-free.app/auth-callback`
   - Voeg ook toe: `https://jouw-ngrok-url.ngrok-free.app/*`

5. **Optioneel: ngrok met custom domain (voor paid plan):**
```bash
ngrok http 3000 --domain=jouw-custom-domain.ngrok-free.app
```

### Belangrijke Notities:

- **Gratis ngrok**: De URL verandert elke keer dat je ngrok herstart (tenzij je een paid plan hebt)
- **Tunnel blijft actief**: Zorg dat ngrok blijft draaien zolang je de app gebruikt
- **Security**: ngrok toont een waarschuwingspagina voor gratis accounts (kan uitgezet worden in ngrok dashboard)
- **Performance**: ngrok voegt minimale latency toe

## Projectstructuur

```
it-project/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── assistant/      # AI Voice Assistant pagina
│   │   ├── business/       # Business dashboard
│   │   ├── login/          # Login pagina's
│   │   └── signup/         # Signup pagina's
│   ├── components/         # React components
│   │   ├── admin/          # Admin specifieke components
│   │   ├── ui/             # UI component library
│   │   └── ...             # Andere components
│   ├── lib/                # Utility functies
│   │   ├── prisma.ts       # Prisma client
│   │   ├── bedrijf-sync.ts # Bedrijf synchronisatie
│   │   └── ...             # Andere utilities
│   └── hooks/              # Custom React hooks
└── public/                 # Static assets
```

## Authenticatie Flow

Het platform ondersteunt twee typen gebruikers:

1. **Business** - Bedrijven kunnen:
   - Werknemers toevoegen en beheren
   - Beschikbaarheden instellen
   - Afspraken beheren
   - Klanten bekijken

2. **Client** - Klanten kunnen:
   - Afspraken boeken via voice assistant
   - Hun agenda bekijken
   - Herinneringen ontvangen

De authenticatie wordt afgehandeld door Clerk, met automatische synchronisatie naar de lokale database.

## Database Schema

De applicatie gebruikt de volgende hoofdmodellen:

- **Bedrijf** - Bedrijven in het systeem
- **Werknemer** - Werknemers van bedrijven
- **Klant** - Klanten die afspraken kunnen boeken
- **Admin** - Administrators van het systeem
- **Afspraak** - Gemaakte afspraken
- **Beschikbaarheid** - Beschikbaarheid per werknemer per dag

Voor het volledige schema, zie `prisma/schema.prisma`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build voor productie
- `npm run start` - Start productie server
- `npm run lint` - Run linter (Biome)
- `npm run format` - Format code (Biome)

## Development

### Database Migraties

```bash
# Maak een nieuwe migratie
npx prisma migrate dev --name migration_name

# Push schema changes zonder migratie
npx prisma db push

# Genereer Prisma Client
npx prisma generate
```

### Code Quality

Het project gebruikt Biome voor linting en formatting:

```bash
# Check voor issues
npm run lint

# Format code
npm run format
```

## Documentatie

Voor meer informatie over de gebruikte technologieën:

- [Next.js Documentatie](https://nextjs.org/docs)
- [Prisma Documentatie](https://www.prisma.io/docs)
- [Clerk Documentatie](https://clerk.com/docs)
- [Vapi Documentatie](https://docs.vapi.ai)
- [ngrok Documentatie](https://ngrok.com/docs)
- [Tailwind CSS Documentatie](https://tailwindcss.com/docs)
- [shadcn/ui Documentatie](https://ui.shadcn.com)



## License

Dit project is private.

## Author

Ontwikkeld als IT Project.

---

**Note**: Zorg ervoor dat alle environment variables correct zijn ingesteld voordat je de applicatie start. Zonder de juiste configuratie zal de applicatie niet correct werken.