import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft,
  CheckCircle2, Ruler, Droplets, Info, Plus, Minus,
  MessageCircle, X, Check, Save, Share2, Package, Eye,
  ShieldCheck, ArrowUpRight, MapPin, Upload
} from 'lucide-react';

// --- MOCK DATA ---
const BASES = [
  { 
    id: 'tee', 
    name: 'CAMISETA MANGA CORTA', 
    price: 4000, 
    specs: '100% Algodón Peinado, 220 g/m²', 
    fitLabel: 'TALLA: S, M, L, XL, 2XL',
    img: `generated_images/vlcn-base-tee.png` 
  },
  { 
    id: 'longsleeve', 
    name: 'SUBE LA FOTO DE TU DISEÑO', 
    price: 5000, 
    specs: '100% Algodón Orgánico, 200 g/m²', 
    fitLabel: 'TALLA: ELIGE LA TALLA QUE QUIERAS',
    img: `generated_images/vlcn-base-longsleeve.jpg` 
  }
];

const COLORS = [
  { id: 'negro', name: 'NEGRO', hex: '#000000', img: `generated_images/vlcn-shirt-negro.png` },
  { id: 'blanco', name: 'BLANCO', hex: '#FFFFFF', img: `generated_images/vlcn-shirt-blanco.png` },
  { id: 'rojo', name: 'ROJO', hex: '#DC2626', img: `generated_images/vlcn-shirt-rojo.png` },
  { id: 'naranjo', name: 'NARANJO', hex: '#F97316', img: `generated_images/vlcn-shirt-naranjo.png` },
  { id: 'amarillo', name: 'AMARILLO', hex: '#EAB308', img: `generated_images/vlcn-shirt-amarillo.png` },
  { id: 'verde', name: 'VERDE', hex: '#16A34A', img: `generated_images/vlcn-shirt-verde.png` },
  { id: 'azul', name: 'AZUL', hex: '#2563EB', img: `generated_images/vlcn-shirt-azul.png` },
  { id: 'violeta', name: 'VIOLETA', hex: '#7C3AED', img: `generated_images/vlcn-shirt-violeta.png` },
];

const PRINTS = [
  { id: 'brutalist', name: 'BRUTALIST ARCHIVE', img: `generated_images/vlcn-print-brutalist.jpg` },
  { id: 'schematic', name: 'CYBER SCHEMATIC', img: `generated_images/vlcn-print-schematic.jpg` }
];

const PLACEMENTS = [
  { id: 'pecho', name: 'PECHO' },
  { id: 'espalda', name: 'ESPALDA' },
  { id: 'manga', name: 'MANGA' }
];

const PRINT_PRICE = 6000;

const COMUNAS_TEMUCO = [
  'Centro',
  'Pedro de Valdivia',
  'Amanecer',
  'Labranza',
  'Pueblo Nuevo',
  'Santa Rosa',
  'Miraflores',
  'Ñielol'
];

const SHIPPING_TIERS = [
  { min: 1, max: 2, price: 3100 },
  { min: 3, max: 10, price: 3650 },
  { min: 11, max: 20, price: 4700 }
];

const formatCLP = (n: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

const getShippingCost = (qty: number) => {
  const tier = SHIPPING_TIERS.find(t => qty >= t.min && qty <= t.max);
  if (tier) return tier.price;
  return qty > 20 ? SHIPPING_TIERS[SHIPPING_TIERS.length - 1].price : SHIPPING_TIERS[0].price;
};

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];

// Tabla de Escalamiento de Estampado (ancho x alto en cm sobre la prenda)
const PRINT_DIMENSIONS_BY_TALLA: Record<string, { w: number; h: number }> = {
  S: { w: 25, h: 35 },
  M: { w: 27, h: 37 },
  L: { w: 29, h: 39 },
  XL: { w: 31, h: 41 },
  '2XL': { w: 33, h: 43 },
};
const PRINT_SIZE_BY_TALLA: Record<string, string> = Object.fromEntries(
  Object.entries(PRINT_DIMENSIONS_BY_TALLA).map(([k, { w, h }]) => [k, `${w} × ${h} cm`])
);
const LOGO_PECHO_SIZE = '10 × 10 cm';

// Ancho real de la prenda (a lo ancho de pecho, extendida) por talla, en cm.
const GARMENT_WIDTH_BY_TALLA: Record<string, number> = {
  S: 50,
  M: 52,
  L: 54,
  XL: 57,
  '2XL': 60,
};

// Regla de oro: el estampado "grande" ocupa siempre ~50-55% del ancho de la prenda,
// sin importar la talla, de modo que la presencia visual del diseño se perciba idéntica
// en todas las tallas (crece en cm absolutos, pero mantiene la misma proporción relativa).
// Esto también garantiza un margen libre de al menos 10cm a cada lado (costuras laterales).
const getPrintWidthRatio = (talla: string) => PRINT_DIMENSIONS_BY_TALLA[talla].w / GARMENT_WIDTH_BY_TALLA[talla];

// Escala relativa (ancho y alto) del estampado según talla, tomando Talla M (27x37cm) como referencia base.
// Se usa únicamente para el alto (que no está definido como % de la prenda), y mantiene el centro fijo.
const PRINT_REF = PRINT_DIMENSIONS_BY_TALLA.M;
const getPrintScale = (talla: string) => ({
  x: PRINT_DIMENSIONS_BY_TALLA[talla].w / PRINT_REF.w,
  y: PRINT_DIMENSIONS_BY_TALLA[talla].h / PRINT_REF.h,
});

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

  const [city, setCity] = useState<'temuco' | 'otra'>('temuco');
  const [comuna, setComuna] = useState('');

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [selectedColor, setSelectedColor] = useState('blanco');
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) return;
    const url = URL.createObjectURL(file);
    setUploadedDesign(url);
  };

  // --- DERIVED STATE ---
  const base = BASES.find(b => b.id === selectedBase)!;
  const print = PRINTS.find(p => p.id === selectedPrint)!;
  const placement = PLACEMENTS.find(p => p.id === selectedPlacement)!;
  const colorIndex = COLORS.findIndex(c => c.id === selectedColor);
  const currentColor = COLORS[colorIndex];
  const previewColor = COLORS.find(c => c.id === hoveredColor) || currentColor;
  const nextColor = () => setSelectedColor(COLORS[(colorIndex + 1) % COLORS.length].id);
  const viewerImg = previewColor.img;
  // El estampado de un diseño propio subido por el cliente siempre sigue la Tabla de Escalamiento
  // completa (S 25×35 … 2XL 33×43), sin excepción de tamaño fijo. La excepción de logo fijo
  // (10×10cm) sólo aplica al placement "pecho" cuando se usa un gráfico de catálogo pequeño.
  const isPechoLogoFijo = selectedPlacement === 'pecho' && !uploadedDesign;
  const printMeasure = isPechoLogoFijo ? LOGO_PECHO_SIZE : PRINT_SIZE_BY_TALLA[size];
  const printScale = isPechoLogoFijo ? { x: 1, y: 1 } : getPrintScale(size);
  // Regla de oro: el ancho visible del estampado se mantiene siempre ~50-55% del ancho de la
  // prenda (constante en todas las tallas), dejando siempre ≥10cm libres a cada costura lateral.
  const printWidthRatioPct = getPrintWidthRatio(size) * 100;
  const printWidthPercent = isPechoLogoFijo
    ? 20 // logo fijo de catálogo (10×10cm), ancho de display constante independiente de la talla
    : selectedPlacement === 'pecho'
      ? printWidthRatioPct * 0.6
      : selectedPlacement === 'espalda'
        ? printWidthRatioPct
        : printWidthRatioPct * 0.4; // manga
  
  const unitPrice = base.price + PRINT_PRICE;
  const subtotal = unitPrice * quantity;
  const isOutsideTemuco = city === 'otra';
  const shipping = isOutsideTemuco ? getShippingCost(quantity) : 0;
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
          onClick={() => { window.location.href = import.meta.env.BASE_URL; }}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <img src={`${import.meta.env.BASE_URL}generated_images/vlcn-logo.png`} alt="VLCN Studio" className="h-8 w-auto object-contain" />
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

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch relative">
        {/* MAIN VIEWER AREA */}
        <main className="w-full lg:w-[65%] min-h-screen">
          
          {/* MAIN VIEWER: concrete background with centered t-shirt */}
          <section className="relative flex-1 flex items-center justify-center min-h-[60vh] lg:min-h-[calc(100vh-73px)] overflow-hidden" style={{ backgroundColor: '#6E6F6A' }}>
            <div className="relative w-full max-w-2xl aspect-square p-8 lg:p-12">
              <img 
                src={viewerImg} 
                alt={`Camiseta - ${previewColor.name}`} 
                className="w-full h-full object-contain drop-shadow-2xl transition-all duration-300 ease-out"
              />
            </div>
          </section>


        </main>

        {/* RIGHT PANEL: specs, color, size, price */}
        <aside className="w-full lg:w-[35%] lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] border-t lg:border-t-0 lg:border-l border-border/40 bg-background p-6 lg:p-10 flex flex-col justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none overflow-y-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Especificaciones</h2>
              <p className="text-sm text-muted-foreground">Camiseta manga corta 100% algodón peinado, 220 g/m².</p>
            </div>
            
            {/* Technical specs */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start border-b border-border/50 pb-4">
                <Droplets className="w-5 h-5 text-muted-foreground shrink-0" />
                <div>
                  <h4 className="font-mono text-xs font-bold mb-1">ESTAMPADO PERSONALIZADO</h4>
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

            {/* Color swatches */}
            <div>
              <h4 className="font-mono text-xs font-bold mb-4">ELIGE TU COLOR:</h4>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      onMouseEnter={() => setHoveredColor(c.id)}
                      onMouseLeave={() => setHoveredColor(null)}
                      className={`w-12 h-12 rounded-full border-2 transition-all shadow-sm ${selectedColor === c.id ? 'border-accent ring-2 ring-accent/30 scale-110' : 'border-border hover:border-foreground/60 hover:scale-105'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 border-l border-border/60 pl-4">
                  <span className="w-12 h-12 rounded-full border border-border/60 shadow-sm" style={{ backgroundColor: currentColor.hex }} />
                  <p className="font-mono text-sm font-bold">COLOR: {currentColor.name}</p>
                </div>
              </div>
            </div>

            {/* Size selection */}
            <div>
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
              <div className="mt-3 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Ruler className="w-3.5 h-3.5 shrink-0" />
                <span>
                  TALLA {size} — MEDIDA DEL ESTAMPADO: <span className="font-bold text-foreground">{printMeasure}</span>
                </span>
              </div>
              <div className="mt-2 font-mono text-[10px] text-muted-foreground/80 leading-relaxed">
                Talla S: 25 × 35 cm (prenda 50cm) · Talla M: 27 × 37 cm (52cm) · Talla L: 29 × 39 cm (54cm) · Talla XL: 31 × 41 cm (57cm) · Talla 2XL: 33 × 43 cm (60cm)
              </div>
            </div>
          </div>

          {/* Bottom: quantity, shipping, price, buttons */}
          <div className="mt-8 space-y-6">
            <div className="pt-6 border-t border-border">
              <p className="font-mono text-[10px] text-muted-foreground mb-2">CANTIDAD</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 border hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="font-mono text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 border hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Ubicación y Envío */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="font-mono text-[10px] text-muted-foreground mb-1 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> UBICACIÓN Y ENVÍO
              </p>

              <select
                className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-xs"
                value={city}
                onChange={e => { setCity(e.target.value as 'temuco' | 'otra'); setComuna(''); }}
              >
                <option value="temuco">TEMUCO</option>
                <option value="otra">OTRA CIUDAD (Región de La Araucanía)</option>
              </select>

              {city === 'temuco' && (
                <select
                  className="w-full p-3 border border-border bg-transparent focus:outline-none focus:border-accent font-mono text-xs"
                  value={comuna}
                  onChange={e => setComuna(e.target.value)}
                >
                  <option value="">SELECCIONA TU SECTOR</option>
                  {COMUNAS_TEMUCO.map(c => (
                    <option key={c} value={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              )}

              {isOutsideTemuco ? (
                <div className="p-4 bg-muted border border-border/50 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-tight">Costos de Envío Región de La Araucanía</h4>
                  <ul className="text-[10px] font-mono space-y-1 pt-1">
                    <li className={quantity >= 1 && quantity <= 2 ? 'text-accent font-bold' : 'text-muted-foreground'}>1 a 2 poleras: {formatCLP(3100)}</li>
                    <li className={quantity >= 3 && quantity <= 10 ? 'text-accent font-bold' : 'text-muted-foreground'}>3 a 10 poleras: {formatCLP(3650)}</li>
                    <li className={quantity >= 11 && quantity <= 20 ? 'text-accent font-bold' : 'text-muted-foreground'}>11 a 20 poleras: {formatCLP(4700)}</li>
                  </ul>
                </div>
              ) : (
                <div className="p-4 border border-accent/40 bg-accent/5 flex items-start gap-3">
                  <Package className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground">Retiro o despacho local gratuito dentro de Temuco.</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="font-mono text-[10px] text-muted-foreground mb-1">TOTAL ESTIMADO</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tighter">{formatCLP(total)}</span>
                <span className="font-mono text-xs text-muted-foreground">CLP</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSaveConfig}
                className="p-4 border border-border hover:border-foreground flex items-center justify-center transition-colors shrink-0"
                title="Guardar Configuración"
              >
                <Save className="w-5 h-5" />
              </button>
              <button onClick={() => setCheckoutOpen(true)} className="bg-foreground text-background font-mono text-sm h-14 px-6 flex-1 flex items-center justify-center gap-2 hover:bg-accent transition-colors group">
                INICIAR PEDIDO <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

      {/* WEBPAY CHECKOUT MODAL */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 font-sans">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)}></div>

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Security band */}
            <div className="h-2 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-teal-400"></div>

            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <div className="leading-none">
                <p className="text-2xl font-black tracking-tight lowercase italic text-purple-800">webpay<span className="text-teal-500">.</span></p>
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">Transbank · Pago Seguro</p>
              </div>
              <button onClick={() => setCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-6">
              {/* Resumen */}
              <div>
                <p className="text-xs text-slate-500">Estás pagando en:</p>
                <p className="font-bold text-slate-900 tracking-tight">VLCN STUDIO</p>
                <div className="mt-4 flex items-baseline justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-mono uppercase text-slate-500">Monto Total</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">{formatCLP(total)}</span>
                </div>
              </div>

              {/* Redirección externa a Webpay */}
              <div className="flex flex-col items-center gap-3 py-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center px-4">
                <ShieldCheck className="w-8 h-8 text-purple-700" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  Serás redirigido al sitio oficial y seguro de <span className="font-bold text-purple-800">Webpay Plus (Transbank)</span> para ingresar los datos de tu tarjeta. VLCN Studio nunca almacena ni ve tu información de pago.
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setCheckoutOpen(false)}
                className="w-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-sm py-4 rounded-xl transition-colors tracking-wide"
              >
                Pagar con Webpay
              </button>

              {/* Link de salida */}
              <button
                onClick={() => { window.location.href = import.meta.env.BASE_URL; }}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
              >
                Anular compra y volver a VLCN STUDIO
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}