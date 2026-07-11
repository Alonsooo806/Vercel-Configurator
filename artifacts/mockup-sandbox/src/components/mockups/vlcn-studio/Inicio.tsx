import React from 'react';
import { ArrowRight, ShieldCheck, Ruler, Droplets } from 'lucide-react';

export default function Inicio() {
  const goToConfigurador = () => {
    window.location.href = '/__mockup/preview/vlcn-studio/ConfiguradorPremium';
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/__mockup/generated_images/vlcn-logo.png" alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl">VLCN STUDIO</h1>
        </div>
        <span className="hidden md:inline-flex text-sm font-mono text-muted-foreground">TALLER TÉCNICO V1.0</span>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2">

          {/* LEFT: COPY */}
          <div className="flex flex-col justify-center px-6 md:px-16 py-20 lg:py-0 order-2 lg:order-1">
            <span className="font-mono text-xs text-accent tracking-widest mb-6">¿QUÉ SOMOS?</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8">
              UN TALLER DE
              <br />
              CUSTOMIZACIÓN
              <br />
              TÉCNICA.
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mb-4">
              VLCN STUDIO no es una tienda de ropa. Somos un taller de precisión donde cada
              prenda se construye a partir de especificaciones reales: gramaje de tela,
              técnica de estampado y ubicación exacta.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md mb-10">
              Cada colaboración pasa por inspección manual antes de salir del taller.
              Diseñas la ficha técnica de tu prenda, nosotros la fabricamos.
            </p>

            <button
              onClick={goToConfigurador}
              className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm font-bold tracking-wide w-fit hover:bg-accent transition-colors"
            >
              ENTRAR AL CONFIGURADOR
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* MINI SPECS */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-md">
              <div className="flex flex-col gap-2">
                <Ruler className="w-4 h-4 text-accent" />
                <span className="font-mono text-[11px] text-muted-foreground leading-tight">FICHA TÉCNICA POR PRENDA</span>
              </div>
              <div className="flex flex-col gap-2">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span className="font-mono text-[11px] text-muted-foreground leading-tight">INSPECCIÓN MANUAL</span>
              </div>
              <div className="flex flex-col gap-2">
                <Droplets className="w-4 h-4 text-accent" />
                <span className="font-mono text-[11px] text-muted-foreground leading-tight">ESTAMPADO DE ALTA DURABILIDAD</span>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE */}
          <div className="relative min-h-[420px] lg:min-h-screen order-1 lg:order-2">
            <img
              src="/__mockup/generated_images/vlcn-inicio-hero.jpg"
              alt="Prenda técnica VLCN Studio"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-background/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP CTA */}
      <section className="px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-[1400px] mx-auto">
        <p className="font-mono text-xs text-muted-foreground tracking-widest text-center md:text-left">
          BASES · ESTAMPADOS · UBICACIÓN · TALLAS — TODO CONFIGURABLE
        </p>
        <button
          onClick={goToConfigurador}
          className="inline-flex items-center gap-3 border border-foreground px-6 py-3 font-mono text-sm font-bold tracking-wide hover:bg-foreground hover:text-background transition-colors"
        >
          VER EL SITIO COMPLETO
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
