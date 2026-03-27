import Link from 'next/link'
import { Zap, Shield, TrendingUp, Check } from 'lucide-react'

const FEATURES = [
  { icon: Zap, title: 'Automatisez en minutes', desc: 'Créez vos premières automatisations sans coder, en moins de 5 minutes.' },
  { icon: Shield, title: 'Sécurisé et fiable', desc: 'Vos données sont chiffrées. Disponibilité 99.9% garantie.' },
  { icon: TrendingUp, title: 'Grandissez sans friction', desc: 'De 1 à 1000 automatisations, la plateforme s\'adapte à votre rythme.' },
]

const PLANS = [
  {
    name: 'Gratuit',
    price: 0,
    desc: 'Pour découvrir',
    features: ['3 workflows', '100 exécutions/mois', '2 intégrations', 'Support communautaire'],
    cta: 'Commencer gratuitement',
    href: '/auth/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 29,
    desc: 'Pour les indépendants',
    features: ['50 workflows', '10 000 exécutions/mois', '20 intégrations', 'Support prioritaire', 'Historique 90 jours'],
    cta: 'Démarrer l\'essai gratuit',
    href: '/auth/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Équipe',
    price: 99,
    desc: 'Pour les PME',
    features: ['Workflows illimités', '100 000 exécutions/mois', 'Intégrations illimitées', 'Support dédié', 'SSO & audit logs'],
    cta: 'Contacter les ventes',
    href: 'mailto:hello@autoflow.app',
    highlighted: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="font-semibold text-slate-900 text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          AutoFlow
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Connexion
          </Link>
          <Link href="/auth/signup" className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
            Commencer gratuitement
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          Nouveau : intégration Notion disponible
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          Automatisez vos tâches répétitives.<br />
          <span className="text-blue-600">Sans coder.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          AutoFlow connecte vos outils et automatise vos processus en quelques clics. Gagnez 5 heures par semaine, minimum.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/signup" className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-slate-700 transition-colors text-base">
            Commencer gratuitement
          </Link>
          <Link href="#pricing" className="text-slate-600 px-8 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition-colors text-base border border-slate-200">
            Voir les tarifs
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">Gratuit pour toujours · Pas de carte bancaire requise</p>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-slate-50 rounded-2xl p-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Tarifs simples et transparents</h2>
          <p className="text-slate-500">Commencez gratuitement, upgradez quand vous en avez besoin.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'bg-slate-900 text-white ring-2 ring-blue-500'
                  : 'bg-white border border-slate-200'
              }`}
            >
              {plan.highlighted && (
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4">Populaire</div>
              )}
              <div className="mb-1">
                <span className={`text-sm font-medium ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold">{plan.price}€</span>
                {plan.price > 0 && (
                  <span className={`text-sm ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>/mois</span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-blue-400' : 'text-green-500'}`} />
                    <span className={plan.highlighted ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`text-center py-3 px-6 rounded-xl font-medium text-sm transition-colors ${
                  plan.highlighted
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Zap className="w-4 h-4 text-blue-600" />
            AutoFlow
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} AutoFlow. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
