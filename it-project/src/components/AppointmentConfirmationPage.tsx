"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";

function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-sm">
      {title ? (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      ) : null}
      {children}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-semibold text-white">{title}</h2>
    </div>
  );
}

function Bullet({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/60 border border-slate-800">
        {icon}
      </div>
      <p className="text-sm text-slate-200">{text}</p>
    </div>
  );
}

function EmailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200/10 bg-white/95 px-4 py-3">
      <div>
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="text-sm text-slate-900">{value}</p>
      </div>
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500">
        <span className="text-xs">i</span>
      </div>
    </div>
  );
}

function Modal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[min(720px,92vw)] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-300">Demo modal</p>
              <h3 className="mt-1 text-lg font-semibold text-white">
                Voorbeeld bevestigingsmodal
              </h3>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              type="button"
            >
              Sluiten
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>
              Dit is een tijdelijke demo-modal. Later kan je hier echte afspraakdata tonen
              (naam klant, datum, uur, werknemer, locatie, enz.).
            </p>
            <p>
              Voor nu is het doel dat de UI klopt met het prototype.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              onClick={onClose}
            >
              Ok
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentConfirmationPage() {
  const [openModal, setOpenModal] = useState(false);

  const features = useMemo(
    () => [
      "Duidere tekst en sterke accenten",
      "Link/knop naar vervolgactie",
      "Visuele bevestiging met iconen",
      "CTA naar afspraken overzicht",
      "Responsive design",
    ],
    []
  );

  const templateFeatures = useMemo(
    () => [
      "Clean UI design voor email",
      "Branded header met logo",
      "Checklist voor de klant",
      "Gestructureerde informatie",
      "Call-to-action button",
      "E-mailvriendelijke styling",
    ],
    []
  );

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          Appointment Confirmation Components
        </h1>
        <p className="text-sm text-slate-300">
          Demo van bevestigingsmodal en email template.
        </p>
      </div>

      {/* Top grid (2 kaarten) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Card>
            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                Een donkerder modal voor directe bevestiging na het boeken van een afspraak
              </p>

              <div className="pt-3">
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  onClick={() => setOpenModal(true)}
                >
                  Open Modal
                </Button>
              </div>
            </div>

            <div className="mt-6">
              <SectionTitle title="Features:" />
              <div className="space-y-3">
                {features.map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs">
                      ✓
                    </span>
                    <p className="text-sm text-slate-200">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card>
            <p className="text-sm text-slate-300">
              Een professionele email template voor bevestigingsmails
            </p>

            <div className="mt-6">
              <SectionTitle title="Features:" />
              <div className="space-y-3">
                {templateFeatures.map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 text-xs">
                      ✓
                    </span>
                    <p className="text-sm text-slate-200">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Email preview */}
      <div className="mt-8">
        <div className="mb-3 text-center">
          <h2 className="text-base font-semibold text-white">Email Preview</h2>
        </div>

        <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-sm">
          {/* Orange top bar */}
          <div className="flex items-center gap-2 bg-orange-500 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
              <Icon name="calendar" className="h-4 w-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-white">DentWise</p>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Appointment Confirmed!
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Hi there,
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Your dental appointment has been successfully scheduled with the details:
            </p>

            <div className="mt-5 space-y-3">
              <EmailRow label="Practitioner" value="Dr. John Smith" />
              <EmailRow label="Service" value="Teeth Cleaning" />
              <EmailRow label="Date" value="Wednesday, September 24, 2025" />
              <EmailRow label="Time" value="08:00" />
              <EmailRow label="Duration" value="45 min" />
              <EmailRow label="Cost" value="$80" />
              <EmailRow label="Location" value="Dental Center" />
            </div>

            <p className="mt-5 text-sm text-slate-600">
              Please arrive 15 minutes early for your appointment. If you need to reschedule or cancel,
              please contact us at least 24 hours in advance.
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                View My Appointments
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-600">
              Best regards,
              <br />
              The DentWise Team
            </p>

            <p className="mt-6 text-xs text-slate-500">
              If you have any questions, please feel free to contact us at support@dentwise.com
            </p>
          </div>
        </div>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} />
    </section>
  );
}
