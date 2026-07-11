import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft,
  CheckCircle2, Ruler, Droplets, Info, Plus, Minus,
  MessageCircle, X, Check, Save, Share2, Package, Eye,
  ShieldCheck, ArrowUpRight
} from 'lucide-react';

// --- MOCK DATA ---
const BASES = [
  { 
    id: 'tee', 
    name: 'CAMISETA MANGA CORTA', 
    price: 45, 
    specs: '100% Algodón Peinado, 220 g/m²', 
    fitLabel: 'TALLA: S, M, L, XL, XXL',
    img: '/__mockup/generated_images/vlcn-base-tee.jpg' 
  },
  { 
    id: 'hoodie', 
    name: 'TECH FLEECE HOODIE', 
    price: 85, 
    specs: 'Algodón/Poliéster 400 g/m²', 
    fitLabel: 'FIT: Relaxed',
    img: '/__mockup/generated_images/vlcn-base-hoodie.jpg' 
  },
  { 
    id: 'longsleeve', 
    name: 'SUBE LA FOTO DE TU DISEÑO', 
    price: 55, 
    specs: '100% Algodón Orgánico, 200 g/m²', 
    fitLabel: 'TALLA: ELIGE LA TALLA QUE QUIERAS',
    img: '/__mockup/generated_images/vlcn-base-longsleeve.jpg' 
  }
];

const PRINTS = [
  { id: 'brutalist', name: 'BRUTALIST ARCHIVE', img: '/__mockup/generated_images/vlcn-print-brutalist.jpg' },
  { id: 'schematic', name: 'CYBER SCHEMATIC', img: '/__mockup/generated_images/vlcn-print-schematic.jpg' }
];

const PLACEMENTS = [
  { id: 'pecho', name: 'PECHO', price: 10 },
  { id: 'espalda', name: 'ESPALDA', price: 15 },
  { id: 'manga', name: 'MANGA', price: 8 }
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ConfiguradorPremium() {
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState(BASES[0].id);
  const [selectedPrint, setSelectedPrint] = useState(PRINTS[0].id);
  const [selectedPlacement, setSelectedPlacement] = useState(PLACEMENTS[0].id);
  const [size, setSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  
  const [savedConfigs, setSavedConfigs] = useState<any[]>([]);
  const [showSavedToast, setShowSavedToast] = useState(false);
  
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waForm, setWaForm] = useState({ intent: '', deadline: '', qty: '' });

  // --- DERIVED STATE ---
  const base = BASES.find(b => b.id === selectedBase)!;
  const print = PRINTS.find(p => p.id === selectedPrint)!;
  const placement = PLACEMENTS.find(p => p.id === selectedPlacement)!;
  
  const unitPrice = base.price + placement.price;
  const subtotal = unitPrice * quantity;
  const shipping = quantity >= 2 ? 0 : 15;
  const total = subtotal + shipping;

  // --- HANDLERS ---
  const handleSaveConfig = () => {
    setSavedConfigs(prev => [...prev, { base, print, placement, size, quantity }]);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const handleWAContact = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola VLCN STUDIO. Me interesa una colaboración técnica.
- Uso: ${waForm.intent}
- Fecha límite: ${waForm.deadline}
- Cantidad aprox: ${waForm.qty}

Configuración actual: ${base.name} (${size}) + Print ${print.name} en ${placement.name}.`;
    
    window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
    setWaModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white pb-32 lg:pb-0">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => { window.location.href = '/__mockup/preview/vlcn-studio/Inicio'; }}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <img src="/__mockup/generated_images/vlcn-logo.png" alt="VLCN Studio" className="h-8 w-auto object-contain" />
          <h1 className="font-bold tracking-tighter text-xl">VLCN STUDIO</h1>
        </button>
        <div className="flex items-center gap-6 text-sm font-mono">
          <span className="hidden md:inline-flex text-muted-foreground">TALLER TÉCNICO V1.0</span>
          <button className="flex items-center gap-2 hover:text-accent transition-colors relative">
            <Save className="w-4 h-4" />
            <span>WISHLIST</span>
            {savedConfigs.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedConfigs.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed top-20 right-6 z-50 bg-foreground text-background px-4 py-3 shadow-2xl flex items-center gap-3 transition-all duration-300 transform ${showSavedToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 className="w-4 h-4 text-accent" />
        <span className="font-mono text-xs">CONFIGURACIÓN GUARDADA</span>
      </div>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-start relative">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <main className="w-full lg:w-[70%] lg:border-r border-border/40 min-h-screen">
          
          {/* WIZARD SECTION */}
          <section className="p-6 md:p-12 border-b border-border/40">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold tracking-tighter uppercase">Configurador</h2>
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className={step === 1 ? 'text-accent font-bold' : 'text-muted-foreground'}>01. BASE</span>
                <span className="text-muted-foreground">/</span>
                <span className={step === 2 ? 'text-accent font-bold' : 'text-muted-foreground'}>02. PRINT</span>
              </div>
            </div>

            {/* STEP 1: BASE SELECTION */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6">
                  <h3 className="font-mono text-sm text-muted-foreground mb-1">SELECCIONA EL LIENZO</h3>
                  <p className="text-xl">Todas las bases pasan por un proceso de lavado enzimático.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {BASES.map(b => (
                    <button 
                      key={b.id}
                      onClick={() => setSelectedBase(b.id)}
                      className={`group text-left relative border p-4 transition-all duration-300 ${selectedBase === b.id ? 'border-accent ring-1 ring-accent' : 'border-border hover:border-foreground/50'}`}
                    >
                      <div className="aspect-square bg-muted mb-4 overflow-hidden relative">
                        <img src={b.img} alt={b.name} className={`w-full h-full object-cover transition-transform duration-700 ${selectedBase === b.id ? 'scale-105' : 'group-hover:scale-110'}`} />
                      </div>
                      <h4 className="font-bold tracking-tight mb-2">{b.name}</h4>
                      <div className="font-mono text-xs text-muted-foreground space-y-1">
                        <p>{b.specs}</p>
                        <p>{b.fitLabel}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => setStep(2)}
                    className="bg-foreground text-background px-8 py-4 flex items-center gap-3 hover:bg-accent hover:text-white transition-colors group font-mono text-sm"
                  >
                    SIGUIENTE PASO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PRINT & PLACEMENT */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> VOLVER A BASE
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Print Selector */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-4">SELECCIONA EL GRÁFICO</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {PRINTS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedPrint(p.id)}
                          className={`group text-left border p-2 transition-all ${selectedPrint === p.id ? 'border-accent' : 'border-border'}`}
                        >
                          <div className="aspect-[3/4] bg-muted mb-2 overflow-hidden">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="font-mono text-[10px] leading-tight font-bold">{p.name}</h4>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Placement Selector */}
                  <div>
                    <h3 className="font-mono text-sm text-muted-foreground mb-4">UBICACIÓN TÉCNICA</h3>
                    <div className="space-y-3">
                      {PLACEMENTS.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedPlacement(p.id)}
                          className={`w-full flex items-center justify-between p-4 border transition-all ${selectedPlacement === p.id ? 'border-accent bg-accent/5' : 'border-border hover:border-foreground/50'}`}
                        >
                          <span className="font-mono text-sm">{p.name}</span>
                          <span className="font-mono text-xs text-muted-foreground">+{p.price} USD</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 p-6 bg-muted border border-border/50">
                      <div className="flex items-start gap-4">
                        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Inspección Manual</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">Cada impresión es curada térmicamente a 160°C y revisada bajo luz industrial para garantizar adherencia y fidelidad de color antes del empaque.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* FICHA TÉCNICA Y VISUALIZADOR */}
          <section className="p-6 md:p-12 border-b border-border/40 bg-[#FAFAFA]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* High Fidelity Viewer */}
              <div className="relative group overflow-hidden border border-border aspect-[4/5] bg-white cursor-crosshair">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="bg-background/80 backdrop-blur font-mono text-[10px] px-3 py-1 border border-border">INSPECCIÓN X-RAY</div>
                </div>
                <img 
                  src={base.img} 
                  alt="Vista Detallada" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.35] origin-center"
                />
                {/* Simulated overlay for print preview */}
                <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply opacity-80 pointer-events-none">
                   <img src={print.img} className="w-1/3 transition-transform duration-1000 group-hover:scale-[1.35]" style={{
                     transform: selectedPlacement === 'pecho' ? 'translateY(-20%) scale(0.6)' : 
                                selectedPlacement === 'espalda' ? 'scale(1)' : 'translateX(-30%) translateY(-10%) scale(0.4)'
                   }} />
                </div>
              </div>

              {/* Technical Specs & Sizing */}
              <div>
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-8">Especificaciones</h2>
                
                <div className="space-y-6 mb-10">
                  <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                    <Droplets className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold mb-1">TÉCNICA DE IMPRESIÓN</h4>
                      <p className="text-sm">Serigrafía Alta Densidad / DTF Industrial. Estabilidad dimensional garantizada &lt;3% de encogimiento tras 50 lavados.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                    <ShieldCheck className="w-5 h-5 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-mono text-xs font-bold mb-1">RESISTENCIA</h4>
                      <p className="text-sm">Curado a 160°C. Resiste fricción mecánica y lavados abrasivos sin craquelado prematuro.</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <h4 className="font-mono text-xs font-bold">SELECCIÓN DE TALLA (EU)</h4>
                    <button className="flex items-center gap-1 font-mono text-[10px] text-accent hover:underline">
                      <Ruler className="w-3 h-3" /> VER TABLA COMPARATIVA
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {SIZES.map(s => (
                      <button 
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-3 font-mono text-sm border transition-colors ${size === s ? 'bg-foreground text-background border-foreground' : 'bg-background hover:border-foreground/40'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          </section>

          {/* ESTADO DE MI COLABORACIÓN (CUSTOMER DASHBOARD) */}
          <section className="p-6 md:p-12 border-b border-border/40">
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Flujo de Producción</h2>
            <p className="text-muted-foreground mb-12">Monitoreo transparente de tu encargo en nuestro taller.</p>
            
            <div className="relative">
              {/* Line connector */}
              <div className="absolute left-[15px] md:left-[50%] top-0 bottom-0 w-px bg-border/50 md:-translate-x-1/2"></div>
              
              <div className="space-y-8 relative">
                {[
                  { state: 'Solicitud Recibida', desc: 'Confirmación de especificaciones y pago.', date: 'HOY', active: true, done: true },
                  { state: 'Impresión & Curado', desc: 'Ejecución en taller. Espera en fila de producción.', date: 'ESTIMADO: +2 DÍAS', active: true, done: false },
                  { state: 'Control de Calidad', desc: 'Inspección lumínica y estrés térmico.', date: 'PENDIENTE', active: false, done: false },
                  { state: 'Despacho CERRADO', desc: 'Generación de tracking y empaque sellado.', date: 'PENDIENTE', active: false, done: false },
                ].map((s, i) => (
                  <div key={i} className={`relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-12 w-full ${!s.active && 'opacity-50 grayscale'}`}>
                    <div className="md:w-1/2 flex justify-end text-left md:text-right pl-12 md:pl-0">
                      <div>
                        <h4 className="font-bold uppercase tracking-tight">{s.state}</h4>
                        <p className="text-sm text-muted-foreground hidden md:block">{s.desc}</p>
                      </div>
                    </div>
                    
                    {/* Node */}
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-2 flex items-center justify-center shrink-0 z-10 shadow-[0_0_0_4px_hsl(var(--background))]">
                      {s.done ? (
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      ) : s.active ? (
                        <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-2 h-2 bg-border rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="md:w-1/2 text-left pl-12 md:pl-0">
                      <span className="font-mono text-xs bg-muted px-2 py-1 border border-border/50">{s.date}</span>
                      <p className="text-sm text-muted-foreground block md:hidden mt-1">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RESEÑAS CURADAS */}
          <section className="p-6 md:p-12">
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Desgaste Real</h2>
            <p className="text-muted-foreground mb-12 max-w-xl">No escondemos el paso del tiempo. Así se ven nuestras impresiones industriales tras meses de uso continuo y lavados abrasivos.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative overflow-hidden border border-border">
                <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 font-mono text-[10px] z-10 border border-border">50+ LAVADOS</div>
                <img src="/__mockup/generated_images/vlcn-review-wear.jpg" alt="Wear Detail" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="p-4 bg-muted border-t border-border">
                  <p className="text-sm italic">"El degradado natural que toma el estampado le da más carácter. Ningún craquelado estructural."</p>
                  <p className="font-mono text-xs mt-2 font-bold">— TEST 01 / CLIENTE A.</p>
                </div>
              </div>
              <div className="group relative overflow-hidden border border-border md:translate-y-12">
                <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 font-mono text-[10px] z-10 border border-border">USO DIARIO (6 MESES)</div>
                <img src="/__mockup/generated_images/vlcn-review-editorial.jpg" alt="Editorial Wear" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="p-4 bg-muted border-t border-border">
                  <p className="text-sm italic">"La tela se suaviza pero el fit cuadrado se mantiene intacto. El cuello no ha cedido ni un milímetro."</p>
                  <p className="font-mono text-xs mt-2 font-bold">— TEST 02 / ESTUDIO M.</p>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* RIGHT COLUMN: STICKY PRICE TRACKER (Sidebar on Desktop, Footer on Mobile) */}
        <aside className="w-full lg:w-[30%] lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] border-t lg:border-t-0 border-border/40 bg-background lg:bg-transparent fixed bottom-0 left-0 z-40 p-6 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none">
          
          <div className="hidden lg:block space-y-6 flex-1 overflow-y-auto pr-2 pb-6">
            <h3 className="font-mono text-sm text-muted-foreground border-b border-border pb-4">RESUMEN TÉCNICO</h3>
            
            {/* Summary Items */}
            <div className="space-y-4">
              <div>
                <p className="font-mono text-[10px] text-muted-foreground mb-1">PRENDA BASE</p>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm max-w-[70%]">{base.name}</p>
                  <p className="font-mono text-sm">${base.price}</p>
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-muted-foreground mb-1">IMPRESIÓN & UBICACIÓN</p>
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm max-w-[70%]">{print.name} ({placement.name})</p>
                  <p className="font-mono text-sm">+${placement.price}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="font-mono text-[10px] text-muted-foreground mb-2">CANTIDAD</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="font-mono text-lg w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 border hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Shipping logic */}
            <div className={`p-4 border ${quantity >= 2 ? 'border-accent bg-accent/5' : 'border-border/50'} flex items-start gap-3 mt-6`}>
              <Package className={`w-5 h-5 shrink-0 ${quantity >= 2 ? 'text-accent' : 'text-muted-foreground'}`} />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-tight">Logística</h4>
                {quantity >= 2 ? (
                  <p className="text-xs text-accent font-bold mt-1">Envío Nacional Gratuito Desbloqueado.</p>
                ) : (
                  <p className="text-[10px] text-muted-foreground mt-1">Costo estándar $15. Agrega 1 prenda más para envío gratis.</p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile minimal view & Desktop total */}
          <div className="flex lg:flex-col items-center lg:items-stretch justify-between gap-4 lg:gap-6 lg:border-t lg:border-border lg:pt-6 bg-background">
            <div className="flex-1 lg:flex-none">
              <p className="font-mono text-[10px] text-muted-foreground hidden lg:block mb-1">TOTAL ESTIMADO</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">${total}</span>
                <span className="font-mono text-xs text-muted-foreground">USD</span>
              </div>
              <p className="text-[10px] text-muted-foreground lg:hidden">Base + Print {quantity >= 2 ? '+ Envío Gratis' : '+ Envío'}</p>
            </div>
            
            <div className="flex gap-2 flex-col lg:flex-row lg:w-full w-auto">
              <button 
                onClick={handleSaveConfig}
                className="p-4 border border-border hover:border-foreground flex items-center justify-center transition-colors lg:w-16 w-12 h-12 lg:h-auto shrink-0"
                title="Guardar Configuración"
              >
                <Save className="w-5 h-5" />
              </button>
              <button className="bg-foreground text-background font-mono text-sm h-12 lg:h-14 px-6 flex-1 flex items-center justify-center gap-2 hover:bg-accent transition-colors group">
                <span className="hidden sm:inline">INICIAR PEDIDO</span>
                <span className="sm:hidden">PEDIR</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

        </aside>

      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <button 
        onClick={() => setWaModalOpen(true)}
        className="fixed bottom-32 right-6 lg:bottom-8 lg:right-[32%] z-50 bg-foreground text-background p-4 rounded-full shadow-2xl hover:bg-accent transition-transform hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-foreground text-background text-xs font-mono px-3 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded">Asesoría Directa</span>
      </button>

      {/* WHATSAPP PRE-FILTER MODAL */}
      {waModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setWaModalOpen(false)}></div>
          
          <div className="relative bg-background border border-border w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <h3 className="font-mono font-bold text-sm uppercase">Filtro de Recepción</h3>
              </div>
              <button onClick={() => setWaModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleWAContact} className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground">Para optimizar nuestra comunicación y tiempos de respuesta, por favor responde 3 preguntas rápidas antes de generar el enlace de WhatsApp.</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase font-bold">1. ¿Propósito del encargo?</label>
                  <select 
                    required
                    className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-sm"
                    value={waForm.intent}
                    onChange={e => setWaForm({...waForm, intent: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Uso Personal">Uso Personal</option>
                    <option value="Regalo">Regalo</option>
                    <option value="Merchandising Marca">Merchandising Marca / Uniforme</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase font-bold">2. ¿Fecha límite estimada?</label>
                  <select 
                    required
                    className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-sm"
                    value={waForm.deadline}
                    onChange={e => setWaForm({...waForm, deadline: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Sin apuro (> 2 semanas)">Sin apuro (Más de 2 semanas)</option>
                    <option value="Normal (1-2 semanas)">Normal (1-2 semanas)</option>
                    <option value="Urgente (< 1 semana)">Urgente (Menos de 1 semana)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs uppercase font-bold">3. Cantidad aproximada</label>
                  <select 
                    required
                    className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-sm"
                    value={waForm.qty}
                    onChange={e => setWaForm({...waForm, qty: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="1-5 unidades">1 a 5 unidades</option>
                    <option value="6-20 unidades">6 a 20 unidades</option>
                    <option value="20+ unidades">Más de 20 unidades</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-accent text-white font-mono text-sm p-4 hover:bg-accent/90 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                Conectar vía WhatsApp <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}