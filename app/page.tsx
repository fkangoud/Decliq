import Link from 'next/link'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Automatisez en 5 minutes',
    desc: 'Connectez vos outils et créez votre première automatisation sans écrire une seule ligne de code.',
  },
  {
    icon: '🔒',
    title: 'Sécurité enterprise',
    desc: 'Chiffrement AES-256, conformité RGPD, audits de sécurité réguliers. Vos données restent les vôtres.',
  },
  {
    icon: '📈',
    title: 'Scalable à la demande',
    desc: 'De 10 à 100 000 automatisations par mois. La plateforme s\'adapte à votre croissance.',
  },
  {
    icon: '🔗',
    title: '50+ intégrations',
    desc: 'Gmail, Notion, Stripe, Slack, Google Sheets et bien plus. Tout ce que vous utilisez déjà.',
  },
  {
    icon: '📊',
    title: 'Analytics en temps réel',
    desc: 'Suivez chaque exécution, identifiez les erreurs, mesurez le temps économisé.',
  },
  {
    icon: '🎯',
    title: 'Support prioritaire',
    desc: 'Une équipe dédiée répond en moins de 2h. Onboarding personnalisé pour les plans Pro et Équipe.',
  },
]

const PLANS = [
  {
    name: 'Gratuit',
    price: '0',
    period: '',
    desc: 'Pour découvrir Décliq',
    features: ['3 workflows actifs', '100 exécutions/mois', '2 intégrations', 'Support communautaire'],
    cta: 'Commencer gratuitement',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '29',
    period: '/mois',
    desc: 'Pour les indépendants & freelances',
    features: ['50 workflows actifs', '10 000 exécutions/mois', '20 intégrations', 'Support prioritaire < 4h', 'Historique 90 jours', 'Webhooks personnalisés'],
    cta: 'Démarrer l\'essai gratuit',
    href: '/auth/signup?plan=pro',
    highlight: true,
  },
  {
    name: 'Équipe',
    price: '99',
    period: '/mois',
    desc: 'Pour les PME & équipes',
    features: ['Workflows illimités', '100 000 exécutions/mois', 'Intégrations illimitées', 'Support dédié < 2h', 'Historique illimité', 'SSO & gestion des rôles'],
    cta: 'Contacter les ventes',
    href: 'mailto:hello@eldorai.com',
    highlight: false,
  },
]

const STATS = [
  { value: '2 400+', label: 'Entreprises actives' },
  { value: '18M+', label: 'Automatisations exécutées' },
  { value: '99.9%', label: 'Disponibilité garantie' },
  { value: '4.8/5', label: 'Note moyenne clients' },
]

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', system-ui, sans-serif; }

        .nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; }
        .nav-inner { max-width: 1180px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 20px; color: #0f172a; text-decoration: none; letter-spacing: -0.02em; }
        .logo-mark { width: 34px; height: 34px; background: #1d4ed8; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        .logo-mark svg { width: 18px; height: 18px; }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link { color: #475569; text-decoration: none; font-size: 14px; font-weight: 500; padding: 8px 14px; border-radius: 8px; transition: all 0.15s; }
        .nav-link:hover { color: #0f172a; background: #f1f5f9; }
        .btn-primary { background: #1d4ed8; color: white; border: none; padding: 10px 20px; border-radius: 9px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; letter-spacing: -0.01em; }
        .btn-primary:hover { background: #1e40af; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(29,78,216,0.3); }
        .btn-secondary { background: white; color: #1d4ed8; border: 1.5px solid #bfdbfe; padding: 10px 20px; border-radius: 9px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; }
        .btn-secondary:hover { background: #eff6ff; transform: translateY(-1px); }

        .hero { background: white; border-bottom: 1px solid #e2e8f0; position: relative; overflow: hidden; }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px); background-size: 40px 40px; opacity: 0.4; }
        .hero-inner { max-width: 820px; margin: 0 auto; padding: 100px 24px 90px; text-align: center; position: relative; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 100px; padding: 6px 14px; font-size: 13px; font-weight: 600; margin-bottom: 32px; }
        .hero-badge-dot { width: 6px; height: 6px; background: #1d4ed8; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
        .hero h1 { font-family: 'DM Serif Display', serif; font-size: clamp(40px, 6vw, 68px); font-weight: 400; line-height: 1.08; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 24px; }
        .hero h1 em { color: #1d4ed8; font-style: italic; }
        .hero-sub { font-size: 18px; color: #64748b; line-height: 1.7; max-width: 560px; margin: 0 auto 40px; font-weight: 400; }
        .hero-ctas { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .hero-note { margin-top: 16px; font-size: 13px; color: #94a3b8; }

        .stats { background: #0f172a; padding: 56px 24px; }
        .stats-inner { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
        .stat { text-align: center; padding: 32px 16px; border-right: 1px solid #1e293b; }
        .stat:last-child { border-right: none; }
        .stat-value { font-family: 'DM Serif Display', serif; font-size: 42px; color: white; font-weight: 400; letter-spacing: -0.02em; }
        .stat-label { font-size: 14px; color: #64748b; margin-top: 6px; font-weight: 500; }

        .section { padding: 96px 24px; }
        .section-inner { max-width: 1180px; margin: 0 auto; }
        .section-tag { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #1d4ed8; margin-bottom: 16px; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: clamp(30px, 4vw, 46px); color: #0f172a; font-weight: 400; line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 16px; }
        .section-sub { font-size: 17px; color: #64748b; line-height: 1.7; max-width: 560px; }

        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e2e8f0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; margin-top: 64px; }
        .feature { background: white; padding: 36px 32px; transition: background 0.15s; }
        .feature:hover { background: #fafbff; }
        .feature-icon { font-size: 28px; margin-bottom: 16px; display: block; }
        .feature h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.01em; }
        .feature p { font-size: 14px; color: #64748b; line-height: 1.65; }

        .pricing { background: #f8fafc; padding: 96px 24px; }
        .pricing-inner { max-width: 1060px; margin: 0 auto; }
        .pricing-header { text-align: center; margin-bottom: 64px; }
        .plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: start; }
        .plan { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 36px 32px; }
        .plan.highlight { border-color: #1d4ed8; border-width: 2px; box-shadow: 0 8px 32px rgba(29,78,216,0.12); position: relative; }
        .plan-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: #1d4ed8; color: white; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 14px; border-radius: 100px; white-space: nowrap; }
        .plan-name { font-size: 13px; font-weight: 700; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; }
        .plan-amount { font-family: 'DM Serif Display', serif; font-size: 48px; color: #0f172a; font-weight: 400; letter-spacing: -0.02em; }
        .plan-period { font-size: 16px; color: #94a3b8; font-weight: 400; }
        .plan-desc { font-size: 14px; color: #64748b; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #f1f5f9; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .plan-feature { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #374151; }
        .check { width: 18px; height: 18px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .plan.highlight .check { background: #bfdbfe; }
        .plan-cta { display: block; text-align: center; padding: 13px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.15s; }
        .plan-cta-default { background: #f1f5f9; color: #0f172a; }
        .plan-cta-default:hover { background: #e2e8f0; }
        .plan-cta-highlight { background: #1d4ed8; color: white; }
        .plan-cta-highlight:hover { background: #1e40af; box-shadow: 0 4px 12px rgba(29,78,216,0.3); }

        .cta-section { background: #0f172a; padding: 96px 24px; text-align: center; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(29,78,216,0.3) 0%, transparent 70%); pointer-events: none; }
        .cta-section h2 { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 5vw, 52px); color: white; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 20px; position: relative; }
        .cta-section p { font-size: 17px; color: #94a3b8; margin-bottom: 40px; position: relative; }
        .cta-btns { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; position: relative; }
        .btn-white { background: white; color: #0f172a; padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.15s; }
        .btn-white:hover { background: #f1f5f9; transform: translateY(-1px); }
        .btn-outline-white { background: transparent; color: white; border: 1.5px solid rgba(255,255,255,0.2); padding: 13px 28px; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.15s; }
        .btn-outline-white:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }

        .footer { background: white; border-top: 1px solid #e2e8f0; padding: 40px 24px; }
        .footer-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .footer-copy { font-size: 13px; color: #94a3b8; }

        @media (max-width: 768px) {
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .stat { border-right: none; border-bottom: 1px solid #1e293b; }
          .features-grid { grid-template-columns: 1fr; }
          .plans { grid-template-columns: 1fr; }
          .nav-links .nav-link { display: none; }
          .footer-inner { flex-direction: column; gap: 16px; text-align: center; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M3 9L7 13L15 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Décliq
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Fonctionnalités</a>
            <a href="#pricing" className="nav-link">Tarifs</a>
            <Link href="/auth/login" className="nav-link">Connexion</Link>
            <Link href="/auth/signup" className="btn-primary">Commencer — c'est gratuit</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-badge">
            <div className="hero-badge-dot" />
            Nouveau — Intégration Notion disponible
          </div>
          <h1>Automatisez vos tâches.<br /><em>Récupérez votre temps.</em></h1>
          <p className="hero-sub">
            Décliq connecte vos outils et exécute vos tâches répétitives automatiquement. Sans code. Sans effort. Dès aujourd'hui.
          </p>
          <div className="hero-ctas">
            <Link href="/auth/signup" className="btn-primary" style={{padding: '13px 28px', fontSize: '15px'}}>
              Créer mon compte gratuit →
            </Link>
            <a href="#pricing" className="btn-secondary" style={{padding: '13px 28px', fontSize: '15px'}}>
              Voir les tarifs
            </a>
          </div>
          <p className="hero-note">Gratuit pour toujours · Pas de carte bancaire · RGPD conforme</p>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stats-inner">
          {STATS.map(s => (
            <div key={s.label} className="stat">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" id="features" style={{background: 'white'}}>
        <div className="section-inner">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 32}}>
            <div>
              <span className="section-tag">Fonctionnalités</span>
              <h2 className="section-title">Tout ce dont vous<br />avez besoin</h2>
              <p className="section-sub">Une plateforme complète pour automatiser tous vos processus métier, de la capture à l'action.</p>
            </div>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="pricing-inner">
          <div className="pricing-header">
            <span className="section-tag">Tarifs</span>
            <h2 className="section-title">Simple et transparent</h2>
            <p className="section-sub" style={{margin: '0 auto'}}>Commencez gratuitement. Upgradez quand votre activité grandit.</p>
          </div>
          <div className="plans">
            {PLANS.map(plan => (
              <div key={plan.name} className={`plan ${plan.highlight ? 'highlight' : ''}`}>
                {plan.highlight && <div className="plan-badge">Le plus populaire</div>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  <span className="plan-amount">{plan.price}€</span>
                  <span className="plan-period">{plan.period}</span>
                </div>
                <div className="plan-desc">{plan.desc}</div>
                <ul className="plan-features">
                  {plan.features.map(f => (
                    <li key={f} className="plan-feature">
                      <div className="check">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`plan-cta ${plan.highlight ? 'plan-cta-highlight' : 'plan-cta-default'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Prêt à gagner<br />5 heures par semaine ?</h2>
        <p>Rejoignez 2 400 entreprises qui automatisent déjà avec Décliq.</p>
        <div className="cta-btns">
          <Link href="/auth/signup" className="btn-white">Commencer gratuitement →</Link>
          <a href="mailto:hello@eldorai.com" className="btn-outline-white">Parler à un expert</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 18 18" fill="none">
                <path d="M3 9L7 13L15 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Décliq
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Décliq · eldorai.com · Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}
