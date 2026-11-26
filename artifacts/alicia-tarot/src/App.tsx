import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronDown, Heart, Menu, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteData, legalCopy } from './config/siteData';

type LegalKey = keyof typeof legalCopy;

function whatsappUrl(message = 'Hola Alicia, quisiera recibir información sobre la orientación inicial sin costo.') {
  return `https://wa.me/${siteData.phone}?text=${encodeURIComponent(message)}`;
}

function handleWhatsAppClick(location: string, customMessage?: string) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>>; fbq?: (...args: unknown[]) => void };
  w.dataLayer?.push({ event: 'whatsapp_contact', cta_location: location });
  w.fbq?.('track', 'Contact', { content_name: location });
  window.open(whatsappUrl(customMessage), '_blank', 'noopener,noreferrer');
}

function ContactLink({ id, location, children, className, message, ariaLabel }: { id: string; location: string; children: ReactNode; className: string; message?: string; ariaLabel?: string }) {
  return <a id={id} data-testid={id} data-cta-location={location} aria-label={ariaLabel} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className={className} onClick={(event) => { event.preventDefault(); handleWhatsAppClick(location, message); }}>{children}</a>;
}

function LegalDialog({ kind, close }: { kind: LegalKey | null; close: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!kind) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [kind, close]);
  if (!kind) return null;
  const content = legalCopy[kind];
  return <div className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="legal-title" className="w-full max-w-lg rounded-2xl border border-[#716147]/50 bg-[#211a2e] p-7 shadow-2xl sm:p-9">
      <div className="mb-5 flex items-start justify-between gap-4"><div><span className="eyebrow">Alicia Rosales Tarot</span><h2 id="legal-title" className="mt-2 font-serif text-3xl text-[#f1e7d1]">{content.title}</h2></div>
        <button data-testid="button-close-legal-dialog" ref={closeRef} onClick={close} aria-label="Cerrar ventana" className="rounded-full p-2 text-[#c9bdd4] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6bb78]"><X size={20}/></button></div>
      <p className="leading-7 text-[#c9bfd0]">{content.body}</p>
      <button onClick={close} className="mt-8 rounded-full border border-[#b9a16b]/50 px-5 py-2.5 text-sm text-[#ead8a8] transition hover:bg-[#b9a16b]/10">Entendido</button>
    </section>
  </div>;
}

function App() {
  const [selected, setSelected] = useState<number[]>([]);
  const [legal, setLegal] = useState<LegalKey | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const closeLegal = () => setLegal(null);
  const chosenCards = selected.map((index) => siteData.cards[index]);
  const selectionMessage = `Hola Alicia, hice la tirada de orientación y elegí estas cartas: ${chosenCards.map((card) => card.name).join(', ')}. Me gustaría conversar sobre una orientación inicial.`;
  const choose = (index: number) => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : current.length < 3 ? [...current, index] : current);
  const links = [['La lectura gratis', '#orientacion'], ['Elegí tus cartas', '#tirada'], ['Servicios', '#servicios'], ['Sobre Alicia', '#alicia'], ['Preguntas', '#preguntas']];

  return <main className="min-h-[100dvh] overflow-hidden bg-[#120821] text-[#eee6d7]">
    <header className="absolute inset-x-0 top-0 z-40 border-b border-white/[.07] bg-[#120821]/70 backdrop-blur-md">
      <div className="border-b border-white/[.06] bg-[#120821]/70">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2 text-center text-[10px] tracking-wide text-[#bcb1c3] sm:px-8 sm:text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#d1b875]" aria-hidden="true" />
          Atención directa por WhatsApp · Córdoba y consultas online
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Alicia Rosales Tarot, inicio">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#c6ae70]/50 text-[#d6bd7d]"><Sparkles size={18}/></span>
          <span className="leading-tight"><span className="block font-serif text-[15px] tracking-wide text-[#f1e8d7]">Alicia Rosales</span><span className="mt-1 block text-[9px] uppercase tracking-[.28em] text-[#aa9db5]">Tarot · Córdoba</span></span>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegación principal">{links.map(([label, href]) => <a key={href} href={href} className="text-[12px] tracking-wide text-[#c8bfd0] transition hover:text-[#e2ca8e]">{label}</a>)}
          <ContactLink id="cta-header-whatsapp" location="header" className="rounded-full border border-[#b99a61]/60 px-5 py-2.5 text-[11px] font-semibold tracking-wide text-[#e7d49f] transition hover:bg-[#b99a61]/10">Escribime</ContactLink>
        </nav>
        <button data-testid="button-mobile-menu" aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)} className="p-2 text-[#e6dccb] md:hidden">{mobileMenu ? <X/> : <Menu/>}</button>
      </div>
      {mobileMenu && <nav className="border-t border-white/10 bg-[#201a2c] px-5 py-4 md:hidden">{links.map(([label, href]) => <a key={href} onClick={() => setMobileMenu(false)} href={href} className="block border-b border-white/[.06] py-3 text-sm text-[#ded4e2]">{label}</a>)}</nav>}
    </header>

    <section id="inicio" className="starfield relative flex min-h-[760px] items-center pt-24 sm:min-h-[810px]">
      <div className="pointer-events-none absolute -right-20 top-24 h-[570px] w-[570px] rounded-full bg-[radial-gradient(circle,rgba(103,77,132,.23),transparent_66%)]"/>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-4 lg:pb-24">
        <div className="fade-up relative z-10 max-w-[650px]">
          <div className="mb-7 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#d2b875]"><span className="h-px w-9 bg-[#bd9f62]"/>Magia Blanca y Roja · Córdoba, Argentina</div>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.5rem)] leading-[1.02] tracking-[-.045em] text-[#f2eadb]">¿Buscás claridad en tu relación?<br/><em className="font-medium text-[#c9b5d9]">Empezá con una lectura gratis.</em></h1>
          <p className="mt-7 max-w-[540px] text-[15px] leading-7 text-[#c4b9ca] sm:text-base">Soy Alicia, tarotista nacida en Santiago del Estero y radicada en Córdoba. Te ofrezco una orientación simbólica y cercana para explorar lo que sentís, sin promesas ni respuestas que decidan por vos.</p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ContactLink id="cta-hero-whatsapp" location="hero" message="Hola Alicia, vi tu página y quiero pedir mi lectura de tarot gratis para despejar mis dudas." className="inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 text-sm font-bold text-[#102017] shadow-[0_8px_30px_rgba(37,211,102,.2)] transition hover:bg-[#1EBE5D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#73c79b]"><MessageCircle size={17}/>Quiero mi lectura gratis <ArrowRight size={16}/></ContactLink>
            <span className="text-xs text-[#a99eb1]">Por WhatsApp · Sin costo · Sin compromiso</span>
          </div>
          <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-5 text-xs text-[#b8adbd]"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#c6ae70]/50 text-[#d8c383]"><Star size={14}/></span>Atención personalizada y discreta · Lecturas para reflexionar</div>
        </div>
        <div className="relative mx-auto flex h-[390px] w-full max-w-[520px] items-center justify-center sm:h-[490px]">
          <div className="absolute h-[310px] w-[310px] rounded-full border border-[#c7ab69]/20 sm:h-[390px] sm:w-[390px]"/>
          <div className="absolute h-[268px] w-[268px] rounded-full border border-dashed border-[#c7ab69]/20 sm:h-[340px] sm:w-[340px]"/>
          <div className="portrait-orbit absolute h-[290px] w-[290px] rounded-full sm:h-[360px] sm:w-[360px]">
            {/* REEMPLAZAR CON FOTO DE ALICIA */}
            <div className="absolute inset-[19px] overflow-hidden rounded-full border border-[#bba16b]/40 bg-[radial-gradient(ellipse_at_50%_35%,#70617c_0%,#453750_35%,#292139_68%,#1b1725_100%)]">
              <div className="absolute inset-x-[17%] bottom-[-8%] h-[73%] rounded-t-[48%] bg-[linear-gradient(145deg,#7f6a83,#493b55_55%,#30263d)]"/>
              <div className="absolute left-1/2 top-[19%] h-[47%] w-[38%] -translate-x-1/2 rounded-[48%_48%_44%_44%] bg-[linear-gradient(100deg,#c3a58f,#e0c3a6_49%,#b38f83)] shadow-[inset_-12px_-5px_20px_rgba(57,37,50,.25)]"/>
              <div className="absolute left-[31%] top-[14%] h-[35%] w-[38%] rounded-t-[50%] bg-[linear-gradient(100deg,#322634,#51404d_50%,#332535)]"/>
              <div className="absolute left-[38%] top-[42%] h-[2px] w-[5px] rounded-full bg-[#45333a] shadow-[37px_0_0_0_#45333a]"/>
              <div className="absolute bottom-[15%] left-1/2 z-10 h-16 w-16 -translate-x-1/2 rounded-full border border-[#e6cf93]/50 bg-[#221c2d]/80 p-3 text-center text-3xl leading-10 text-[#ddc483]">✧</div>
            </div>
          </div>
          <span className="absolute left-[7%] top-[23%] text-xl text-[#ddc681]">✧</span><span className="absolute right-[11%] top-[32%] text-sm text-[#d6c28e]">✦</span><span className="absolute bottom-[20%] left-[14%] text-sm text-[#d6c28e]">✦</span><span className="absolute bottom-[23%] right-[7%] text-xl text-[#ddc681]">✧</span>
          <div className="absolute bottom-3 right-0 rounded-xl border border-white/10 bg-[#201a2c]/90 px-4 py-3 shadow-xl sm:bottom-10 sm:right-2"><p className="font-serif text-sm text-[#eadbb7]">Córdoba, Argentina</p><p className="mt-1 text-[10px] tracking-wide text-[#a99db4]">Raíces santiagueñas</p></div>
        </div>
      </div>
      <a href="#orientacion" aria-label="Conocer la orientación" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[#9d91a8] md:block"><ArrowDown size={18}/></a>
    </section>

    <section id="orientacion" className="relative border-y border-white/[.07] bg-[#1D0E36]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:py-24">
        <div><span className="eyebrow">Una primera conversación</span><h2 className="section-title mt-4">Empezamos por<br/><em>lo que necesitás.</em></h2></div>
        <div className="max-w-2xl"><p className="text-lg leading-8 text-[#e1d8e5]">La primera lectura de tarot y orientación inicial es gratuita por WhatsApp. Podés contarme qué te gustaría consultar; te explico cómo trabajo y vos decidís si querés seguir.</p><p className="mt-4 leading-7 text-[#aaa0b2]">No necesitás tener todo claro ni compartir nada que no quieras. Es una conversación sin costo ni compromiso.</p>
          <ContactLink id="cta-orientation-whatsapp" location="orientacion" className="mt-7 inline-flex items-center gap-2 border-b border-[#bba269]/60 pb-2 text-sm font-semibold text-[#e1ca8c] transition hover:text-[#f1dda4]">Conversemos por WhatsApp <ArrowRight size={15}/></ContactLink>
        </div>
      </div>
    </section>

    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Un espacio sin juicios</span>
          <h2 className="section-title mt-4">¿Hay algo en tu relación <em>que te gustaría mirar?</em></h2>
          <p className="mt-5 leading-7 text-[#bdb2c5]">No hace falta tener una respuesta lista. Podés empezar por lo que hoy te genera preguntas.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {[
            'El vínculo se siente distante o cambió de un día para el otro.',
            'Hay situaciones alrededor de la relación que te inquietan.',
            'Las conversaciones se volvieron difíciles y querés pensar tus opciones.',
            'Necesitás un momento para decidir si hablar, esperar o poner un límite.',
          ].map((item, index) => (
            <div key={item} data-testid={`card-reflection-${index + 1}`} className="flex items-start gap-4 rounded-xl border border-[#5a4b64]/60 bg-[#211b2d]/75 p-5">
              <span aria-hidden="true" className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#c6ae70]/40 text-[#d8c383]"><Check size={14}/></span>
              <p className="text-sm leading-6 text-[#d0c5d4]">{item}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-6 text-[#aaa0b2]">Cada historia es única. Escribime por privado y vemos qué puede aportarte una lectura.</p>
        <div className="mt-5 text-center">
          <ContactLink id="cta-reflection-whatsapp" location="reflection" className="inline-flex items-center gap-2 text-sm font-semibold text-[#d8c383] transition hover:text-[#f1dda4]">Hablar con Alicia <ArrowRight size={15}/></ContactLink>
        </div>
      </div>
    </section>

    <section id="tirada" className="starfield py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center"><span className="eyebrow">Un momento para vos</span><h2 className="section-title mt-4">Elegí tres cartas.<br/><em>Escuchá qué despiertan.</em></h2><p className="mx-auto mt-5 max-w-xl leading-7 text-[#bdb2c5]">Tomate un instante. Elegí hasta tres cartas y descubrí una lectura simbólica para acompañar tu reflexión.</p></div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {siteData.cards.map((card, index) => {
            const isSelected = selected.includes(index);
            const position = selected.indexOf(index);
            return <button key={card.name} data-testid={`button-tarot-card-${index + 1}`} id={`tarot-card-${index + 1}`} type="button" aria-pressed={isSelected} aria-label={`${isSelected ? 'Quitar' : 'Elegir'} carta ${card.name}${!isSelected && selected.length >= 3 ? ', máximo de tres cartas alcanzado' : ''}`} onClick={() => choose(index)} className={`tarot-card group relative min-h-[220px] rounded-2xl border p-3 text-left transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6bb78] sm:min-h-[250px] ${isSelected ? 'border-[#d5bd80] bg-[#342a40] shadow-[0_0_28px_rgba(204,174,106,.12)]' : 'border-[#5a4b64]/70 bg-[#211b2b] hover:-translate-y-1 hover:border-[#aa9569]/70'} ${!isSelected && selected.length >= 3 ? 'opacity-55' : ''}`}>
              <span className={`tarot-flipper ${isSelected ? 'is-flipped' : ''}`}>
                <span className="tarot-face tarot-face-front">
                  <span className="tarot-back flex h-full min-h-[190px] flex-col items-center justify-end overflow-hidden rounded-xl border border-[#b59b69]/20 p-4 sm:min-h-[220px]">
                    <span className="relative z-10 mb-2 font-serif text-sm tracking-wide text-[#d4c08b]">Elegir carta</span><span className="relative z-10 text-[9px] text-[#a699ae]">0{index + 1}</span>
                  </span>
                </span>
                <span className="tarot-face tarot-face-revealed">
                  <span className="flex h-full min-h-[190px] flex-col justify-between rounded-xl border border-[#d1b979]/30 bg-[radial-gradient(ellipse_at_50%_0%,rgba(155,121,165,.24),transparent_65%)] p-4 sm:min-h-[220px] sm:p-5">
                    <span className="flex items-center justify-between"><span className="text-[9px] uppercase tracking-[.25em] text-[#d4bf83]">Carta {position + 1}</span><span className="grid h-6 w-6 place-items-center rounded-full bg-[#d4bf83] text-[#241d30]"><Check size={13}/></span></span>
                    <span><span aria-hidden="true" className="mb-2 block text-3xl text-[#e1cb8d]">{card.icon}</span><span className="block font-serif text-xl text-[#f1e7d4]">{card.name}</span><span className="mt-1 block text-[10px] uppercase tracking-[.14em] text-[#bda9c6]">{card.theme}</span><span className="mt-3 block text-xs leading-5 text-[#ccc1d0]">{card.text}</span></span>
                  </span>
                </span>
              </span>
            </button>;
          })}
        </div>
        <div data-testid="status-card-count" aria-live="polite" className="mx-auto mt-8 min-h-7 text-center text-sm text-[#cbbfcf]">Cartas elegidas: {selected.length} / 3{selected.length < 3 && selected.length === 0 ? ' · elegí las que te llamen' : ''}</div>
        {selected.length === 3 ? (
          <motion.div data-testid="panel-reading-preview" aria-live="polite" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto mt-7 max-w-3xl rounded-2xl border border-[#bba16b]/45 bg-[#241d30]/90 p-6 shadow-[0_18px_60px_rgba(0,0,0,.18)] sm:p-8">
            <span className="eyebrow">Una lectura simbólica para empezar</span>
            <h3 className="mt-3 font-serif text-2xl text-[#eee3d3]">Tus tres cartas invitan a reflexionar</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {chosenCards.map((card) => <div key={card.name} className="border-t border-white/10 pt-4"><p className="font-serif text-lg text-[#d8c383]">{card.name}</p><p className="mt-2 text-xs leading-5 text-[#c4b9ca]">{card.text}</p></div>)}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#9f94a7]">Es una propuesta de reflexión, no una predicción. La interpretación depende de tu propia historia.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ContactLink id="cta-spread-whatsapp" location="tarot-interactivo" message={selectionMessage} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-xs font-bold text-[#102017] transition hover:bg-[#1EBE5D]"><MessageCircle size={15}/>Conversar sobre mis cartas <ArrowRight size={14}/></ContactLink>
              <button data-testid="button-reset-tarot-spread" type="button" onClick={() => setSelected([])} className="inline-flex items-center gap-2 rounded-full border border-[#73647a]/60 px-5 py-3 text-xs text-[#c9bdce] transition hover:border-[#bfa66e]"><RotateCcw size={14}/>Volver a empezar</button>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button data-testid="button-reset-tarot-spread" type="button" onClick={() => setSelected([])} disabled={selected.length === 0} className="inline-flex items-center gap-2 rounded-full border border-[#73647a]/60 px-5 py-3 text-xs text-[#c9bdce] transition hover:border-[#bfa66e] disabled:cursor-not-allowed disabled:opacity-40"><RotateCcw size={14}/>Volver a empezar</button>
            <ContactLink id="cta-spread-whatsapp" location="tarot-interactivo" message={chosenCards.length ? selectionMessage : 'Hola Alicia, vi tu página y quiero pedir mi lectura de tarot gratis para despejar mis dudas.'} className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-[#25D366]/70 px-6 text-xs font-semibold text-[#8de0aa] transition hover:bg-[#25D366]/10"><MessageCircle size={15}/>Escribime por WhatsApp <ArrowRight size={14}/></ContactLink>
          </div>
        )}
        <p className="mt-5 text-center text-[11px] text-[#8f8498]">Esta tirada es una propuesta simbólica y de entretenimiento; no es una predicción.</p>
      </div>
    </section>

    <section id="servicios" className="bg-[#1D0E36] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="eyebrow">Formas de encontrarnos</span><h2 className="section-title mt-4">Un espacio, <em>tu manera.</em></h2></div><p className="max-w-md leading-7 text-[#b7acbd]">Cada consulta empieza con una conversación. Juntas vemos qué te puede acompañar, sin apuro y sin respuestas prefabricadas.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {siteData.services.map((service, i) => <article key={service.id} data-testid={`card-service-${service.id}`} className={`relative flex min-h-[350px] flex-col overflow-hidden rounded-2xl border p-7 sm:p-8 ${i === 1 ? 'border-[#af9765]/50 bg-[#2A144D]' : 'border-[#52465e]/70 bg-[#1b102d]'}`}>
            <span className="font-serif text-5xl text-[#c1a96c]/70">0{i + 1}</span><span className="absolute right-7 top-8 rounded-full border border-[#9f8c60]/35 px-3 py-1 text-[9px] uppercase tracking-[.17em] text-[#d2bc81]">{service.label}</span>
            <h3 className="mt-8 font-serif text-2xl text-[#f0e5d4]">{service.title}</h3><p className="mt-3 text-sm leading-6 text-[#bdb2c4]">{service.description}</p><p className="mt-5 border-t border-white/10 pt-4 text-[11px] text-[#d2c08e]">{service.detail}</p>
            <ContactLink id={`cta-service-${service.id}-whatsapp`} location={`servicio-${service.id}`} message={service.message} className="mt-auto inline-flex min-h-[44px] items-center justify-center gap-2 self-start rounded-full bg-[#25D366] px-5 text-xs font-bold text-[#102017] transition hover:bg-[#1EBE5D]"><MessageCircle size={15}/>Consultar por WhatsApp <ArrowRight size={14}/></ContactLink>
          </article>)}
        </div>
        <div className="mt-8 flex items-center gap-3 rounded-xl border border-[#6a5d72]/40 bg-[#1b1725] p-5 text-xs leading-5 text-[#aa9fb3]"><ShieldCheck size={18} className="shrink-0 text-[#cdb879]"/>Las lecturas se ofrecen como orientación personal y entretenimiento. No reemplazan asesoramiento profesional ni aseguran resultados.</div>
      </div>
    </section>

    <section id="alicia" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 md:grid-cols-[.85fr_1.15fr]">
        <div className="relative mx-auto h-[360px] w-full max-w-[420px] overflow-hidden rounded-[48%_48%_20px_20px] border border-[#b8a06b]/35 bg-[radial-gradient(ellipse_at_50%_25%,#53435f,#292137_62%,#1b1725)]">
          <div className="absolute inset-x-[20%] bottom-[-10%] h-[67%] rounded-t-[48%] bg-[linear-gradient(120deg,#64506a,#3c3048_60%,#2b2334)]"/>
          <div className="absolute left-1/2 top-[16%] h-[45%] w-[36%] -translate-x-1/2 rounded-[46%] bg-[linear-gradient(100deg,#bb9b88,#dec0a3_55%,#ad897e)]"/>
          <div className="absolute left-[33%] top-[11%] h-[36%] w-[35%] rounded-t-[50%] bg-[linear-gradient(100deg,#322634,#51404d_50%,#332535)]"/>
          <div className="absolute bottom-5 left-5 rounded-full border border-[#c8ad6c]/40 bg-[#1c1724]/70 px-4 py-2 text-[10px] uppercase tracking-[.2em] text-[#d9c68c]">Un espacio cercano</div>
        </div>
        <div className="max-w-xl"><span className="eyebrow">Un poco de mi camino</span><h2 className="section-title mt-4">Soy Alicia.<br/><em>Gracias por estar acá.</em></h2>
           <p className="mt-6 text-base leading-8 text-[#d2c8d4]">Nací en Santiago del Estero y hoy vivo en Córdoba. Con años de práctica en Tarot, Magia Blanca y Magia Roja, encontré en sus símbolos una forma de mirar las preguntas desde otro ángulo.</p>
           <p className="mt-4 leading-7 text-[#aaa0b2]">Acompaño desde la escucha y el respeto por tus propios tiempos. No tengo respuestas definitivas para darte: me interesa que este encuentro te ayude a reconocer lo que resuena en vos y a encontrar tus propias preguntas.</p>
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6"><span className="grid h-9 w-9 place-items-center rounded-full border border-[#b8a064]/40 text-[#d3bd80]"><Heart size={16}/></span><span className="text-xs leading-5 text-[#c2b6c7]">Con cuidado, honestidad y sin juicios.</span></div>
           <div className="mt-6 flex flex-wrap gap-2">
             {['Atención directa', 'Escucha sin juicios', 'Trato discreto'].map((item) => <span key={item} className="rounded-full border border-[#8d7a56]/35 px-3 py-1.5 text-[10px] tracking-wide text-[#d4c28e]">{item}</span>)}
           </div>
        </div>
      </div>
    </section>

    <section className="border-y border-white/[.07] bg-[#211b2d] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr]">
        <div><span className="eyebrow">Confianza, sin promesas</span><h2 className="section-title mt-4">Lo importante<br/><em>es cómo te sentís.</em></h2></div>
        <div>
          <div className="flex gap-5"><span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#bca46d]/40 text-[#d9c587]"><ShieldCheck size={19}/></span><div><h3 className="font-serif text-xl text-[#eee3d3]">Transparencia antes que espectáculo</h3><p className="mt-3 max-w-xl text-sm leading-7 text-[#b7acbd]">No vas a encontrar acá conversaciones inventadas ni resultados garantizados. Si en algún momento comparto testimonios, será únicamente con autorización de quienes los brindaron.</p></div></div>
          <div className="mt-7 border-t border-white/10 pt-6 text-sm leading-7 text-[#aaa0b2]">La lectura es una práctica de reflexión personal y entretenimiento. Conservás siempre tu autonomía: las cartas no deciden por vos ni pueden controlar lo que elija otra persona.</div>
        </div>
      </div>
    </section>

    <section id="preguntas" className="py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 md:grid-cols-[.75fr_1.25fr]">
        <div><span className="eyebrow">Antes de escribir</span><h2 className="section-title mt-4">Preguntas<br/><em>frecuentes.</em></h2><p className="mt-5 max-w-sm text-sm leading-7 text-[#ada2b4]">Si te queda alguna duda, podés preguntarme directamente. No hay obligación de seguir adelante.</p><ContactLink id="cta-faq-whatsapp" location="preguntas" className="mt-6 inline-flex items-center gap-2 text-xs text-[#d9c487]">Hacer una consulta <ArrowRight size={14}/></ContactLink></div>
        <div className="divide-y divide-white/10 border-y border-white/10">
          {siteData.faqs.map((faq, i) => <article key={faq.q} className="py-1">
            <button data-testid={`button-faq-${i + 1}`} type="button" id={`faq-button-${i}`} aria-expanded={openFaq === i} aria-controls={`faq-panel-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-lg text-[#e8deeb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d6bb78]">{faq.q}<ChevronDown size={17} className={`shrink-0 text-[#cbb477] transition-transform ${openFaq === i ? 'rotate-180' : ''}`}/></button>
            {openFaq === i && <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-button-${i}`} className="max-w-2xl pb-5 pr-8 text-sm leading-7 text-[#b8adbf]">{faq.a}</div>}
          </article>)}
        </div>
      </div>
    </section>

    <section className="relative overflow-hidden border-y border-[#b39a64]/20 bg-[#282138] py-20 sm:py-24">
      <div className="absolute inset-0 opacity-70"><div className="absolute -left-24 top-[-150px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(143,112,164,.18),transparent_70%)]"/><div className="absolute -right-24 bottom-[-200px] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(180,151,93,.12),transparent_70%)]"/></div>
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8"><span className="eyebrow">Cuando quieras</span><h2 className="mt-4 font-serif text-4xl leading-tight text-[#f1e7d8] sm:text-5xl">No hace falta tener<br/><em className="text-[#c9b5d9]">todo resuelto para empezar.</em></h2><p className="mx-auto mt-5 max-w-lg leading-7 text-[#bdb2c6]">Podés escribirme con una pregunta, una duda o simplemente para saber cómo funciona.</p>
        <ContactLink id="cta-final-whatsapp" location="final" className="mt-8 inline-flex min-h-[54px] items-center justify-center gap-3 rounded-full bg-[#25D366] px-8 text-sm font-bold text-[#102017] transition hover:bg-[#1EBE5D]"><MessageCircle size={18}/>Escribime por WhatsApp <ArrowRight size={16}/></ContactLink>
        <p className="mt-4 text-[11px] text-[#a79aaf]">Orientación inicial sin costo · sin compromiso</p>
      </div>
    </section>

    <footer className="bg-[#14101c] pb-24 pt-12 sm:pb-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-9 sm:flex-row sm:items-center">
          <div><a href="#inicio" className="font-serif text-xl text-[#eee3d4]">Alicia Rosales Tarot</a><p className="mt-2 text-xs text-[#9f94a7]">Una mirada amable, en Córdoba, Argentina.</p></div>
          <a href={siteData.socialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#cfbf91] transition hover:text-[#ead9a5]"><span className="grid h-8 w-8 place-items-center rounded-full border border-[#8e7b56]/50 text-xs">ig</span>{siteData.socialHandle}</a>
        </div>
        <div className="flex flex-col gap-4 pt-6 text-[10px] leading-5 text-[#82788a] sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-[11px] leading-5 sm:text-xs">Sitio exclusivo para mayores de 18 años. Los servicios de tarot, orientación espiritual y rituales de Magia Blanca y Roja tienen fines de acompañamiento espiritual y entretenimiento. Los resultados pueden variar de persona a persona y no sustituyen asesoramiento médico, psicológico ni legal. Al enviar un mensaje, aceptás nuestra política de privacidad.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[#b4a7bb]"><button data-testid="button-privacy-policy" onClick={() => setLegal('privacy')} className="hover:text-[#e3cc91]">Política de Privacidad</button><button data-testid="button-terms" onClick={() => setLegal('terms')} className="hover:text-[#e3cc91]">Términos y Condiciones</button><button data-testid="button-legal-notice" onClick={() => setLegal('legal')} className="hover:text-[#e3cc91]">Aviso Legal</button></div>
        </div>
        <div className="mt-7 flex items-center justify-between text-[10px] text-[#655d6d]"><span>© {new Date().getFullYear()} Alicia Rosales Tarot</span><span>Con presencia y respeto.</span></div>
      </div>
    </footer>
    <ContactLink id="cta-floating-whatsapp" location="floating-desktop" className="fixed bottom-7 right-7 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#102017] shadow-[0_8px_30px_rgba(20,92,55,.36)] transition hover:scale-105 hover:bg-[#1EBE5D] md:flex" ariaLabel="Escribime por WhatsApp"><MessageCircle size={22}/></ContactLink>
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#120821]/95 p-3 backdrop-blur-md md:hidden"><ContactLink id="cta-sticky-mobile-whatsapp" location="sticky-mobile" className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-[#102017] transition hover:bg-[#1EBE5D]"><MessageCircle size={17}/>Lectura gratis por WhatsApp</ContactLink></div>
    <LegalDialog kind={legal} close={closeLegal}/>
  </main>;
}

export default App;
