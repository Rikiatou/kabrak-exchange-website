'use client';
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Upload, AlertCircle, Camera, FileText, Loader } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type DepositInfo = {
  code: string;
  clientName: string;
  amount: string;
  currency: string;
  bank?: string;
  status: string;
};

type Lang = 'fr' | 'en';

const T = {
  fr: {
    loading: 'Chargement...',
    notFound: 'Code invalide ou expiré.',
    alreadyConfirmed: 'Ce dépôt a déjà été confirmé.',
    title: 'Uploader votre reçu',
    subtitle: 'Prenez une photo ou sélectionnez votre reçu de dépôt bancaire.',
    amount: 'Montant',
    bank: 'Banque',
    ref: 'Référence',
    chooseFile: 'Choisir une photo / PDF',
    changeFile: 'Changer le fichier',
    send: 'Envoyer le reçu',
    sending: 'Envoi en cours...',
    success: 'Reçu envoyé avec succès !',
    successSub: 'L\'opérateur a été notifié et va vérifier votre reçu. Vous pouvez fermer cette page.',
    error: 'Erreur lors de l\'envoi. Veuillez réessayer.',
    fileRequired: 'Veuillez sélectionner un fichier.',
    maxSize: 'Fichier trop volumineux (max 10 MB).',
    dragDrop: 'Glissez votre reçu ici ou cliquez pour sélectionner',
    accepted: 'JPG, PNG, PDF acceptés — max 10 MB',
  },
  en: {
    loading: 'Loading...',
    notFound: 'Invalid or expired code.',
    alreadyConfirmed: 'This deposit has already been confirmed.',
    title: 'Upload your receipt',
    subtitle: 'Take a photo or select your bank deposit receipt.',
    amount: 'Amount',
    bank: 'Bank',
    ref: 'Reference',
    chooseFile: 'Choose a photo / PDF',
    changeFile: 'Change file',
    send: 'Send receipt',
    sending: 'Sending...',
    success: 'Receipt sent successfully!',
    successSub: 'The operator has been notified and will verify your receipt. You can close this page.',
    error: 'Error sending. Please try again.',
    fileRequired: 'Please select a file.',
    maxSize: 'File too large (max 10 MB).',
    dragDrop: 'Drag your receipt here or click to select',
    accepted: 'JPG, PNG, PDF accepted — max 10 MB',
  },
};

export default function UploadPage({ params }: { params: { code: string } }) {
  const [lang, setLang] = useState<Lang>('fr');
  const [deposit, setDeposit] = useState<DepositInfo | null>(null);
  const [loadError, setLoadError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [businessName, setBusinessName] = useState('KABRAK Exchange Pro');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = T[lang];
  const code = params.code.toUpperCase();

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/deposits/public/${code}`).then(r => r.json()),
      fetch(`${API}/api/settings/public`).then(r => r.json()).catch(() => ({})),
    ]).then(([data, settings]) => {
      if (settings?.success && settings?.data?.businessName) setBusinessName(settings.data.businessName);
      if (data.success) setDeposit(data.data);
      else setLoadError(data.message || t.notFound);
    }).catch(() => setLoadError(t.notFound))
      .finally(() => setPageLoading(false));
  }, [code]);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) { setErrorMsg(t.maxSize); return; }
    setFile(f);
    setErrorMsg('');
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setErrorMsg(t.fileRequired); return; }
    setStatus('uploading');
    setErrorMsg('');
    const formData = new FormData();
    formData.append('receipt', file);
    try {
      const res = await fetch(`${API}/api/deposits/public/${code}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) setStatus('success');
      else { setStatus('error'); setErrorMsg(data.message || t.error); }
    } catch {
      setStatus('error');
      setErrorMsg(t.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#071a12', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Lang toggle */}
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <button
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          style={{ background: 'rgba(232,160,32,0.15)', color: '#e8a020', border: '1px solid rgba(232,160,32,0.3)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
        >
          {lang === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>

      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>💱</div>
        <div style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>
          {businessName}
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 480, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>

        {/* Loading */}
        {pageLoading && (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>
            <Loader size={32} style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <p>{t.loading}</p>
          </div>
        )}

        {/* Error loading */}
        {!pageLoading && loadError && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#f87171', fontWeight: 600 }}>{loadError}</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <CheckCircle size={64} color="#0B6E4F" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>{t.success}</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{t.successSub}</p>
          </div>
        )}

        {/* Main form */}
        {!pageLoading && !loadError && deposit && status !== 'success' && (
          <>
            {/* Deposit info */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>{t.title}</h1>
              <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>{t.subtitle}</p>

              <div style={{ background: 'rgba(11,110,79,0.12)', border: '1px solid rgba(11,110,79,0.3)', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{t.ref}</span>
                  <span style={{ color: '#e8a020', fontWeight: 800, fontSize: 15, letterSpacing: 2 }}>{deposit.code}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>Client</span>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{deposit.clientName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>{t.amount}</span>
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                    {parseFloat(deposit.amount).toLocaleString('fr-FR')} {deposit.currency}
                  </span>
                </div>
                {deposit.bank && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: 13 }}>{t.bank}</span>
                    <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{deposit.bank}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? '#0B6E4F' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 16,
                padding: 32,
                textAlign: 'center',
                cursor: 'pointer',
                background: dragging ? 'rgba(11,110,79,0.1)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
                marginBottom: 16,
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                capture="environment"
              />

              {preview ? (
                <img src={preview} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 12, marginBottom: 12, objectFit: 'contain' }} />
              ) : file ? (
                <div style={{ marginBottom: 12 }}>
                  <FileText size={48} color="#0B6E4F" style={{ margin: '0 auto 8px' }} />
                  <p style={{ color: '#0B6E4F', fontWeight: 600, fontSize: 14 }}>{file.name}</p>
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <Camera size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>{t.dragDrop}</p>
                </div>
              )}

              <span style={{ fontSize: 12, color: '#64748b' }}>{file ? t.changeFile : t.accepted}</span>
            </div>

            {errorMsg && (
              <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{errorMsg}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === 'uploading'}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 16,
                background: status === 'uploading' ? '#0a5c42' : '#0B6E4F',
                color: 'white',
                fontWeight: 800,
                fontSize: 16,
                border: 'none',
                cursor: status === 'uploading' ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.2s',
                opacity: status === 'uploading' ? 0.7 : 1,
              }}
            >
              {status === 'uploading' ? (
                <>{t.sending}</>
              ) : (
                <><Upload size={18} /> {t.send}</>
              )}
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p style={{ color: '#334155', fontSize: 12, marginTop: 24 }}>{businessName} © {new Date().getFullYear()} — Powered by KABRAK Exchange Pro</p>
    </div>
  );
}
