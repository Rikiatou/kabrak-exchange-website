'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { t, Lang } from './translations';
import { ArrowRight, Check, Menu, X, Globe, Shield, Smartphone, ChevronDown, AlertTriangle, TrendingDown, Quote } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function Section({ children, className = '', id, style }: { children: React.ReactNode; className?: string; id?: string; style?: React.CSSProperties }) {
  return (
    <motion.section id={id} className={className} style={style} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
      {children}
    </motion.section>
  );
}

function Divider() {
  return <div className="mx-6 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(11,110,79,0.5), transparent)' }} />;
}

const WA_SVG = <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const WA_LINK = 'https://wa.me/237653561862?text=Bonjour%20KABRAK%20ENG%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20KABRAK%20Exchange%20Pro.';

export default function Home() {
  const [lang, setLang] = useState<Lang>('fr');
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', business: '', email: '', phone: '', country: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle'|'loading'|'success'|'error'|'duplicate'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const T = t[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.kabrakeng.com';
      const res = await fetch(`${apiUrl}/api/licenses/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: formData.business, ownerName: formData.name, ownerEmail: formData.email, ownerPhone: formData.phone, country: formData.country, message: formData.message }),
      });
      if (res.ok) setFormStatus('success');
      else if (res.status === 409) setFormStatus('duplicate');
      else setFormStatus('error');
    } catch { setFormStatus('error'); }
  };

  const set = (k: string, v: string) => setFormData(p => ({ ...p, [k]: v }));

  const NAV_LINKS: [string, string][] = [
    ['#features', T.nav.features],
    ['#how-it-works', lang === 'fr' ? 'Comment ça marche' : 'How it works'],
    ['#pricing', T.nav.pricing],
    ['#testimonials', lang === 'fr' ? 'Témoignages' : 'Testimonials'],
    ['#faq', 'FAQ'],
    ['#contact', T.nav.contact],
  ];

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
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(([href, label]) => (
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
            <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden px-6 pb-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="text-slate-300 py-2 text-sm">{label}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#0B6E4F' }}>
              {T.nav.demo}
            </a>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <Section className="pt-32 pb-20 px-6" style={{ background: 'linear-gradient(135deg, #071a12 0%, #0a3d22 50%, #071a12 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: 'rgba(232,160,32,0.12)', color: '#e8a020', border: '1px solid rgba(232,160,32,0.25)' }}>
            <Smartphone size={14} /> {T.hero.badge}
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
            {T.hero.title}<br />
            <span style={{ color: '#e8a020' }}>{T.hero.titleGold}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">{T.hero.subtitle}</motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all hover:scale-105" style={{ background: '#0B6E4F', boxShadow: '0 8px 30px rgba(11,110,79,0.4)' }}>
              {T.hero.cta} <ArrowRight size={18} />
            </a>
            <a href="#features" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}>
              {T.hero.ctaSub}
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {([['500+', T.hero.stat1], ['20+', T.hero.stat2], ['99.9%', T.hero.stat3]] as [string,string][]).map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: '#e8a020' }}>{val}</div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── FEATURES ── */}
      <Section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.features.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">{T.features.subtitle}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {T.features.items.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} custom={i} className="feature-card rounded-2xl p-6">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* ── HOW IT WORKS ── */}
      <Section id="how-it-works" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.howItWorks.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">{T.howItWorks.subtitle}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {T.howItWorks.steps.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="relative">
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(11,110,79,0.2)' }}>
                  <div className="text-5xl font-extrabold mb-4" style={{ color: 'rgba(11,110,79,0.3)' }}>{step.num}</div>
                  <h3 className="font-bold text-white mb-2 text-lg">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight size={16} style={{ color: 'rgba(11,110,79,0.5)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* ── TESTIMONIALS ── */}
      <Section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.testimonials.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">{T.testimonials.subtitle}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {T.testimonials.items.map((item, i) => (
              <motion.div key={item.name} variants={fadeUp} className="rounded-2xl p-6 flex flex-col" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Quote size={24} style={{ color: 'rgba(232,160,32,0.4)' }} className="mb-4" />
                <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-6">&ldquo;{item.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: i === 0 ? '#0B6E4F' : i === 1 ? '#e8a020' : '#0369a1' }}>
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-xs text-slate-400">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* ── PRICING ── */}
      <Section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.pricing.title}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">{T.pricing.subtitle}</p>
          </motion.div>

          {/* Loss calculator card */}
          <motion.div variants={fadeUp} className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-6" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.04) 100%)', border: '1px solid rgba(220,38,38,0.25)' }}>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.15)' }}>
                <TrendingDown size={24} style={{ color: '#f87171' }} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} style={{ color: '#fbbf24' }} />
                <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>{lang === 'fr' ? 'Le saviez-vous ?' : 'Did you know?'}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{T.pricing.lossCard}</p>
            </div>
            <a href="#contact" className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white" style={{ background: '#0B6E4F' }}>
              {lang === 'fr' ? 'Protéger mon bureau' : 'Protect my office'} <ArrowRight size={14} />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {T.pricing.plans.map((plan, i) => (
              <motion.div key={plan.name} variants={fadeUp} className={`pricing-card rounded-2xl p-8 flex flex-col${plan.highlight ? ' popular' : ''}`}>
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
                <a href="#contact" className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105" style={plan.highlight ? { background: '#0B6E4F', color: 'white' } : { background: 'rgba(255,255,255,0.08)', color: 'white' }}>
                  {T.pricing.cta} <ArrowRight size={14} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* ── FAQ ── */}
      <Section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.faq.title}</h2>
            <p className="text-slate-400">{T.faq.subtitle}</p>
          </motion.div>
          <div className="flex flex-col gap-3">
            {T.faq.items.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-sm font-semibold text-white pr-4">{item.q}</span>
                  <ChevronDown size={18} className="shrink-0 transition-transform" style={{ color: '#0B6E4F', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-5 pb-5">
                    <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      {/* ── CONTACT / DEMO FORM ── */}
      <Section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{T.contact.title}</h2>
            <p className="text-slate-400">{T.contact.subtitle}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{ background: '#25D366', boxShadow: '0 8px 25px rgba(37,211,102,0.35)' }}>
              {WA_SVG}
              {lang === 'fr' ? 'Contacter sur WhatsApp' : 'Contact on WhatsApp'}
            </a>
          </motion.div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs text-slate-500">{lang === 'fr' ? 'ou remplissez le formulaire' : 'or fill the form'}</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {formStatus === 'success' ? (
            <motion.div variants={fadeUp} className="rounded-2xl p-10 text-center" style={{ background: 'rgba(11,110,79,0.15)', border: '1px solid rgba(11,110,79,0.4)' }}>
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg font-semibold text-white">{T.contact.success}</p>
            </motion.div>
          ) : (
            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="rounded-2xl p-8 flex flex-col gap-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
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
              <button type="submit" disabled={formStatus === 'loading'} className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white disabled:opacity-60 transition-all hover:scale-[1.02]" style={{ background: '#0B6E4F', boxShadow: '0 8px 25px rgba(11,110,79,0.35)' }}>
                {formStatus === 'loading' ? T.contact.submitting : <>{T.contact.submit} <ArrowRight size={16} /></>}
              </button>
            </motion.form>
          )}
        </div>
      </Section>

      <Divider />

      {/* ── PRIVACY POLICY ── */}
      <Section id="privacy" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} className="text-3xl font-extrabold text-white mb-2">{T.privacy.title}</motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 mb-10">{T.privacy.subtitle}</motion.p>
          <div className="flex flex-col gap-8 text-slate-300">
            {[
              { title: lang === 'fr' ? '1. Données collectées' : '1. Data collected', body: lang === 'fr' ? "Nous collectons uniquement les données nécessaires au fonctionnement de l'application : nom, email, téléphone, nom du bureau de change et données de transactions. Aucune donnée personnelle n'est vendue à des tiers." : "We only collect data necessary for the operation of the application: name, email, phone, exchange office name and transaction data. No personal data is sold to third parties." },
              { title: lang === 'fr' ? '2. Utilisation des données' : '2. Use of data', body: lang === 'fr' ? "Les données sont utilisées exclusivement pour fournir les services de l'application KABRAK Exchange Pro : gestion des transactions, génération de rapports et reçus, et communication avec les clients." : "Data is used exclusively to provide KABRAK Exchange Pro application services: transaction management, report and receipt generation, and client communication." },
              { title: lang === 'fr' ? '3. Stockage et sécurité' : '3. Storage and security', body: lang === 'fr' ? "Toutes les données sont stockées sur des serveurs sécurisés. Les mots de passe sont chiffrés avec bcrypt. Les communications sont sécurisées via HTTPS/TLS." : "All data is stored on secure servers. Passwords are encrypted with bcrypt. Communications are secured via HTTPS/TLS." },
              { title: lang === 'fr' ? '4. Partage des données' : '4. Data sharing', body: lang === 'fr' ? "Nous ne partageons pas vos données avec des tiers, sauf obligation légale. Les reçus PDF générés par l'application sont partagés uniquement à la demande explicite de l'utilisateur." : "We do not share your data with third parties, except as required by law. PDF receipts generated by the app are shared only at the explicit request of the user." },
              { title: lang === 'fr' ? '5. Vos droits' : '5. Your rights', body: lang === 'fr' ? "Vous avez le droit d'accéder, modifier ou supprimer vos données personnelles à tout moment. Contactez-nous à : kabrakeng@gmail.com" : "You have the right to access, modify or delete your personal data at any time. Contact us at: kabrakeng@gmail.com" },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp}>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="leading-relaxed text-sm">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

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
                {([['#features', T.nav.features], ['#how-it-works', lang === 'fr' ? 'Comment ça marche' : 'How it works'], ['#pricing', T.nav.pricing], ['#testimonials', lang === 'fr' ? 'Témoignages' : 'Testimonials'], ['#faq', 'FAQ'], ['#contact', T.nav.contact]] as [string,string][]).map(([href, label]) => (
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

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#25D366', borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(37,211,102,0.5)', transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

    </div>
  );
}
