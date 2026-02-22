'use client';
import { useState } from 'react';
import { t, Lang } from './translations';
import { ArrowRight, Check, Menu, X, Globe, Shield, Smartphone } from 'lucide-react';

export default function Home() {
  const [lang, setLang] = useState<Lang>('fr');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', business: '', email: '', phone: '', country: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle'|'loading'|'success'|'error'|'duplicate'>('idle');
  const T = t[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://kabrak-exchange-pro-production.up.railway.app';
      const res = await fetch(`${apiUrl}/api/licenses/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: formData.business, ownerName: formData.name, ownerEmail: formData.email, ownerPhone: formData.phone, country: formData.country, message: formData.message }),
      });
      if (res.ok) {
        setFormStatus('success');
      } else if (res.status === 409) {
        setFormStatus('duplicate');
      } else {
        setFormStatus('error');
      }
    } catch { setFormStatus('error'); }
  };

  const set = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#071a12' }}>

      {/* ── NAVBAR ── */}
      <nav className="nav-blur fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.3)' }}>
              <span className="text-lg">💱</span>
            </div>
            <span className="font-bold text-white text-lg">KABRAK <span style={{ color: '#e8a020' }}>Exchange Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {([['#features', T.nav.features], ['#pricing', T.nav.pricing], ['#contact', T.nav.contact], ['#privacy', T.nav.privacy]] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-slate-300 hover:text-white transition-colors">{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold" style={{ background: 'rgba(232,160,32,0.15)', color: '#e8a020', border: '1px solid rgba(232,160,32,0.3)' }}>
              <Globe size={14} />{lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <a href="#contact" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: '#0B6E4F' }}>
              {T.nav.demo} <ArrowRight size={14} />
            </a>
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {([['#features', T.nav.features], ['#pricing', T.nav.pricing], ['#contact', T.nav.contact], ['#privacy', T.nav.privacy]] as [string,string][]).map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="text-slate-300 py-2 text-sm">{label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#0B6E4F' }}>
              {T.nav.demo}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6" style={{ background: 'linear-gradient(135deg, #071a12 0%, #0a3d22 50%, #071a12 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(232,160,32,0.12)', color: '#e8a020', border: '1px solid rgba(232,160,32,0.25)' }}>
            <Smartphone size={14} /> {T.hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {T.hero.title}<br />
            <span style={{ color: '#e8a020' }}>{T.hero.titleGold}</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">{T.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-105" style={{ background: '#0B6E4F', boxShadow: '0 8px 30px rgba(11,110,79,0.4)' }}>
              {T.hero.cta} <ArrowRight size={18} />
            </a>
            <a href="#features" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
              {T.hero.ctaSub}
            </a>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {([['500+', T.hero.stat1], ['20+', T.hero.stat2], ['99.9%', T.hero.stat3]] as [string,string][]).map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: '#e8a020' }}>{val}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.features.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">{T.features.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {T.features.items.map((f) => (
              <div key={f.title} className="feature-card rounded-2xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(11,110,79,0.5), transparent)' }} />

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.pricing.title}</h2>
            <p className="text-slate-400">{T.pricing.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {T.pricing.plans.map((plan) => (
              <div key={plan.name} className={`pricing-card rounded-2xl p-8 flex flex-col${plan.highlight ? ' popular' : ''}`}>
                {plan.highlight && (
                  <div className="inline-flex self-start px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: '#0B6E4F', color: 'white' }}>
                    {T.pricing.popular}
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold" style={{ color: plan.highlight ? '#e8a020' : 'white' }}>{plan.price}</span>
                  {'currency' in plan && plan.currency && <span className="text-sm text-slate-400">{plan.currency}</span>}
                </div>
                <div className="text-sm text-slate-400 mb-2">{plan.period}</div>
                <p className="text-sm text-slate-400 mb-6">{plan.desc}</p>
                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check size={15} style={{ color: '#0B6E4F', flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm" style={plan.highlight ? { background: '#0B6E4F', color: 'white' } : { background: 'rgba(255,255,255,0.08)', color: 'white' }}>
                  {T.pricing.cta} <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(11,110,79,0.5), transparent)' }} />

      {/* ── CONTACT / DEMO FORM ── */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.contact.title}</h2>
            <p className="text-slate-400">{T.contact.subtitle}</p>
          </div>
          {formStatus === 'success' ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(11,110,79,0.15)', border: '1px solid rgba(11,110,79,0.4)' }}>
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg font-semibold text-white">{T.contact.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-2xl p-8 flex flex-col gap-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.contact.name} *</label>
                  <input required value={formData.name} onChange={e => set('name', e.target.value)} placeholder={T.contact.namePlaceholder} className="px-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.contact.business} *</label>
                  <input required value={formData.business} onChange={e => set('business', e.target.value)} placeholder={T.contact.businessPlaceholder} className="px-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.contact.email} *</label>
                  <input required type="email" value={formData.email} onChange={e => set('email', e.target.value)} placeholder={T.contact.emailPlaceholder} className="px-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.contact.phone}</label>
                  <input value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder={T.contact.phonePlaceholder} className="px-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.contact.country}</label>
                  <input value={formData.country} onChange={e => set('country', e.target.value)} placeholder={T.contact.countryPlaceholder} className="px-4 py-3 rounded-xl text-sm" />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{T.contact.message}</label>
                  <textarea rows={4} value={formData.message} onChange={e => set('message', e.target.value)} placeholder={T.contact.messagePlaceholder} className="px-4 py-3 rounded-xl text-sm resize-none" />
                </div>
              </div>
              {formStatus === 'error' && <p className="text-sm" style={{ color: '#f87171' }}>{T.contact.error}</p>}
              {formStatus === 'duplicate' && <p className="text-sm" style={{ color: '#fbbf24' }}>{lang === 'fr' ? '⚠️ Cet email a déjà soumis une demande. Nous vous contacterons bientôt.' : '⚠️ This email already has a pending request. We will contact you soon.'}</p>}
              <button type="submit" disabled={formStatus === 'loading'} className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white disabled:opacity-60" style={{ background: '#0B6E4F', boxShadow: '0 8px 25px rgba(11,110,79,0.35)' }}>
                {formStatus === 'loading' ? T.contact.submitting : <>{T.contact.submit} <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </section>

      <div className="mx-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(11,110,79,0.5), transparent)' }} />

      {/* ── PRIVACY POLICY ── */}
      <section id="privacy" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-2">{T.privacy.title}</h2>
          <p className="text-slate-400 mb-10">{T.privacy.subtitle}</p>
          <div className="flex flex-col gap-8 text-slate-300">
            {[
              {
                title: lang === 'fr' ? '1. Données collectées' : '1. Data collected',
                body: lang === 'fr'
                  ? "Nous collectons uniquement les données nécessaires au fonctionnement de l'application : nom, email, téléphone, nom du bureau de change et données de transactions. Aucune donnée personnelle n'est vendue à des tiers."
                  : "We only collect data necessary for the operation of the application: name, email, phone, exchange office name and transaction data. No personal data is sold to third parties.",
              },
              {
                title: lang === 'fr' ? '2. Utilisation des données' : '2. Use of data',
                body: lang === 'fr'
                  ? "Les données sont utilisées exclusivement pour fournir les services de l'application KABRAK Exchange Pro : gestion des transactions, génération de rapports et reçus, et communication avec les clients."
                  : "Data is used exclusively to provide KABRAK Exchange Pro application services: transaction management, report and receipt generation, and client communication.",
              },
              {
                title: lang === 'fr' ? '3. Stockage et sécurité' : '3. Storage and security',
                body: lang === 'fr'
                  ? "Toutes les données sont stockées sur des serveurs sécurisés. Les mots de passe sont chiffrés avec bcrypt. Les communications sont sécurisées via HTTPS/TLS."
                  : "All data is stored on secure servers. Passwords are encrypted with bcrypt. Communications are secured via HTTPS/TLS.",
              },
              {
                title: lang === 'fr' ? '4. Partage des données' : '4. Data sharing',
                body: lang === 'fr'
                  ? "Nous ne partageons pas vos données avec des tiers, sauf obligation légale. Les reçus PDF générés par l'application sont partagés uniquement à la demande explicite de l'utilisateur."
                  : "We do not share your data with third parties, except as required by law. PDF receipts generated by the app are shared only at the explicit request of the user.",
              },
              {
                title: lang === 'fr' ? '5. Vos droits' : '5. Your rights',
                body: lang === 'fr'
                  ? "Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles à tout moment. Contactez-nous à : kabrakeng@gmail.com"
                  : "You have the right to access, modify or delete your personal data at any time. Contact us at: kabrakeng@gmail.com",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="leading-relaxed text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#040f09', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.3)' }}>
                  <span className="text-lg">💱</span>
                </div>
                <span className="font-bold text-white">KABRAK <span style={{ color: '#e8a020' }}>Exchange Pro</span></span>
              </div>
              <p className="text-sm text-slate-400">{T.footer.tagline}</p>
              <p className="text-xs text-slate-500 mt-2">KABRAK ENG</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{T.footer.links}</h4>
              <div className="flex flex-col gap-2">
                {([['#features', T.nav.features], ['#pricing', T.nav.pricing], ['#contact', T.nav.contact]] as [string,string][]).map(([href, label]) => (
                  <a key={href} href={href} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">{T.footer.legal}</h4>
              <div className="flex flex-col gap-2">
                <a href="#privacy" className="text-sm text-slate-400 hover:text-white transition-colors">{T.nav.privacy}</a>
                <a href="mailto:kabrakeng@gmail.com" className="text-sm text-slate-400 hover:text-white transition-colors">kabrakeng@gmail.com</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">{T.footer.company}</p>
            <div className="flex items-center gap-2">
              <Shield size={12} style={{ color: '#0B6E4F' }} />
              <span className="text-xs text-slate-500">{lang === 'fr' ? 'Application sécurisée' : 'Secured application'}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
