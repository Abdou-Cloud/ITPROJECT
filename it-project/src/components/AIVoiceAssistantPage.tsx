"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon } from "@/components/Icon";

type ChecklistItem = { text: string };

function ChecklistRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs">
        ✓
      </span>
      <p className="text-sm text-slate-200">{text}</p>
    </div>
  );
}

function StepItem({
  nr,
  title,
  text,
}: {
  nr: number;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-semibold">
        {nr}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-sm text-slate-300">{text}</p>
      </div>
    </div>
  );
}

function PanelCard({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MiniFeature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function AIVoiceAssistantPage() {
  const checklist = useMemo<ChecklistItem[]>(
    () => [
      { text: "Start een nieuw gesprek via AI" },
      { text: "Laat AI automatisch je afspraken boeken" },
      { text: "Real-time sync met je Google Calendar" },
      { text: "AI powered: YOUR business flow via AI" },
      { text: "Your automated interactions" },
    ],
    []
  );

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Title */}
      <div className="space-y-2">
        <p className="text-sm text-orange-400 flex items-center gap-2">
          <Icon name="zap" className="h-4 w-4" />
          Voice Assistant
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          AI Voice Assistant
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-3xl">
          Laat je AI assistent direct telefonisch afspraken maken - 24/7
          beschikbaar voor je klanten
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="ai">
          <TabsList className="flex w-fit gap-1 rounded-xl bg-slate-900/60 border border-slate-800 p-1">
            <TabsTrigger
              value="ai"
              className="
                flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                data-[state=active]:bg-orange-500
                data-[state=active]:text-white
                data-[state=inactive]:text-slate-300
                data-[state=inactive]:hover:text-white
                transition
              "
            >
              <Icon name="phone" className="h-4 w-4" />
              AI Assistent
            </TabsTrigger>

            <TabsTrigger
              value="manual"
              className="
                flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                data-[state=active]:bg-orange-500
                data-[state=active]:text-white
                data-[state=inactive]:text-slate-300
                data-[state=inactive]:hover:text-white
                transition
              "
            >
              <Icon name="calendar" className="h-4 w-4" />
              Handmatige Booking
            </TabsTrigger>
          </TabsList>

          {/* ===================== AI TAB ===================== */}
          <TabsContent value="ai" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* LEFT big card */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                        <Icon name="phone" className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">
                          AI Voice Assistant
                        </p>
                        <p className="text-xs text-slate-400">
                          Altijd bereikbaar voor je klanten
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Actief
                    </Badge>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-sm font-semibold text-white mb-3">
                      New AI Chat
                    </p>
                    <div className="space-y-3">
                      {checklist.map((c) => (
                        <ChecklistRow key={c.text} text={c.text} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <MiniFeature
                      icon={
                        <Icon
                          name="calendar"
                          className="h-4 w-4 text-slate-200"
                        />
                      }
                      title="Real-time Sync & Scheduling"
                      subtitle="Direct gekoppeld aan je agenda"
                    />
                    <MiniFeature
                      icon={<Icon name="zap" className="h-4 w-4 text-slate-200" />}
                      title="AI powers YOUR workflow"
                      subtitle="Intelligente automatisering"
                    />
                    <MiniFeature
                      icon={
                        <Icon name="shield" className="h-4 w-4 text-slate-200" />
                      }
                      title="Automated Interactions"
                      subtitle="Volledige gespreksafhandeling"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-200">
                        <Icon name="phone" className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Abdennour AI
                        </p>
                        <p className="text-xs text-slate-400">DENTAL ASSISTANT</p>
                        <p className="text-xs text-orange-400">+31 6 1234 5678</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-300">
                        <Icon name="phone" className="h-4 w-4" />
                        <p className="text-sm font-semibold">You</p>
                      </div>
                      <p className="text-[11px] text-slate-500">CALL NOW</p>
                      <Link
                        href="#"
                        className="text-xs text-sky-400 hover:text-sky-300"
                      >
                        Direct bellen
                      </Link>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 rounded-xl">
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="phone" className="h-4 w-4" />
                        Start Call
                      </span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* RIGHT column */}
              <div className="lg:col-span-7 space-y-6">
                <PanelCard
                  title="Hoe werkt het?"
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400">
                      ?
                    </div>
                  }
                >
                  <div className="space-y-5">
                    <StepItem
                      nr={1}
                      title="Bel het nummer"
                      text="Klik op 'Start Call' of bel direct naar het aangegeven nummer."
                    />
                    <StepItem
                      nr={2}
                      title="Spreek met AI"
                      text="Vertel wanneer je een afspraak wil maken - de AI begrijpt je direct."
                    />
                    <StepItem
                      nr={3}
                      title="Bevestiging"
                      text="Je krijgt direct een bevestiging van je afspraak per e-mail."
                    />
                  </div>
                </PanelCard>

                <PanelCard title="Voordelen">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                        <Icon name="clock" className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          24/7 Beschikbaar
                        </p>
                        <p className="text-sm text-slate-300">
                          Maak een afspraak wanneer het jou uitkomt.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                        <Icon name="zap" className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Direct Ingepland
                        </p>
                        <p className="text-sm text-slate-300">
                          Geen wachttijden, direct een afspraak.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-orange-500/15 border border-orange-500/20 flex items-center justify-center">
                        <Icon name="shield" className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          Veilig & Privé
                        </p>
                        <p className="text-sm text-slate-300">
                          Je gegevens zijn volledig beveiligd.
                        </p>
                      </div>
                    </div>
                  </div>
                </PanelCard>

                <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-orange-500/15 via-slate-950/60 to-slate-950/60 p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <Icon name="bell" className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      Tips voor het beste resultaat
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-slate-200">
                    <p>• Spreek duidelijk en rustig</p>
                    <p>• Vermeld je gewenste datum en tijd</p>
                    <p>• Heb je gegevens bij de hand</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ===================== MANUAL TAB ===================== */}
          <TabsContent value="manual" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* LEFT: Calendar + times */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                  <p className="text-sm font-semibold text-white mb-4">
                    Selecteer een datum
                  </p>

                  <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                    <button className="hover:text-white">&lt;</button>
                    <span>December 2024</span>
                    <button className="hover:text-white">&gt;</button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-sm">
                    {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
                      <div key={d} className="text-slate-500 text-xs">
                        {d}
                      </div>
                    ))}

                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      const isActive = day === 4;

                      return (
                        <button
                          key={day}
                          className={`h-10 rounded-lg text-sm transition
                            ${
                              isActive
                                ? "bg-orange-500 text-white"
                                : "bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
                  <p className="text-sm font-semibold text-white mb-4">
                    Kies een tijdslot
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "09:00",
                      "09:30",
                      "10:00",
                      "10:30",
                      "11:00",
                      "11:30",
                      "13:00",
                      "13:30",
                      "14:00",
                      "14:30",
                      "15:00",
                      "15:30",
                      "16:00",
                      "16:30",
                      "17:00",
                    ].map((time) => (
                      <button
                        key={time}
                        className="rounded-lg bg-slate-900/60 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Info cards */}
              <div className="lg:col-span-7 space-y-6">
                <PanelCard
                  title="Hoe werkt het?"
                  icon={
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400">
                      ?
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <StepItem
                      nr={1}
                      title="Selecteer datum & tijd"
                      text="Kies een beschikbare datum en tijdslot uit de kalender."
                    />
                    <StepItem
                      nr={2}
                      title="Bevestig"
                      text="Controleer je gegevens en bevestig de afspraak."
                    />
                  </div>
                </PanelCard>

                <PanelCard title="Voordelen">
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>• 24/7 Beschikbaar</p>
                    <p>• Direct ingepland</p>
                    <p>• Veilig & Privé</p>
                  </div>
                </PanelCard>

                <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-orange-500/15 via-slate-950/60 to-slate-950/60 p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <Icon name="bell" className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      Tips voor het beste resultaat
                    </h3>
                  </div>

                  <div className="space-y-2 text-sm text-slate-200">
                    <p>• Check beschikbaarheid voor meerdere opties</p>
                    <p>• Boek op tijd voor populaire tijdsloten</p>
                    <p>• Controleer je e-mail voor de bevestiging</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
