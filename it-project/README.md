# AI Voice Assistant - Afsprakenplatform

Een Next.js applicatie met AI-gestuurde voice assistant voor het boeken van afspraken.

## Vereisten

- Node.js 18+ 
- npm of yarn
- Een [Vapi](https://vapi.ai) account voor de AI Voice Assistant
- Een [Clerk](https://clerk.com) account voor authenticatie

## Installatie

1. Clone de repository en installeer dependencies:

```bash
npm install
```

2. Installeer de Vapi Web SDK:

```bash
npm install @vapi-ai/web
```

## Environment Variables

Maak een `.env` of `.env.local` bestand aan in de root van het project met de volgende variabelen:

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

### Vapi Configuratie

1. Ga naar [Vapi Dashboard](https://dashboard.vapi.ai)
2. Maak een account aan of log in
3. Ga naar **Assistants** en maak een nieuwe assistant aan
4. Kopieer de **Assistant ID** naar `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
5. Ga naar **Account Settings** → **API Keys**
6. Kopieer je **Public Key** naar `NEXT_PUBLIC_VAPI_API_KEY`

## Aan de slag

Start de development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser om het resultaat te zien.

## Functies

- 🎙️ **AI Voice Assistant** - Klanten kunnen via spraak afspraken boeken
- 📅 **Handmatige Booking** - Alternatieve manier om afspraken te maken
- 🔐 **Authenticatie** - Aparte login voor klanten en bedrijven
- 📊 **Dashboard** - Overzicht van afspraken en statistieken

## Meer Informatie

Voor meer informatie over de gebruikte technologieën:

- [Next.js Documentatie](https://nextjs.org/docs) - leer over Next.js functies en API.
- [Next.js Tutorial](https://nextjs.org/learn) - een interactieve Next.js tutorial.
- [Vapi Documentatie](https://docs.vapi.ai) - leer over Vapi AI voice functies.

## Deployen op Vercel

De makkelijkste manier om je Next.js app te deployen is via het [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) van de makers van Next.js.

Bekijk de [Next.js deployment documentatie](https://nextjs.org/docs/app/building-your-application/deploying) voor meer details.
