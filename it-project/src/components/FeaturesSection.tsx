import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          iconSrc="/images/icons/ai-assistant.png"
          iconAlt="AI Assistent Icon"
          title="AI Assistent"
          description="24/7 beschikbaar voor vragen en directe boekingen. Je AI-assistent werkt altijd, ook buiten kantooruren."
          iconColor="text-orange-500"
          fallbackEmoji="💬"
        />
        <FeatureCard
          iconSrc="/images/icons/lightning.png"
          iconAlt="Real-time Sync Icon"
          title="Real-time Sync"
          description="Vlekkeloze synchronisatie met je agenda. Wijzigingen worden direct doorgevoerd, zonder vertraging."
          iconColor="text-blue-500"
          fallbackEmoji="⚡"
        />
        <FeatureCard
          iconSrc="/images/icons/calendar.png"
          iconAlt="Smart Triage Icon"
          title="Smart Triage"
          description="Routet vragen automatisch en boek direct geschikte tijdsloten. Slimme planning zonder handmatig werk."
          iconColor="text-purple-500"
          fallbackEmoji="📅"
        />
      </div>
    </section>
  );
}

