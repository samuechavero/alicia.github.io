import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Heart, Menu, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteData, legalCopy } from './config/siteData';
import aliciaImg from './assets/alicia.jpg';

type LegalKey = keyof typeof legalCopy;

function whatsappUrl(message = siteData.defaultHeroMessage) {
  return `https://wa.me/${siteData.phone}?text=${encodeURIComponent(message)}`;
}

function handleWhatsAppClick(location: string, customMessage?: string) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>>; fbq?: (...args: unknown[]) => void };
  w.dataLayer?.push({ event: 'whatsapp_contact', cta_location: location });
  w.fbq?.('track', 'Contact', { content_name: location });
  window.open(whatsappUrl(customMessage), '_blank', 'noopener,noreferrer');
}

function ContactLink({
  id,
  location,
  children,
  className,
  message,
  ariaLabel,
}: {
  id: string;
  location: string;
  children: ReactNode;
  className: string;
  message?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      id={id}
      data-testid={id}
      data-cta-location={location}
      aria-label={ariaLabel}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        handleWhatsAppClick(location, message);
      }}
    >
      {children}
    </a>
  );
}

function LegalDialog({ kind, close }: { kind: LegalKey | null; close: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!kind) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [kind, close]);

  if (!kind) return null;
  const content = legalCopy[kind];

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        className="w-full max-w-xl rounded-2xl border border-[#716147]/50 bg-[#211a2e] p-7 shadow-2xl sm:p-9 max-h-[90vh] overflow-y-auto"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">{siteData.name}</span>
            <h2 id="legal-title" className="mt-2 font-serif text-3xl text-[#f1e7d1]">
              {content.title}
            </h2>
          </div>
          <button
            data-testid="button-close-legal-dialog"
            ref={closeRef}
            onClick={close}
            aria-label="Cerrar ventana"
            className="rounded-full p-2 text-[#c9bdd4] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6bb78]"
          >
            <X size={20} />
          </button>
        </div>
        <p className="leading-7 text-[#c9bfd0] whitespace-pre-line text-sm sm:text-base">
          {content.body}
        </p>
        <button
          onClick={close}
          className="mt-8 rounded-full border border-[#b9a16b]/50 px-6 py-2.5 text-sm text-[#ead8a8] transition hover:bg-[#b9a16b]/10"
        >
          Entendido
        </button>
      </section>
    </div>
  );
}

function App() {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [legal, setLegal] = useState<LegalKey | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeLegal = () => setLegal(null);

  const navLinks = [
    ['Tu lectura', '#lectura'],
    ['Consultas', '#servicios'],
    ['Sobre mí', '#sobre-mi'],
    ['Preguntas', '#preguntas'],
  ];

  const selectedCard = selectedCardIndex !== null ? siteData.cards[selectedCardIndex] : null;
  const cardMessage = selectedCard
    ? `Hola Alicia, elegí la carta ${selectedCard.name} en tu página y quisiera hacer mi lectura gratis.`
    : siteData.defaultHeroMessage;

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#09060C] text-[#E6E1EC]">
      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-40 border-b border-white/[.08] bg-[#09060C]/90 backdrop-blur-md">
        <div className="border-b border-white/[.06] bg-[#09060C]/95">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center text-[10px] tracking-wide text-[#E6E1EC]/80 sm:px-8 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48] animate-pulse" aria-hidden="true" />
            Lectura de tarot gratis · atención online directa por WhatsApp
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Alicia Rosales Tarot, inicio">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#E11D48]/40 bg-[#1C0E2B] text-[#FF6B8B] shadow-[0_0_15px_rgba(225,29,72,0.25)]">
              <Sparkles size={18} />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-[15px] tracking-wide text-white">
                {siteData.brandTitle}
              </span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[.22em] text-[#C4A1FF]">
                {siteData.brandSubtitle}
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[13px] tracking-wide text-[#E6E1EC] transition hover:text-white"
              >
                {label}
              </a>
            ))}
            <ContactLink
              id="cta-header-whatsapp"
              location="header"
              message={siteData.defaultHeroMessage}
              className="rounded-full border border-[#E11D48]/70 bg-[#E11D48]/10 px-5 py-2 text-[12px] font-semibold tracking-wide text-white transition hover:bg-[#E11D48]/25 hover:border-[#E11D48]"
            >
              Lectura Gratis
            </ContactLink>
          </nav>
          <button
            data-testid="button-mobile-menu"
            aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
            className="p-2 text-white md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenu && (
          <nav className="border-t border-white/10 bg-[#120A16] px-5 py-4 md:hidden">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                onClick={() => setMobileMenu(false)}
                href={href}
                className="block border-b border-white/[.06] py-3 text-sm text-[#E6E1EC] hover:text-white"
              >
                {label}
              </a>
            ))}
            <div className="pt-4">
              <ContactLink
                id="cta-mobile-menu-whatsapp"
                location="mobile-menu"
                message={siteData.defaultHeroMessage}
                className="inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] text-xs font-semibold leading-none text-[#102017] transition hover:bg-[#1EBE5D]"
              >
                <MessageCircle size={16} className="shrink-0 block align-middle" />
                <span className="leading-none">Lectura Gratis</span>
              </ContactLink>
            </div>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="inicio" className="starfield relative flex min-h-[760px] items-center pt-28 sm:min-h-[820px] sm:pt-24 bg-[#09060C]">
        <div className="pointer-events-none absolute -right-20 top-24 h-[570px] w-[570px] rounded-full bg-[radial-gradient(circle,rgba(225,29,72,.15),transparent_66%)]" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-8 lg:pb-24">
          <div className="fade-up relative z-10 max-w-[660px]">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#E11D48]/40 bg-[#1C0E2B]/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.18em] text-[#FF6B8B] backdrop-blur-sm shadow-[0_0_20px_rgba(225,29,72,0.15)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E11D48] animate-pulse" />
              Lectura de tarot gratis · atención online
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,5.5vw,4.4rem)] leading-[1.08] tracking-[-.035em] text-white">
              ¿Se separaron, se alejó o sentís que{' '}
              <em className="text-[#E11D48] not-italic drop-shadow-[0_0_25px_rgba(225,29,72,0.45)]">
                estás perdiendo a esa persona?
              </em>
            </h1>
            <p className="mt-6 max-w-[580px] text-[15px] leading-7 text-[#E6E1EC] sm:text-base">
              No importa si hoy hay distancia, silencio, bloqueo o discusiones constantes: no tenés que pasar por esto en soledad. Soy Alicia Rosales, tarotista experta en Magia Blanca y Roja. Descubrí hoy qué está pasando y cómo resolver tu situación con una <strong className="font-semibold text-white">lectura de tarot 100% gratis por WhatsApp</strong>.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ContactLink
                id="cta-hero-whatsapp"
                location="hero"
                message={siteData.defaultHeroMessage}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-sm font-semibold uppercase tracking-wider text-[#102017] leading-none shadow-[0_8px_30px_rgba(37,211,102,.3)] transition hover:bg-[#1EBE5D] hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366]"
              >
                <MessageCircle size={18} className="shrink-0 block align-middle" />
                <span className="leading-none">QUIERO MI LECTURA DE TAROT GRATIS</span>
              </ContactLink>
              <a
                href="#lectura"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium leading-none text-white transition hover:bg-white/10 hover:border-white/40"
              >
                <Sparkles size={16} className="shrink-0 block align-middle text-[#C4A1FF]" />
                <span className="leading-none">Elegir una carta</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5 text-xs text-[#E6E1EC] sm:gap-6">
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#25D366]" /> Discreción y reserva absoluta
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#25D366]" /> Respuesta directa por WhatsApp
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#25D366]" /> Atención personalizada por Alicia
              </span>
            </div>
          </div>

          {/* HERO PORTRAIT */}
          <div className="relative mx-auto flex h-[390px] w-full max-w-[500px] items-center justify-center sm:h-[490px]">
            <div className="absolute h-[310px] w-[310px] rounded-full border border-[#E11D48]/25 sm:h-[390px] sm:w-[390px]" />
            <div className="absolute h-[268px] w-[268px] rounded-full border border-dashed border-[#A855F7]/30 sm:h-[340px] sm:w-[340px]" />
            <div className="portrait-orbit absolute h-[290px] w-[290px] rounded-full sm:h-[360px] sm:w-[360px]">
              <div className="absolute inset-[19px] overflow-hidden rounded-full border-2 border-[#E11D48]/70 shadow-[0_0_45px_rgba(225,29,72,0.3)] bg-[#120A16]">
                <img
                  src={aliciaImg}
                  alt="Alicia Rosales - Tarotista"
                  className="h-full w-full object-cover object-[center_20%] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09060C]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#E11D48]/50 bg-[#120A16]/90 px-3.5 py-1 text-center text-xs tracking-wider text-white shadow-md backdrop-blur-sm whitespace-nowrap">
                  ✧ Alicia Rosales ✧
                </div>
              </div>
            </div>

            <span className="absolute left-[7%] top-[23%] text-xl text-[#FF6B8B]">✧</span>
            <span className="absolute right-[11%] top-[30%] text-sm text-[#C4A1FF]">✦</span>
            <span className="absolute bottom-[20%] left-[14%] text-sm text-[#C4A1FF]">✦</span>
            <span className="absolute bottom-[23%] right-[7%] text-xl text-[#FF6B8B]">✧</span>

            <div className="absolute top-4 left-0 rounded-xl border border-white/10 bg-[#120A16]/90 px-4 py-2.5 shadow-xl sm:top-8 sm:left-2 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6B8B]">Magia Blanca y Roja</p>
              <p className="mt-0.5 text-[10px] text-[#E6E1EC]">Respuestas y soluciones reales</p>
            </div>

            <div className="absolute bottom-3 right-0 rounded-xl border border-white/10 bg-[#120A16]/90 px-4 py-2.5 shadow-xl sm:bottom-8 sm:right-2 backdrop-blur-sm">
              <p className="font-serif text-sm text-white">Córdoba, Argentina</p>
              <p className="mt-0.5 text-[10px] tracking-wide text-[#E6E1EC]/80">Atención online directa</p>
            </div>
          </div>
        </div>
        <a
          href="#lectura"
          aria-label="Ir a tu lectura de cartas"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[#9d91a8] transition hover:text-[#d4bf83] md:block"
        >
          <ArrowDown size={18} />
        </a>
      </section>

      {/* SECTION: TU LECTURA (TIRADA INTERACTIVA) */}
      <section id="lectura" className="starfield border-y border-white/[.08] bg-[#120A16] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Tu primer mensaje</span>
            <h2 className="section-title mt-4">
              Concentrate en esa persona <em>y elegí una carta.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#E6E1EC]">
              Dejá que tu intuición elija una de estas tres cartas para recibir un mensaje simbólico inicial.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {siteData.cards.map((card, index) => {
              const isSelected = selectedCardIndex === index;
              return (
                <button
                  key={card.id}
                  type="button"
                  data-testid={`card-tarot-${card.id}`}
                  onClick={() => setSelectedCardIndex(isSelected ? null : index)}
                  className={`group relative flex min-h-[310px] flex-col justify-between rounded-2xl border p-6 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E11D48] ${
                    isSelected
                      ? 'border-[#E11D48] bg-[#1C0E2B] shadow-[0_0_35px_rgba(225,29,72,.25)]'
                      : 'border-[#3D1A45]/70 bg-[#09060C] hover:-translate-y-1 hover:border-[#E11D48]/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#FF6B8B]">
                      {card.numeral}
                    </span>
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full border text-xs transition ${
                        isSelected
                          ? 'border-[#E11D48] bg-[#E11D48] text-white'
                          : 'border-white/20 text-[#E6E1EC] group-hover:border-[#E11D48]'
                      }`}
                    >
                      {isSelected ? <Check size={14} /> : card.icon}
                    </span>
                  </div>

                  <div className="my-auto py-4">
                    <span className="text-xs uppercase tracking-wider text-[#C4A1FF]">
                      {card.label}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">
                      {card.shortName}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-[#E6E1EC]/90">
                      {card.text}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-[#E6E1EC]/80">
                    <span>{isSelected ? '✓ Carta elegida' : card.hint}</span>
                    <span className="text-[#FF6B8B]">{isSelected ? 'Tocá para cerrar' : '→'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-xs text-[#E6E1EC]/70">
              Las cartas ofrecen una primera orientación para reflexionar sobre tu situación emocional.
            </p>

            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 rounded-2xl border border-[#E11D48]/50 bg-[#1C0E2B] p-6 shadow-xl"
                >
                  <p className="text-xs uppercase tracking-widest text-[#FF6B8B]">
                    Carta seleccionada: {selectedCard.name}
                  </p>
                  <p className="mt-2 font-serif text-lg text-white">
                    ¿Querés profundizar en lo que significa exactamente para tu caso?
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <ContactLink
                      id="cta-spread-whatsapp"
                      location="lectura-cartas"
                      message={cardMessage}
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#25D366] text-xs font-semibold leading-none text-[#102017] transition hover:bg-[#1EBE5D] shadow-md"
                    >
                      <MessageCircle size={16} className="shrink-0 block align-middle" />
                      <span className="leading-none">Conversar sobre esta carta por WhatsApp</span>
                      <ArrowRight size={14} className="shrink-0 block align-middle" />
                    </ContactLink>
                    <button
                      type="button"
                      onClick={() => setSelectedCardIndex(null)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-xs leading-none text-[#E6E1EC] transition hover:border-[#E11D48] hover:text-white"
                    >
                      <RotateCcw size={13} className="shrink-0 block align-middle" />
                      <span className="leading-none">Elegir otra carta</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* SECTION: VÍNCULOS Y EMOCIONES */}
      <section id="vinculos" className="py-20 sm:py-24 bg-[#09060C]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Vínculos y emociones</span>
            <h2 className="section-title mt-4">
              ¿Te reconocés en alguna <em>de estas situaciones?</em>
            </h2>
            <p className="mt-5 text-base leading-7 text-[#E6E1EC]">
              No tenés que seguir cargando con esta incertidumbre ni esperar a que la situación empeore.
            </p>
            <div className="mt-4">
              <a
                href="#servicios"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B8B] hover:text-white hover:underline transition"
              >
                Ver tipos de consulta <ArrowDown size={13} />
              </a>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-4xl mx-auto">
            {siteData.situations.map((item, index) => (
              <div
                key={index}
                data-testid={`card-situation-${index + 1}`}
                className="flex items-start gap-4 rounded-xl border border-[#3D1A45]/60 bg-[#120A16] p-5 transition hover:border-[#E11D48]/50 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#E11D48]/40 text-[#FF4D6D] bg-[#1C0E2B]"
                >
                  <Check size={14} />
                </span>
                <p className="text-sm leading-6 text-[#E6E1EC]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ContactLink
              id="cta-vinculos-whatsapp"
              location="vinculos-emociones"
              message={siteData.vinculosMessage}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] text-xs font-semibold uppercase tracking-wider leading-none text-[#102017] transition hover:bg-[#1EBE5D] shadow-[0_8px_25px_rgba(37,211,102,.25)]"
            >
              <MessageCircle size={16} className="shrink-0 block align-middle" />
              <span className="leading-none">Contame tu situación por WhatsApp</span>
              <ArrowRight size={15} className="shrink-0 block align-middle" />
            </ContactLink>
          </div>
        </div>
      </section>

      {/* SECTION: SERVICIOS / CONSULTAS */}
      <section id="servicios" className="bg-[#120A16] py-24 sm:py-28 border-y border-white/[.08]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Acompañamiento personalizado</span>
              <h2 className="section-title mt-4">
                Magia Blanca y Magia Roja{' '}
                <em>enfocadas en resultados y soluciones reales para tu relación</em>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#E6E1EC]">
              Primero analizamos tu caso en una lectura de tarot 100% gratuita. Luego definimos el camino exacto para recuperar la armonía, el amor y la cercanía con esa persona.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siteData.services.map((service, i) => (
              <article
                key={service.id}
                data-testid={`card-service-${service.id}`}
                className={`relative flex flex-col h-full overflow-hidden rounded-2xl border p-7 sm:p-8 transition duration-300 hover:-translate-y-1 ${
                  i === 0
                    ? 'border-[#E11D48]/80 bg-[#1C0E2B] shadow-[0_10px_35px_rgba(225,29,72,.18)] hover:border-[#E11D48]'
                    : 'border-[#3D1A45]/60 bg-[#09060C] hover:border-[#E11D48]/70 hover:shadow-[0_8px_30px_rgba(225,29,72,.12)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-4xl text-[#E11D48] drop-shadow-[0_0_12px_rgba(225,29,72,0.35)]">0{i + 1}</span>
                  {service.badge && (
                    <span className="rounded-full border border-[#E11D48]/50 bg-[#E11D48]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.17em] text-[#FF6B8B]">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-serif text-2xl text-white leading-snug">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#E6E1EC]">
                  {service.description}
                </p>

                {/* Bloque inferior agrupado con mt-auto para alinear todos los botones a la misma altura */}
                <div className="mt-auto pt-5 flex flex-col gap-4">
                  <p className="border-t border-white/10 pt-3 text-[11px] font-medium text-[#C4A1FF]">
                    {service.detail}
                  </p>

                  <ContactLink
                    id={`cta-service-${service.id}-whatsapp`}
                    location={`servicio-${service.id}`}
                    message={service.message}
                    className="inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] text-xs font-semibold leading-none text-[#102017] transition hover:bg-[#1EBE5D] shadow-sm"
                  >
                    <MessageCircle size={16} className="shrink-0 block align-middle" />
                    <span className="leading-none">Consultar por este caso</span>
                    <ArrowRight size={14} className="shrink-0 block align-middle" />
                  </ContactLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: SOBRE MÍ */}
      <section id="sobre-mi" className="relative py-24 sm:py-32 bg-[#09060C]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[.85fr_1.15fr]">
          <div className="relative mx-auto h-[390px] w-full max-w-[420px] overflow-hidden rounded-[48%_48%_24px_24px] border-2 border-[#E11D48]/40 shadow-[0_16px_50px_rgba(0,0,0,0.6)] bg-[#120A16] sm:h-[450px]">
            <img
              src={aliciaImg}
              alt="Alicia Rosales en sesión de lectura de tarot"
              className="h-full w-full object-cover object-[center_30%] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09060C]/90 via-[#09060C]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 rounded-full border border-[#E11D48]/40 bg-[#120A16]/90 px-4 py-2 text-[10px] uppercase tracking-[.2em] text-[#FF859B] backdrop-blur-sm shadow-md">
              Dedicación y reserva absoluta
            </div>
          </div>

          <div className="max-w-xl">
            <span className="eyebrow">Sobre mí</span>
            <h2 className="section-title mt-4">
              Hola, soy <em>Alicia Rosales.</em>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-[#E6E1EC]">
              <p>
                Soy oriunda de Santiago del Estero y desarrollo mi labor espiritual desde Córdoba. Cuento con años de experiencia acompañando a personas que atraviesan momentos críticos en el amor mediante el tarot y prácticas de Magia Blanca y Roja de alta efectividad.
              </p>
              <p className="leading-7 text-[#E6E1EC]/90">
                Mi compromiso es brindarte respuestas concretas y soluciones reales para tu relación. Por eso, antes de proponerte cualquier trabajo, analizamos a fondo tu caso en una primera lectura de tarot totalmente gratuita y confidencial por WhatsApp.
              </p>
              <p className="leading-7 text-[#E6E1EC]/90">
                Atiendo online para toda Argentina y el exterior con total reserva y dedicación exclusiva. Si sentís que no podés más con esta situación, escribime y comencemos a resolverla hoy mismo.
              </p>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="font-serif italic text-2xl text-[#FF6B8B]">Alicia</span>
              <a
                href={siteData.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#E6E1EC] transition hover:text-[#FF6B8B]"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full border border-white/20 text-[10px]">ig</span>
                {siteData.socialHandle}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Atención directa', 'Sin intermediarios', 'Trato 100% confidencial', 'Argentina y exterior'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#E11D48]/30 bg-[#1C0E2B] px-3.5 py-1.5 text-[11px] tracking-wide text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EL PROCESO */}
      <section className="border-y border-white/[.08] bg-[#1C0E2B] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Paso a paso</span>
            <h2 className="section-title mt-4">
              Así empieza <em>la solución a tu caso.</em>
            </h2>
            <p className="mt-4 text-base leading-7 text-[#E6E1EC]">
              Un camino claro, directo y transparente para recuperar tu paz emocional y la cercanía de esa persona.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {siteData.steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#3D1A45]/70 bg-[#09060C] p-7 transition hover:border-[#E11D48]/60 shadow-sm"
              >
                <span className="font-serif text-4xl text-[#E11D48] drop-shadow-[0_0_12px_rgba(225,29,72,0.35)]">{step.number}</span>
                <h3 className="mt-4 font-serif text-xl text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#E6E1EC]">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ContactLink
              id="cta-process-whatsapp"
              location="proceso"
              message={siteData.processMessage}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] text-xs font-semibold uppercase tracking-wider leading-none text-[#102017] transition hover:bg-[#1EBE5D] shadow-[0_8px_25px_rgba(37,211,102,.25)]"
            >
              <MessageCircle size={15} className="shrink-0 block align-middle" />
              <span className="leading-none">Iniciar mi consulta gratis por WhatsApp</span>
              <ArrowRight size={14} className="shrink-0 block align-middle" />
            </ContactLink>
          </div>
        </div>
      </section>

      {/* SECTION: CON TRANSPARENCIA */}
      <section className="py-20 sm:py-24 border-b border-white/[.08] bg-[#09060C]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Compromiso y confianza</span>
            <h2 className="section-title mt-4">
              Atención directa, <em>humana y confidencial.</em>
            </h2>
          </div>
          <div>
            <div className="flex gap-5">
              <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#E11D48]/40 text-[#FF6B8B] bg-[#1C0E2B]">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h3 className="font-serif text-xl text-white">Trato directo sin intermediarios</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#E6E1EC]">
                  Cada caso es tratado de forma personal, única y confidencial. Desde el primer momento en que enviás tu mensaje de WhatsApp hablás directamente conmigo, Alicia Rosales, garantizando total privacidad y dedicación a tu situación.
                </p>
              </div>
            </div>
            <div className="mt-7 border-t border-white/10 pt-6 text-xs leading-6 text-[#E6E1EC]/70">
              Reserva y secreto profesional garantizados en cada consulta. Tu tranquilidad y privacidad son prioridad.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PREGUNTAS FRECUENTES */}
      <section id="preguntas" className="py-24 sm:py-28 bg-[#120A16]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-[.75fr_1.25fr]">
          <div>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="section-title mt-4">
              Respuestas claras <em>a tus dudas.</em>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#E6E1EC]">
              Si te queda alguna duda sobre cómo trabajamos, podés consultarme directamente por WhatsApp sin compromiso.
            </p>
            <ContactLink
              id="cta-faq-whatsapp"
              location="preguntas"
              message={siteData.defaultHeroMessage}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#FF6B8B] hover:text-white transition"
            >
              Hacer una consulta directa por WhatsApp <ArrowRight size={14} />
            </ContactLink>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {siteData.faqs.map((faq, i) => (
              <article key={faq.q} className="py-1">
                <button
                  data-testid={`button-faq-${i + 1}`}
                  type="button"
                  id={`faq-button-${i}`}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-lg text-white hover:text-[#FF6B8B] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E11D48]"
                >
                  {faq.q}
                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#E11D48] transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#E6E1EC]"
                  >
                    {faq.a}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: CTA FINAL */}
      <section className="relative overflow-hidden border-y border-[#E11D48]/30 bg-gradient-to-b from-[#1C0E2B] via-[#120A16] to-[#09060C] py-20 sm:py-24">
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <div className="absolute -left-24 top-[-150px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(225,29,72,.2),transparent_70%)]" />
          <div className="absolute -right-24 bottom-[-200px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,.18),transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="eyebrow">Comenzá hoy mismo</span>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-white sm:text-5xl">
            Tu camino hacia la solución <em>empieza con un mensaje.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base leading-7 text-[#E6E1EC]">
            No sigas postergando tu tranquilidad ni dejes que el tiempo desgaste más el vínculo. Hablá directamente conmigo por WhatsApp: tu primera lectura de tarot es 100% gratuita y sin ningún compromiso.
          </p>

          <div className="mt-8">
            <ContactLink
              id="cta-final-whatsapp"
              location="final"
              message={siteData.defaultHeroMessage}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-sm font-semibold uppercase tracking-wider leading-none text-[#102017] shadow-[0_8px_30px_rgba(37,211,102,.35)] transition hover:bg-[#1EBE5D] hover:scale-[1.02]"
            >
              <MessageCircle size={18} className="shrink-0 block align-middle" />
              <span className="leading-none">HABLAR CON ALICIA AHORA · LECTURA GRATIS</span>
              <ArrowRight size={16} className="shrink-0 block align-middle" />
            </ContactLink>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#E6E1EC]/70">
            <a
              href={whatsappUrl(siteData.defaultHeroMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              WhatsApp: <span className="text-[#FF6B8B] font-semibold">{siteData.phoneFormatted}</span>
            </a>
            <span>·</span>
            <span>Atención online directa desde Córdoba, Argentina · Argentina y exterior</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#060408] pb-24 pt-14 sm:pb-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 md:flex-row md:items-center">
            <div>
              <a href="#inicio" className="font-serif text-xl text-white">
                {siteData.brandTitle}
              </a>
              <span className="ml-2 text-xs text-[#C4A1FF]">
                · {siteData.brandSubtitle}
              </span>
              <p className="mt-2 text-xs text-[#E6E1EC]/70 max-w-md">
                Un espacio de orientación y soluciones a través del tarot y rituales de Magia Blanca y Roja. Primera lectura de tarot gratuita y confidencial por WhatsApp.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#E6E1EC]">
              <a href="#servicios" className="hover:text-white transition">Consultas</a>
              <a href="#sobre-mi" className="hover:text-white transition">Sobre Alicia</a>
              <a href="#preguntas" className="hover:text-white transition">Preguntas frecuentes</a>
              <a
                href={siteData.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* LEGAL DISCLAIMER NOTICE */}
          <div className="mt-8 rounded-xl border border-white/10 bg-[#120A16]/90 p-5 text-[11px] leading-6 text-[#9F93A7]">
            <p className="font-semibold uppercase tracking-wider text-[#FF6B8B] mb-2 text-[10px]">
              Aviso Legal Importante
            </p>
            <p>
              Este sitio está dirigido exclusivamente a personas mayores de 18 años. Las lecturas de tarot, videncias, orientaciones espirituales y rituales se ofrecen con fines de entretenimiento y ayuda personal. No sustituyen en ningún caso la atención médica, psicológica, psiquiátrica, legal o financiera profesional. La consulta inicial de tarot es gratuita; cualquier trabajo posterior es voluntario y se acuerda previamente de forma libre y consciente. Cada persona y situación es única: los resultados pueden variar y no existe garantía ni evidencia científica sobre ellos. No se solicita información bancaria ni datos sensibles en este sitio. Toda comunicación se trata de forma confidencial.
            </p>
            <p className="mt-2 text-[#E6E1EC]/60">
              El contacto es directo y voluntario. Evitá compartir información bancaria o datos sensibles por WhatsApp.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-[11px] text-[#7d7385] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[#E6E1EC]/70">
              <button
                data-testid="button-privacy-policy"
                onClick={() => setLegal('privacy')}
                className="hover:text-white transition"
              >
                Política de Privacidad
              </button>
              <button
                data-testid="button-terms"
                onClick={() => setLegal('terms')}
                className="hover:text-white transition"
              >
                Términos y Condiciones
              </button>
              <button
                data-testid="button-legal-notice"
                onClick={() => setLegal('legal')}
                className="hover:text-white transition"
              >
                Aviso Legal
              </button>
            </div>
            <div>
              © 2026 Alicia Rosales Tarot. Todos los derechos reservados. · {siteData.socialHandle} · Córdoba, Argentina · WhatsApp: {siteData.phoneFormatted}
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING & STICKY CTAs */}
      <ContactLink
        id="cta-floating-whatsapp"
        location="floating-desktop"
        message={siteData.defaultHeroMessage}
        className="fixed bottom-7 right-7 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#102017] shadow-[0_8px_30px_rgba(20,92,55,.4)] transition hover:scale-105 hover:bg-[#1EBE5D] md:flex p-0 leading-none"
        ariaLabel="Escribime por WhatsApp"
      >
        <MessageCircle size={26} className="shrink-0 block align-middle m-auto" />
      </ContactLink>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#09060C]/95 p-3 backdrop-blur-md md:hidden">
        <ContactLink
          id="cta-sticky-mobile-whatsapp"
          location="sticky-mobile"
          message={siteData.defaultHeroMessage}
          className="inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#25D366] text-xs font-semibold uppercase tracking-wider leading-none text-[#102017] transition hover:bg-[#1EBE5D] shadow-lg"
        >
          <MessageCircle size={18} className="shrink-0 block align-middle" />
          <span className="leading-none">QUIERO MI LECTURA DE TAROT GRATIS</span>
        </ContactLink>
      </div>

      <LegalDialog kind={legal} close={closeLegal} />
    </main>
  );
}

export default App;
