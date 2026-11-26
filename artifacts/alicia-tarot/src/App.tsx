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
    <main className="min-h-[100dvh] overflow-hidden bg-[#120821] text-[#eee6d7]">
      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-40 border-b border-white/[.07] bg-[#120821]/80 backdrop-blur-md">
        <div className="border-b border-white/[.06] bg-[#120821]/80">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center text-[10px] tracking-wide text-[#bcb1c3] sm:px-8 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d1b875]" aria-hidden="true" />
            Lectura de tarot gratis · atención online
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3" aria-label="Alicia Rosales Tarot, inicio">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-[#c6ae70]/50 text-[#d6bd7d]">
              <Sparkles size={18} />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-[15px] tracking-wide text-[#f1e8d7]">
                {siteData.brandTitle}
              </span>
              <span className="mt-0.5 block text-[9px] uppercase tracking-[.22em] text-[#c7b7d4]">
                {siteData.brandSubtitle}
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[13px] tracking-wide text-[#c8bfd0] transition hover:text-[#e2ca8e]"
              >
                {label}
              </a>
            ))}
            <ContactLink
              id="cta-header-whatsapp"
              location="header"
              message={siteData.defaultHeroMessage}
              className="rounded-full border border-[#b99a61]/60 px-5 py-2 text-[12px] font-semibold tracking-wide text-[#e7d49f] transition hover:bg-[#b99a61]/15"
            >
              Lectura Gratis
            </ContactLink>
          </nav>
          <button
            data-testid="button-mobile-menu"
            aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
            className="p-2 text-[#e6dccb] md:hidden"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenu && (
          <nav className="border-t border-white/10 bg-[#201a2c] px-5 py-4 md:hidden">
            {navLinks.map(([label, href]) => (
              <a
                key={href}
                onClick={() => setMobileMenu(false)}
                href={href}
                className="block border-b border-white/[.06] py-3 text-sm text-[#ded4e2]"
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
      <section id="inicio" className="starfield relative flex min-h-[760px] items-center pt-28 sm:min-h-[820px] sm:pt-24">
        <div className="pointer-events-none absolute -right-20 top-24 h-[570px] w-[570px] rounded-full bg-[radial-gradient(circle,rgba(103,77,132,.25),transparent_66%)]" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-8 lg:pb-24">
          <div className="fade-up relative z-10 max-w-[660px]">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#d2b875]/40 bg-[#241738]/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[.18em] text-[#d2b875] backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d2b875]" />
              Lectura de tarot gratis · atención online
            </div>
            <h1 className="font-serif text-[clamp(2.6rem,5.8vw,4.6rem)] leading-[1.08] tracking-[-.035em] text-[#f2eadb]">
              ¿Sentís que esa persona se aleja y no entendés qué está pasando?
            </h1>
            <p className="mt-6 max-w-[560px] text-[15px] leading-7 text-[#c4b9ca] sm:text-base">
              No tenés que atravesar esta incertidumbre en silencio. Soy Alicia Rosales. Ofrezco una lectura de tarot gratuita y confidencial para que puedas explorar tu situación con calma, por WhatsApp.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ContactLink
                id="cta-hero-whatsapp"
                location="hero"
                message={siteData.defaultHeroMessage}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-sm font-semibold uppercase tracking-wider text-[#102017] leading-none shadow-[0_8px_30px_rgba(37,211,102,.25)] transition hover:bg-[#1EBE5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#73c79b]"
              >
                <MessageCircle size={18} className="shrink-0 block align-middle" />
                <span className="leading-none">QUIERO MI LECTURA DE TAROT GRATIS</span>
              </ContactLink>
              <a
                href="#lectura"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#bfa66f]/50 px-6 py-3.5 text-sm font-medium leading-none text-[#e8d7a7] transition hover:bg-[#bfa66f]/15"
              >
                <Sparkles size={16} className="shrink-0 block align-middle" />
                <span className="leading-none">Elegir una carta</span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5 text-xs text-[#bcb2c4] sm:gap-6">
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#d8c383]" /> Discreción y reserva
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#d8c383]" /> Respuesta por WhatsApp
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-[#d8c383]" /> Atención personalizada
              </span>
            </div>
          </div>

          {/* HERO PORTRAIT */}
          <div className="relative mx-auto flex h-[390px] w-full max-w-[500px] items-center justify-center sm:h-[490px]">
            <div className="absolute h-[310px] w-[310px] rounded-full border border-[#c7ab69]/20 sm:h-[390px] sm:w-[390px]" />
            <div className="absolute h-[268px] w-[268px] rounded-full border border-dashed border-[#c7ab69]/25 sm:h-[340px] sm:w-[340px]" />
            <div className="portrait-orbit absolute h-[290px] w-[290px] rounded-full sm:h-[360px] sm:w-[360px]">
              <div className="absolute inset-[19px] overflow-hidden rounded-full border-2 border-[#d5be81]/70 shadow-[0_0_40px_rgba(213,190,129,0.3)] bg-[#1b1725]">
                <img
                  src={aliciaImg}
                  alt="Alicia Rosales - Tarotista"
                  className="h-full w-full object-cover object-[center_20%] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120821]/65 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#e6cf93]/60 bg-[#221c2d]/90 px-3.5 py-1 text-center text-xs tracking-wider text-[#ddc483] shadow-md backdrop-blur-sm whitespace-nowrap">
                  ✧ Alicia Rosales ✧
                </div>
              </div>
            </div>

            <span className="absolute left-[7%] top-[23%] text-xl text-[#ddc681]">✧</span>
            <span className="absolute right-[11%] top-[30%] text-sm text-[#d6c28e]">✦</span>
            <span className="absolute bottom-[20%] left-[14%] text-sm text-[#d6c28e]">✦</span>
            <span className="absolute bottom-[23%] right-[7%] text-xl text-[#ddc681]">✧</span>

            <div className="absolute top-4 left-0 rounded-xl border border-white/10 bg-[#201a2c]/90 px-4 py-2.5 shadow-xl sm:top-8 sm:left-2 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#d4bf84]">Magia Blanca y Roja</p>
              <p className="mt-0.5 text-[10px] text-[#aa9db4]">Con cuidado y respeto</p>
            </div>

            <div className="absolute bottom-3 right-0 rounded-xl border border-white/10 bg-[#201a2c]/90 px-4 py-2.5 shadow-xl sm:bottom-8 sm:right-2 backdrop-blur-sm">
              <p className="font-serif text-sm text-[#eadbb7]">Córdoba, Argentina</p>
              <p className="mt-0.5 text-[10px] tracking-wide text-[#a99db4]">Atención online</p>
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
      <section id="lectura" className="starfield border-y border-white/[.07] bg-[#1a0e2f] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Tu primer mensaje</span>
            <h2 className="section-title mt-4">
              Concentrate en esa persona <em>y elegí una carta.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#c5b9cb]">
              Dejá que tu intuición elija una de estas tres cartas para recibir un mensaje simbólico.
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
                  className={`group relative flex min-h-[310px] flex-col justify-between rounded-2xl border p-6 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6bb78] ${
                    isSelected
                      ? 'border-[#e0ca8e] bg-[#2e2142] shadow-[0_0_35px_rgba(224,202,142,.22)]'
                      : 'border-[#62516f]/60 bg-[#221832] hover:-translate-y-1 hover:border-[#aa9569]/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#d4bf83]">
                      {card.numeral}
                    </span>
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full border text-xs transition ${
                        isSelected
                          ? 'border-[#e0ca8e] bg-[#e0ca8e] text-[#1e1329]'
                          : 'border-white/20 text-[#c8bdd0] group-hover:border-[#d4bf83]'
                      }`}
                    >
                      {isSelected ? <Check size={14} /> : card.icon}
                    </span>
                  </div>

                  <div className="my-auto py-4">
                    <span className="text-xs uppercase tracking-wider text-[#a89caf]">
                      {card.label}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-[#f3ebdc]">
                      {card.shortName}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-[#cbc0d1]">
                      {card.text}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[11px] text-[#baaebb]">
                    <span>{isSelected ? '✓ Carta elegida' : card.hint}</span>
                    <span className="text-[#d8c383]">{isSelected ? 'Tocá para cerrar' : '→'}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-xs text-[#a499ab]">
              Las cartas ofrecen símbolos para pensar; vos conservás siempre la decisión sobre tu camino.
            </p>

            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 rounded-2xl border border-[#d2ba79]/50 bg-[#271c38] p-6 shadow-xl"
                >
                  <p className="text-xs uppercase tracking-widest text-[#d5c187]">
                    Carta seleccionada: {selectedCard.name}
                  </p>
                  <p className="mt-2 font-serif text-lg text-[#eee3d4]">
                    ¿Querés profundizar en lo que significa para tu vínculo?
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <ContactLink
                      id="cta-spread-whatsapp"
                      location="lectura-cartas"
                      message={cardMessage}
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#25D366] text-xs font-semibold leading-none text-[#102017] transition hover:bg-[#1EBE5D]"
                    >
                      <MessageCircle size={16} className="shrink-0 block align-middle" />
                      <span className="leading-none">Conversar sobre esta carta por WhatsApp</span>
                      <ArrowRight size={14} className="shrink-0 block align-middle" />
                    </ContactLink>
                    <button
                      type="button"
                      onClick={() => setSelectedCardIndex(null)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#7a6b82]/60 px-5 py-3 text-xs leading-none text-[#c9bdce] transition hover:border-[#bfa66e]"
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
      <section id="vinculos" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Vínculos y emociones</span>
            <h2 className="section-title mt-4">
              ¿Te reconocés en alguna <em>de estas situaciones?</em>
            </h2>
            <p className="mt-5 text-base leading-7 text-[#bdb2c5]">
              Podés contarme lo que te preocupa, sin tener que llegar con todo resuelto.
            </p>
            <div className="mt-4">
              <a
                href="#servicios"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4bf83] hover:underline"
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
                className="flex items-start gap-4 rounded-xl border border-[#5a4b64]/60 bg-[#211b2d]/80 p-5 transition hover:border-[#967f56]/70"
              >
                <span
                  aria-hidden="true"
                  className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#c6ae70]/50 text-[#d8c383] bg-[#2d1e3d]"
                >
                  <Check size={14} />
                </span>
                <p className="text-sm leading-6 text-[#d5cbdb]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ContactLink
              id="cta-vinculos-whatsapp"
              location="vinculos-emociones"
              message={siteData.vinculosMessage}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] text-xs font-semibold uppercase tracking-wider leading-none text-[#102017] transition hover:bg-[#1EBE5D] shadow-[0_8px_25px_rgba(37,211,102,.2)]"
            >
              <MessageCircle size={16} className="shrink-0 block align-middle" />
              <span className="leading-none">Contame tu situación</span>
              <ArrowRight size={15} className="shrink-0 block align-middle" />
            </ContactLink>
          </div>
        </div>
      </section>

      {/* SECTION: SERVICIOS / CONSULTAS */}
      <section id="servicios" className="bg-[#1D0E36] py-24 sm:py-28 border-y border-white/[.07]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Acompañamiento personalizado</span>
              <h2 className="section-title mt-4">
                Magia Blanca y Roja, <em>con claridad y sin promesas.</em>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#b7acbd]">
              Primero podés hacer una lectura gratuita. Después, si querés, conversamos sobre otras prácticas y sus alcances antes de que decidas.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {siteData.services.map((service, i) => (
              <article
                key={service.id}
                data-testid={`card-service-${service.id}`}
                className={`relative flex flex-col h-full overflow-hidden rounded-2xl border p-7 sm:p-8 transition hover:-translate-y-1 ${
                  i === 0
                    ? 'border-[#d4bf83]/70 bg-[#281545] shadow-[0_8px_30px_rgba(212,191,131,.1)]'
                    : 'border-[#52465e]/70 bg-[#1b102d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-4xl text-[#c1a96c]/70">0{i + 1}</span>
                  {service.badge && (
                    <span className="rounded-full border border-[#d2bc81]/50 bg-[#d2bc81]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.17em] text-[#e8d7a7]">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-serif text-2xl text-[#f0e5d4] leading-snug">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#bdb2c4]">
                  {service.description}
                </p>

                {/* Bloque inferior agrupado con mt-auto para alinear todos los botones a la misma altura */}
                <div className="mt-auto pt-5 flex flex-col gap-4">
                  <p className="border-t border-white/10 pt-3 text-[11px] text-[#d2c08e]">
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

          <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#6a5d72]/50 bg-[#170e24] p-5 text-xs leading-5 text-[#baaebf]">
            <ShieldCheck size={20} className="shrink-0 text-[#cdb879]" />
            <span>
              Magia Roja: cada consulta se conversa con cuidado y transparencia. No ofrezco resultados garantizados ni intervenciones que anulen la voluntad de otra persona.
            </span>
          </div>
        </div>
      </section>

      {/* SECTION: SOBRE MÍ */}
      <section id="sobre-mi" className="relative py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[.85fr_1.15fr]">
          <div className="relative mx-auto h-[390px] w-full max-w-[420px] overflow-hidden rounded-[48%_48%_24px_24px] border-2 border-[#b8a06b]/50 shadow-[0_16px_50px_rgba(0,0,0,0.45)] bg-[#1b1725] sm:h-[450px]">
            <img
              src={aliciaImg}
              alt="Alicia Rosales en sesión de lectura de tarot"
              className="h-full w-full object-cover object-[center_30%] transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b1725]/85 via-[#1b1725]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 rounded-full border border-[#c8ad6c]/40 bg-[#1c1724]/85 px-4 py-2 text-[10px] uppercase tracking-[.2em] text-[#d9c68c] backdrop-blur-sm shadow-md">
              Con cuidado y respeto
            </div>
          </div>

          <div className="max-w-xl">
            <span className="eyebrow">Un poco sobre mí</span>
            <h2 className="section-title mt-4">
              Hola, soy <em>Alicia Rosales.</em>
            </h2>
            <div className="mt-6 space-y-4 text-base leading-8 text-[#d2c8d4]">
              <p>
                Soy oriunda de Santiago del Estero y hoy vivo en Córdoba. Me dedico al tarot y a las consultas sobre Magia Blanca y Roja, acompañando cada historia con respeto y reserva.
              </p>
              <p className="leading-7 text-[#b5aab9]">
                Antes de sugerirte cualquier ritual, primero escucho tu historia y consultamos el tarot sin costo. Mi compromiso es hablarte con sinceridad, con respeto y sin presionarte para avanzar.
              </p>
              <p className="leading-7 text-[#b5aab9]">
                Atiendo online para toda Argentina y el exterior. Si querés, escribime y vemos si una consulta es adecuada para vos.
              </p>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
              <span className="font-serif italic text-2xl text-[#e0cb92]">Alicia</span>
              <a
                href={siteData.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#cfbf91] transition hover:text-[#f0dfaa]"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full border border-[#8e7b56]/50 text-[10px]">ig</span>
                {siteData.socialHandle}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['Atención directa', 'Escucha sin juicios', 'Trato discreto', 'Argentina y exterior'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#8d7a56]/40 bg-[#231b2e] px-3.5 py-1.5 text-[11px] tracking-wide text-[#d4c28e]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: EL PROCESO (SIN VUELTAS, SIN PRESIÓN) */}
      <section className="border-y border-white/[.07] bg-[#1a0e2f] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Sin vueltas, sin presión</span>
            <h2 className="section-title mt-4">
              Así empieza <em>la conversación.</em>
            </h2>
            <p className="mt-4 text-base leading-7 text-[#bdb2c5]">
              Vos marcás el ritmo y decidís qué querés compartir en cada momento.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
            {siteData.steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#5e4f6a]/60 bg-[#231936] p-7 transition hover:border-[#c5ad75]/60"
              >
                <span className="font-serif text-4xl text-[#d4bf83]/60">{step.number}</span>
                <h3 className="mt-4 font-serif text-xl text-[#f1e7d8]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#bcb0c2]">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <ContactLink
              id="cta-process-whatsapp"
              location="proceso"
              message={siteData.processMessage}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#25D366] px-7 py-3 text-xs font-semibold leading-none text-[#8de0aa] transition hover:bg-[#25D366]/15"
            >
              <MessageCircle size={15} className="shrink-0 block align-middle" />
              <span className="leading-none">Consultar sin compromiso</span>
              <ArrowRight size={14} className="shrink-0 block align-middle" />
            </ContactLink>
          </div>
        </div>
      </section>

      {/* SECTION: CON TRANSPARENCIA */}
      <section className="py-20 sm:py-24 border-b border-white/[.07] bg-[#150d24]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr]">
          <div>
            <span className="eyebrow">Con transparencia</span>
            <h2 className="section-title mt-4">
              Una confianza <em>que se construye.</em>
            </h2>
          </div>
          <div>
            <div className="flex gap-5">
              <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#bca46d]/40 text-[#d9c587] bg-[#221733]">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h3 className="font-serif text-xl text-[#eee3d3]">Las voces, cuando estén listas</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#b7acbd]">
                  Acá compartiremos opiniones reales solo cuando tengamos autorización para publicarlas. Por ahora, preferimos que conozcas el espacio hablando directamente con Alicia.
                </p>
              </div>
            </div>
            <div className="mt-7 border-t border-white/10 pt-6 text-xs leading-6 text-[#9f94a7]">
              La lectura es una práctica de reflexión personal y entretenimiento. Conservás siempre tu autonomía: las cartas no deciden por vos ni pueden controlar lo que elija otra persona.
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PREGUNTAS FRECUENTES */}
      <section id="preguntas" className="py-24 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-[.75fr_1.25fr]">
          <div>
            <span className="eyebrow">Antes de escribir</span>
            <h2 className="section-title mt-4">
              Preguntas <em>que quizás tenés.</em>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#ada2b4]">
              Y si te queda alguna, podés preguntarme directamente. No hay obligación de seguir adelante.
            </p>
            <ContactLink
              id="cta-faq-whatsapp"
              location="preguntas"
              message={siteData.defaultHeroMessage}
              className="mt-6 inline-flex items-center gap-2 text-xs text-[#d9c487] hover:underline"
            >
              Hacer una consulta por WhatsApp <ArrowRight size={14} />
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
                  className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-lg text-[#e8deeb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6bb78]"
                >
                  {faq.q}
                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-[#cbb477] transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#b8adbf]"
                  >
                    {faq.a}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: CTA FINAL ("CUANDO QUIERAS") */}
      <section className="relative overflow-hidden border-y border-[#b39a64]/25 bg-[#24193b] py-20 sm:py-24">
        <div className="absolute inset-0 opacity-70 pointer-events-none">
          <div className="absolute -left-24 top-[-150px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(143,112,164,.2),transparent_70%)]" />
          <div className="absolute -right-24 bottom-[-200px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(180,151,93,.15),transparent_70%)]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="eyebrow">Cuando quieras</span>
          <h2 className="mt-4 font-serif text-3xl leading-tight text-[#f1e7d8] sm:text-5xl">
            Tu consulta empieza <em>cuando quieras.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base leading-7 text-[#bdb2c6]">
            Si te sirve, escribime por WhatsApp. La primera lectura es gratis; cualquier otro paso es voluntario y sin presión.
          </p>

          <div className="mt-8">
            <ContactLink
              id="cta-final-whatsapp"
              location="final"
              message={siteData.defaultHeroMessage}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-sm font-semibold uppercase tracking-wider leading-none text-[#102017] shadow-[0_8px_30px_rgba(37,211,102,.25)] transition hover:bg-[#1EBE5D]"
            >
              <MessageCircle size={18} className="shrink-0 block align-middle" />
              <span className="leading-none">HABLAR CON ALICIA AHORA · LECTURA GRATIS</span>
              <ArrowRight size={16} className="shrink-0 block align-middle" />
            </ContactLink>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[#a79aaf]">
            <a
              href={whatsappUrl(siteData.defaultHeroMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e0ca8e] transition"
            >
              WhatsApp: <span className="text-[#e0ca8e]">{siteData.phoneFormatted}</span>
            </a>
            <span>·</span>
            <span>Atención online desde Córdoba, Argentina · Argentina y exterior</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#120a1c] pb-24 pt-14 sm:pb-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 md:flex-row md:items-center">
            <div>
              <a href="#inicio" className="font-serif text-xl text-[#eee3d4]">
                {siteData.brandTitle}
              </a>
              <span className="ml-2 text-xs text-[#c7b7d4]">
                · {siteData.brandSubtitle}
              </span>
              <p className="mt-2 text-xs text-[#9f94a7] max-w-md">
                Un espacio de escucha y reflexión a través del tarot. Gratuito para tu primera lectura, confidencial y sin obligación de continuar.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#cfbf91]">
              <a href="#servicios" className="hover:text-[#ead9a5] transition">Consultas</a>
              <a href="#sobre-mi" className="hover:text-[#ead9a5] transition">Sobre Alicia</a>
              <a href="#preguntas" className="hover:text-[#ead9a5] transition">Preguntas frecuentes</a>
              <a
                href={siteData.socialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ead9a5] transition"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* LEGAL DISCLAIMER NOTICE */}
          <div className="mt-8 rounded-xl border border-white/10 bg-[#170e24]/80 p-5 text-[11px] leading-6 text-[#9f93a7]">
            <p className="font-semibold uppercase tracking-wider text-[#d4bf83] mb-2 text-[10px]">
              Aviso Legal Importante
            </p>
            <p>
              Este sitio está dirigido exclusivamente a personas mayores de 18 años. Las lecturas de tarot, videncias, orientaciones espirituales y rituales se ofrecen con fines de entretenimiento y ayuda personal. No sustituyen en ningún caso la atención médica, psicológica, psiquiátrica, legal o financiera profesional. La consulta inicial de tarot es gratuita; cualquier trabajo posterior es voluntario y se acuerda previamente de forma libre y consciente. Cada persona y situación es única: los resultados pueden variar y no existe garantía ni evidencia científica sobre ellos. No se solicita información bancaria ni datos sensibles en este sitio. Toda comunicación se trata de forma confidencial.
            </p>
            <p className="mt-2 text-[#bcaec1]">
              El contacto es directo y voluntario. Evitá compartir información bancaria o datos sensibles por WhatsApp.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-[11px] text-[#7d7385] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[#af9eb8]">
              <button
                data-testid="button-privacy-policy"
                onClick={() => setLegal('privacy')}
                className="hover:text-[#e3cc91] transition"
              >
                Política de Privacidad
              </button>
              <button
                data-testid="button-terms"
                onClick={() => setLegal('terms')}
                className="hover:text-[#e3cc91] transition"
              >
                Términos y Condiciones
              </button>
              <button
                data-testid="button-legal-notice"
                onClick={() => setLegal('legal')}
                className="hover:text-[#e3cc91] transition"
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

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#120821]/95 p-3 backdrop-blur-md md:hidden">
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
