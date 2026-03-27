import Link from 'next/link'

const FEATURES = [
  { icon: '⚡', title: 'Automatisez en 5 minutes', desc: 'Connectez vos outils et créez votre première automatisation sans écrire une seule ligne de code.' },
  { icon: '🔒', title: 'Sécurité enterprise', desc: 'Chiffrement AES-256, conformité RGPD, audits réguliers. Vos données restent les vôtres.' },
  { icon: '📈', title: 'Scalable à la demande', desc: 'De 10 à 100 000 automatisations par mois. La plateforme s\'adapte à votre croissance.' },
  { icon: '🔗', title: '50+ intégrations', desc: 'Gmail, Notion, Stripe, Slack, Google Sheets et bien plus. Tout ce que vous utilisez déjà.' },
  { icon: '📊', title: 'Analytics en temps réel', desc: 'Suivez chaque exécution, identifiez les erreurs, mesurez le temps économisé.' },
  { icon: '🎯', title: 'Support prioritaire', desc: 'Une équipe dédiée répond en moins de 2h. Onboarding personnalisé pour les plans Pro et Équipe.' },
]

const PLANS = [
  {
    name: 'Gratuit', price: '0', period: '', desc: 'Pour découvrir Eldorai',
    features: ['3 workflows actifs', '100 exécutions/mois', '2 intégrations', 'Support communautaire'],
    cta: 'Commencer gratuitement', href: '/auth/signup', highlight: false,
  },
  {
    name: 'Pro', price: '29', period: '/mois', desc: 'Pour les indépendants & freelances',
    features: ['50 workflows actifs', '10 000 exécutions/mois', '20 intégrations', 'Support prioritaire < 4h', 'Historique 90 jours', 'Webhooks personnalisés'],
    cta: 'Démarrer l\'essai gratuit', href: '/auth/signup?plan=pro', highlight: true,
  },
  {
    name: 'Équipe', price: '99', period: '/mois', desc: 'Pour les PME & équipes',
    features: ['Workflows illimités', '100 000 exécutions/mois', 'Intégrations illimitées', 'Support dédié < 2h', 'Historique illimité', 'SSO & gestion des rôles'],
    cta: 'Contacter les ventes', href: 'mailto:hello@eldorai.com', highlight: false,
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
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif}

        .nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0}
        .nav-inner{max-width:1180px;margin:0 auto;padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}
        .logo{display:flex;align-items:center;gap:9px;font-weight:700;font-size:19px;color:#0f172a;text-decoration:none;letter-spacing:-0.02em}
        .logo-mark{width:32px;height:32px;background:#1d4ed8;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .nav-links{display:flex;align-items:center;gap:4px}
        .nav-link{color:#475569;text-decoration:none;font-size:14px;font-weight:500;padding:7px 12px;border-radius:7px;transition:all 0.12s}
        .nav-link:hover{color:#0f172a;background:#f1f5f9}
        .nav-hide-mobile{display:flex}
        .btn-primary{background:#1d4ed8;color:white;border:none;padding:9px 18px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;white-space:nowrap}
        .btn-primary:hover{background:#1e40af;transform:translateY(-1px);box-shadow:0 4px 12px rgba(29,78,216,0.3)}
        .btn-secondary{background:white;color:#1d4ed8;border:1.5px solid #bfdbfe;padding:9px 18px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;transition:all 0.15s}
        .btn-secondary:hover{background:#eff6ff}

        .hero{background:white;border-bottom:1px solid #e2e8f0;position:relative;overflow:hidden}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px);background-size:40px 40px;opacity:0.35}
        .hero-inner{max-width:800px;margin:0 auto;padding:80px 20px 72px;text-align:center;position:relative}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:100px;padding:5px 14px;font-size:13px;font-weight:600;margin-bottom:28px}
        .hero-badge-dot{width:6px;height:6px;background:#1d4ed8;border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.6;transform:scale(1.3)}}
        .hero h1{font-family:'DM Serif Display',serif;font-size:clamp(36px,7vw,66px);font-weight:400;line-height:1.08;color:#0f172a;letter-spacing:-0.02em;margin-bottom:22px}
        .hero h1 em{color:#1d4ed8;font-style:italic}
        .hero-sub{font-size:clamp(15px,2vw,18px);color:#64748b;line-height:1.7;max-width:520px;margin:0 auto 36px}
        .hero-ctas{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}
        .hero-note{margin-top:14px;font-size:13px;color:#94a3b8}

        .stats{background:#0f172a;padding:52px 20px}
        .stats-inner{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:0}
        .stat{text-align:center;padding:28px 12px;border-right:1px solid #1e293b}
        .stat:last-child{border-right:none}
        .stat-value{font-family:'DM Serif Display',serif;font-size:clamp(32px,5vw,42px);color:white;font-weight:400;letter-spacing:-0.02em}
        .stat-label{font-size:13px;color:#64748b;margin-top:5px;font-weight:500}

        .section{padding:80px 20px}
        .section-inner{max-width:1180px;margin:0 auto}
        .section-tag{display:inline-block;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#1d4ed8;margin-bottom:14px}
        .section-title{font-family:'DM Serif Display',serif;font-size:clamp(28px,4vw,44px);color:#0f172a;font-weight:400;line-height:1.15;letter-spacing:-0.02em;margin-bottom:14px}
        .section-sub{font-size:16px;color:#64748b;line-height:1.7;max-width:520px}

        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#e2e8f0;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;margin-top:56px}
        .feature{background:white;padding:32px 28px;transition:background 0.15s}
        .feature:hover{background:#fafbff}
        .feature-icon{font-size:26px;margin-bottom:14px;display:block}
        .feature h3{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:7px;letter-spacing:-0.01em}
        .feature p{font-size:13.5px;color:#64748b;line-height:1.6}

        .pricing{background:#f8fafc;padding:80px 20px}
        .pricing-inner{max-width:1040px;margin:0 auto}
        .pricing-header{text-align:center;margin-bottom:56px}
        .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:start}
        .plan{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:32px 28px}
        .plan.highlight{border-color:#1d4ed8;border-width:2px;box-shadow:0 8px 32px rgba(29,78,216,0.12);position:relative}
        .plan-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:#1d4ed8;color:white;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 14px;border-radius:100px;white-space:nowrap}
        .plan-name{font-size:12px;font-weight:700;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px}
        .plan-price{display:flex;align-items:baseline;gap:3px;margin-bottom:7px}
        .plan-amount{font-family:'DM Serif Display',serif;font-size:46px;color:#0f172a;font-weight:400;letter-spacing:-0.02em}
        .plan-period{font-size:15px;color:#94a3b8}
        .plan-desc{font-size:13.5px;color:#64748b;margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f1f5f9}
        .plan-features{list-style:none;display:flex;flex-direction:column;gap:11px;margin-bottom:28px}
        .plan-feature{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;color:#374151}
        .check{width:17px;height:17px;background:#dbeafe;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
        .plan-cta{display:block;text-align:center;padding:12px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;transition:all 0.15s}
        .plan-cta-default{background:#f1f5f9;color:#0f172a}
        .plan-cta-default:hover{background:#e2e8f0}
        .plan-cta-highlight{background:#1d4ed8;color:white}
        .plan-cta-highlight:hover{background:#1e40af;box-shadow:0 4px 12px rgba(29,78,216,0.3)}

        .cta-section{background:#0f172a;padding:80px 20px;text-align:center;position:relative;overflow:hidden}
        .cta-section::before{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:500px;height:260px;background:radial-gradient(ellipse,rgba(29,78,216,0.3) 0%,transparent 70%);pointer-events:none}
        .cta-section h2{font-family:'DM Serif Display',serif;font-size:clamp(28px,5vw,50px);color:white;font-weight:400;letter-spacing:-0.02em;margin-bottom:18px;position:relative}
        .cta-section p{font-size:16px;color:#94a3b8;margin-bottom:36px;position:relative}
        .cta-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative}
        .btn-white{background:white;color:#0f172a;padding:13px 26px;border-radius:9px;font-size:15px;font-weight:700;text-decoration:none;transition:all 0.15s}
        .btn-white:hover{background:#f1f5f9;transform:translateY(-1px)}
        .btn-outline-white{background:transparent;color:white;border:1.5px solid rgba(255,255,255,0.2);padding:13px 26px;border-radius:9px;font-size:15px;font-weight:600;text-decoration:none;transition:all 0.15s}
        .btn-outline-white:hover{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.05)}

        .footer{background:white;border-top:1px solid #e2e8f0;padding:36px 20px}
        .footer-inner{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
        .footer-copy{font-size:13px;color:#94a3b8}

        @media(max-width:768px){
          .nav-hide-mobile{display:none}
          .stats-inner{grid-template-columns:repeat(2,1fr)}
          .stat{border-right:none;border-bottom:1px solid #1e293b}
          .stat:nth-child(odd){border-right:1px solid #1e293b}
          .stat:nth-last-child(-n+2){border-bottom:none}
          .features-grid{grid-template-columns:1fr}
          .plans{grid-template-columns:1fr}
          .plan.highlight{margin-top:0}
          .footer-inner{flex-direction:column;text-align:center}
        }
        @media(max-width:480px){
          .hero-inner{padding:60px 16px 52px}
          .section{padding:60px 16px}
          .pricing{padding:60px 16px}
          .cta-section{padding:60px 16px}
          .btn-primary,.btn-secondary,.btn-white,.btn-outline-white{width:100%;justify-content:center}
          .hero-ctas{flex-direction:column;width:100%}
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">
            <div className="logo-mark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            Eldorai
          </a>
          <div className="nav-links">
            <span className="nav-hide-mobile" style={{display:'flex',gap:4}}>
              <a href="#features" className="nav-link">Fonctionnalités</a>
              <a href="#pricing" className="nav-link">Tarifs</a>
              <Link href="/auth/login" className="nav-link">Connexion</Link>
            </span>
            <Link href="/auth/signup" className="btn-primary">Commencer — gratuit</Link>
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
          <p className="hero-sub">Eldorai connecte vos outils et exécute vos tâches répétitives automatiquement. Sans code. Sans effort. Dès aujourd'hui.</p>
          <div className="hero-ctas">
            <Link href="/auth/signup" className="btn-primary" style={{padding:'12px 26px',fontSize:'15px'}}>Créer mon compte gratuit →</Link>
            <a href="#pricing" className="btn-secondary" style={{padding:'12px 26px',fontSize:'15px'}}>Voir les tarifs</a>
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
      <section className="section" id="features" style={{background:'white'}}>
        <div className="section-inner">
          <span className="section-tag">Fonctionnalités</span>
          <h2 className="section-title">Tout ce dont vous avez besoin</h2>
          <p className="section-sub">Une plateforme complète pour automatiser tous vos processus métier.</p>
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
            <p className="section-sub" style={{margin:'0 auto'}}>Commencez gratuitement. Upgradez quand votre activité grandit.</p>
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
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`plan-cta ${plan.highlight ? 'plan-cta-highlight' : 'plan-cta-default'}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Prêt à gagner<br />5 heures par semaine ?</h2>
        <p>Rejoignez 2 400 entreprises qui automatisent déjà avec Eldorai.</p>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            Eldorai
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Eldorai · eldorai.com · Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}
