'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Upload, AlertCircle, Camera, FileText, Loader, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://kabrak-exchange-pro-production.up.railway.app';

type Lang = 'fr' | 'en';

type Payment = {
  id: string;
  amount: string;
  currency: string;
  status: string;
  receiptImageUrl?: string;
  receiptUploadedAt?: string;
  confirmedAt?: string;
  createdAt: string;
};

type Order = {
  id: string;
  reference: string;
  clientName: string;
  totalAmount: string;
  receivedAmount: string;
  remainingAmount: string;
  currency: string;
  bank?: string;
  status: string;
  expoPushToken?: string;
  createdAt: string;
  payments: Payment[];
};

type ClientData = {
  id: string;
  clientCode: string;
  name: string;
  phone?: string;
};

const T = {
  fr: {
    loading: 'Chargement...',
    notFound: 'Code client invalide. Vérifiez le lien reçu.',
    welcome: 'Bonjour',
    yourOrders: 'Vos commandes',
    noOrders: 'Aucune commande en cours.',
    total: 'Total',
    received: 'Reçu',
    remaining: 'Reste à payer',
    status: { pending: 'En attente', partial: 'Partiel', completed: 'Complété', cancelled: 'Annulé' },
    payments: 'Versements',
    addPayment: 'Ajouter un versement',
    amount: 'Montant versé (FCFA)',
    amountPlaceholder: 'Ex: 2 000 000',
    receipt: 'Photo du reçu bancaire *',
    chooseFile: 'Prendre une photo ou choisir un fichier',
    changeFile: 'Changer le fichier',
    send: 'Envoyer le versement',
    sending: 'Envoi...',
    success: 'Versement envoyé !',
    successSub: "L'opérateur a été notifié et va vérifier votre reçu.",
    close: 'Fermer',
    error: 'Erreur. Veuillez réessayer.',
    amountRequired: 'Veuillez saisir un montant.',
    receiptRequired: 'Veuillez joindre une photo du reçu.',
    amountExceeds: 'Montant supérieur au reste dû.',
    maxSize: 'Fichier trop volumineux (max 10 MB).',
    bank: 'Banque',
    ref: 'Réf',
    date: 'Date',
    confirmed: 'Confirmé',
    pending_review: 'En attente de confirmation',
    rejected: 'Rejeté',
    receipt_uploaded: 'Reçu envoyé',
    installApp: 'Installer l\'app',
    installDesc: 'Ajoutez cette page à votre écran d\'accueil pour y accéder facilement.',
    installBtn: 'Ajouter à l\'écran d\'accueil',
    orderCompleted: 'Commande complétée ✓',
  },
  en: {
    loading: 'Loading...',
    notFound: 'Invalid client code. Check the link you received.',
    welcome: 'Hello',
    yourOrders: 'Your orders',
    noOrders: 'No active orders.',
    total: 'Total',
    received: 'Received',
    remaining: 'Remaining',
    status: { pending: 'Pending', partial: 'Partial', completed: 'Completed', cancelled: 'Cancelled' },
    payments: 'Payments',
    addPayment: 'Add a payment',
    amount: 'Amount paid (FCFA)',
    amountPlaceholder: 'e.g. 2,000,000',
    receipt: 'Bank receipt photo *',
    chooseFile: 'Take a photo or choose a file',
    changeFile: 'Change file',
    send: 'Send payment',
    sending: 'Sending...',
    success: 'Payment sent!',
    successSub: 'The operator has been notified and will verify your receipt.',
    close: 'Close',
    error: 'Error. Please try again.',
    amountRequired: 'Please enter an amount.',
    receiptRequired: 'Please attach a receipt photo.',
    amountExceeds: 'Amount exceeds remaining balance.',
    maxSize: 'File too large (max 10 MB).',
    bank: 'Bank',
    ref: 'Ref',
    date: 'Date',
    confirmed: 'Confirmed',
    pending_review: 'Pending review',
    rejected: 'Rejected',
    receipt_uploaded: 'Receipt sent',
    installApp: 'Install app',
    installDesc: 'Add this page to your home screen for easy access.',
    installBtn: 'Add to home screen',
    orderCompleted: 'Order completed ✓',
  },
};

const GREEN = '#0B6E4F';
const DARK = '#071a12';
const GOLD = '#e8a020';

const fmt = (n: string | number) => parseFloat(String(n)).toLocaleString('fr-FR');
const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginTop: 8 }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? GREEN : GOLD, borderRadius: 4, transition: 'width 0.5s' }} />
    </div>
  );
}

function PaymentModal({ order, clientCode, lang, t, onClose, onSuccess }: {
  order: Order; clientCode: string; lang: Lang; t: typeof T['fr'];
  onClose: () => void; onSuccess: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { setErrorMsg(t.maxSize); return; }
    setFile(f);
    setErrorMsg('');
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else setPreview(null);
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount.replace(/\s/g, '')) <= 0) { setErrorMsg(t.amountRequired); return; }
    if (!file) { setErrorMsg(t.receiptRequired); return; }
    const amt = parseFloat(amount.replace(/\s/g, ''));
    if (amt > parseFloat(order.remainingAmount)) { setErrorMsg(t.amountExceeds); return; }

    setStatus('sending');
    setErrorMsg('');
    const fd = new FormData();
    fd.append('orderId', order.id);
    fd.append('amount', String(amt));
    fd.append('receipt', file);

    try {
      const res = await fetch(`${API}/api/public/client/${clientCode}/payment`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) { setStatus('success'); }
      else { setStatus('error'); setErrorMsg(data.message || t.error); }
    } catch {
      setStatus('error');
      setErrorMsg(t.error);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#0f2d1e', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>{t.addPayment}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={22} /></button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <CheckCircle size={64} color={GREEN} style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{t.success}</p>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24 }}>{t.successSub}</p>
            <button onClick={() => { onSuccess(); onClose(); }} style={{ background: GREEN, color: 'white', border: 'none', borderRadius: 12, padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{t.close}</button>
          </div>
        ) : (
          <>
            {/* Order summary */}
            <div style={{ background: 'rgba(11,110,79,0.15)', borderRadius: 12, padding: 14, marginBottom: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8' }}>{t.ref}</span>
                <span style={{ color: GOLD, fontWeight: 700 }}>{order.reference}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#94a3b8' }}>{t.total}</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{fmt(order.totalAmount)} {order.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>{t.remaining}</span>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 15 }}>{fmt(order.remainingAmount)} {order.currency}</span>
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>{t.amount}</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={t.amountPlaceholder}
                style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 16px', color: 'white', fontSize: 20, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Receipt */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 8 }}>{t.receipt}</label>
              <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: 12, padding: 24, textAlign: 'center', background: 'rgba(255,255,255,0.03)' }}>
                <input ref={inputRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                {preview ? (
                  <img src={preview} alt="preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, objectFit: 'contain', marginBottom: 12 }} />
                ) : file ? (
                  <><FileText size={36} color={GREEN} style={{ margin: '0 auto 8px' }} /><p style={{ color: GREEN, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{file.name}</p></>
                ) : (
                  <><Camera size={40} color="#94a3b8" style={{ margin: '0 auto 10px' }} /><p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>{t.chooseFile}</p></>
                )}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={() => cameraRef.current?.click()} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: 'rgba(11,110,79,0.2)', border: '1px solid rgba(11,110,79,0.4)', color: '#4ade80', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Camera size={14} /> Photo
                  </button>
                  <button onClick={() => inputRef.current?.click()} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.3)', color: '#e8a020', fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <Upload size={14} /> Galerie
                  </button>
                </div>
              </div>
            </div>

            {errorMsg && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{errorMsg}</p>}

            <button
              onClick={handleSubmit}
              disabled={status === 'sending'}
              style={{ width: '100%', padding: 16, borderRadius: 14, background: status === 'sending' ? '#0a5c42' : GREEN, color: 'white', fontWeight: 800, fontSize: 16, border: 'none', cursor: status === 'sending' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: status === 'sending' ? 0.7 : 1 }}
            >
              {status === 'sending' ? <><Loader size={18} />{t.sending}</> : <><Upload size={18} />{t.send}</>}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, t, lang, clientCode, onRefresh }: { order: Order; t: typeof T['fr']; lang: Lang; clientCode: string; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(order.status !== 'completed');
  const [showModal, setShowModal] = useState(false);

  const total = parseFloat(order.totalAmount);
  const received = parseFloat(order.receivedAmount);
  const remaining = parseFloat(order.remainingAmount);
  const pct = total > 0 ? (received / total) * 100 : 0;
  const isCompleted = order.status === 'completed';

  const statusColor = isCompleted ? GREEN : order.status === 'partial' ? GOLD : '#94a3b8';
  const statusLabel = t.status[order.status as keyof typeof t.status] || order.status;

  const paymentStatusColor = (s: string) => {
    if (s === 'confirmed') return GREEN;
    if (s === 'rejected') return '#dc2626';
    return GOLD;
  };
  const paymentStatusLabel = (s: string) => {
    if (s === 'confirmed') return t.confirmed;
    if (s === 'rejected') return t.rejected;
    return t.pending_review;
  };

  return (
    <>
      <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${isCompleted ? 'rgba(11,110,79,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, marginBottom: 16, overflow: 'hidden' }}>
        {/* Header */}
        <div onClick={() => setExpanded(!expanded)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ color: GOLD, fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>{order.reference}</span>
              <span style={{ background: `${statusColor}22`, color: statusColor, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{statusLabel}</span>
            </div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>{fmt(order.totalAmount)} <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{order.currency}</span></div>
            <ProgressBar pct={pct} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
              <span style={{ color: '#94a3b8' }}>{t.received}: <span style={{ color: 'white', fontWeight: 600 }}>{fmt(received)}</span></span>
              <span style={{ color: GOLD, fontWeight: 700 }}>{t.remaining}: {fmt(remaining)}</span>
            </div>
          </div>
          <div style={{ marginLeft: 12, color: '#94a3b8' }}>{expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
        </div>

        {/* Expanded */}
        {expanded && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 20px' }}>
            {order.bank && (
              <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>{t.bank}: <span style={{ color: 'white' }}>{order.bank}</span></div>
            )}

            {/* Payments list */}
            {order.payments.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>{t.payments}</p>
                {order.payments.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{fmt(p.amount)} {p.currency}</div>
                      <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>{fmtDate(p.createdAt)}</div>
                    </div>
                    <span style={{ background: `${paymentStatusColor(p.status)}22`, color: paymentStatusColor(p.status), fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20 }}>
                      {paymentStatusLabel(p.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add payment button */}
            {!isCompleted && (
              <button
                onClick={() => setShowModal(true)}
                style={{ width: '100%', padding: '14px', borderRadius: 14, background: GREEN, color: 'white', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Upload size={18} /> {t.addPayment}
              </button>
            )}
            {isCompleted && (
              <div style={{ textAlign: 'center', color: GREEN, fontWeight: 700, fontSize: 14, padding: '8px 0' }}>
                <CheckCircle size={16} style={{ display: 'inline', marginRight: 6 }} />{t.orderCompleted}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <PaymentModal
          order={order}
          clientCode={clientCode}
          lang={lang}
          t={t}
          onClose={() => setShowModal(false)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}

export default function ClientPortalPage() {
  const params = useParams();
  const [lang, setLang] = useState<Lang>('fr');
  const [client, setClient] = useState<ClientData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [businessName, setBusinessName] = useState('KABRAK Exchange Pro');

  const code = (params.code as string).toUpperCase();
  const t = T[lang];

  const load = async () => {
    try {
      const [portalRes, settingsRes] = await Promise.all([
        fetch(`${API}/api/public/client/${code}`),
        fetch(`${API}/api/settings/public`),
      ]);
      const data = await portalRes.json();
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.data.businessName) {
        setBusinessName(settingsData.data.businessName);
      }
      if (data.success) {
        setClient(data.data.client);
        setOrders(data.data.orders);
      } else {
        setError(data.message || t.notFound);
      }
    } catch {
      setError(t.notFound);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [code]);

  // Inject a dynamic manifest so "Add to Home Screen" opens /client/[code] not "/"
  useEffect(() => {
    const manifest = {
      name: `${businessName} — Mon Portail`,
      short_name: businessName,
      description: 'Suivez vos commandes et envoyez vos reçus',
      start_url: `/client/${code}`,
      scope: `/client/${code}`,
      display: 'standalone',
      background_color: '#071a12',
      theme_color: '#0B6E4F',
      orientation: 'portrait',
      icons: [
        { src: '/icon-192', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
        { src: '/icon-512', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
    };
    const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const existing = document.querySelector('link[rel="manifest"]');
    if (existing) existing.setAttribute('href', url);
    else {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = url;
      document.head.appendChild(link);
    }
    // Set apple-specific title to client name
    const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (appleTitle) appleTitle.setAttribute('content', `${businessName}`);
    return () => URL.revokeObjectURL(url);
  }, [code, businessName]);

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: DARK, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'rgba(11,110,79,0.15)', borderBottom: '1px solid rgba(11,110,79,0.3)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💱</div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>{businessName}</div>
            {client && <div style={{ color: '#64748b', fontSize: 11 }}>Code: {client.clientCode}</div>}
          </div>
        </div>
        <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} style={{ background: 'rgba(232,160,32,0.15)', color: GOLD, border: '1px solid rgba(232,160,32,0.3)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Install banner */}
        {showInstall && (
          <div style={{ background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>{t.installApp}</div>
              <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{t.installDesc}</div>
            </div>
            <button onClick={handleInstall} style={{ background: GOLD, color: DARK, border: 'none', borderRadius: 10, padding: '8px 14px', fontWeight: 800, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.installBtn}</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <Loader size={36} color={GREEN} style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#94a3b8' }}>{t.loading}</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#f87171', fontWeight: 600, fontSize: 15 }}>{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && client && (
          <>
            {/* Welcome */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ color: '#94a3b8', fontSize: 14 }}>{t.welcome},</p>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: 26, margin: '4px 0 0' }}>{client.name}</h1>
            </div>

            {/* Orders */}
            <p style={{ color: '#94a3b8', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>{t.yourOrders}</p>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <Clock size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <p>{t.noOrders}</p>
              </div>
            ) : (
              orders.map(order => (
                <OrderCard key={order.id} order={order} t={t} lang={lang} clientCode={code} onRefresh={load} />
              ))
            )}
          </>
        )}
      </div>

      <p style={{ textAlign: 'center', color: '#1e3a2a', fontSize: 12, paddingBottom: 24 }}>{businessName} © {new Date().getFullYear()} — Powered by KABRAK Exchange Pro</p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
