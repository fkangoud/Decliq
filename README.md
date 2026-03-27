# AutoFlow — MVP SaaS

Plateforme d'automatisation no-code pour indépendants et PME.

## Stack

- **Next.js 14** (App Router) — Frontend + API routes
- **Supabase** — Base de données PostgreSQL + Auth + RLS
- **Stripe** — Paiements et abonnements
- **Resend** — Emails transactionnels
- **Tailwind CSS** — Styles
- **Vercel** — Hébergement (recommandé)

---

## Installation locale

### 1. Cloner et installer les dépendances

```bash
git clone <votre-repo>
cd saas-mvp
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplissez chaque variable dans `.env.local` :

| Variable | Où la trouver |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks |
| `STRIPE_PRICE_PRO_MONTHLY` | Stripe → Products → créer un produit Pro |
| `STRIPE_PRICE_TEAM_MONTHLY` | Stripe → Products → créer un produit Équipe |
| `RESEND_API_KEY` | resend.com → API Keys |
| `EMAIL_FROM` | Votre email expéditeur vérifié dans Resend |

### 3. Configurer la base de données Supabase

1. Allez dans votre projet Supabase
2. Ouvrez **SQL Editor**
3. Copiez-collez le contenu de `supabase-schema.sql`
4. Cliquez **Run**

### 4. Configurer l'authentification Supabase

Dans Supabase → Authentication → Providers :
- Activez **Email** (activé par défaut)
- Activez **Google** (optionnel) : créez des identifiants OAuth dans Google Cloud Console

Dans Supabase → Authentication → URL Configuration :
- Site URL : `http://localhost:3000`
- Redirect URLs : `http://localhost:3000/auth/callback`

### 5. Configurer le webhook Stripe

```bash
# Installer la CLI Stripe
npm install -g stripe

# Écouter les webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copiez le `whsec_...` affiché dans `STRIPE_WEBHOOK_SECRET`.

### 6. Lancer le serveur

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Structure des fichiers

```
saas-mvp/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Layout global
│   ├── globals.css                 # Styles globaux
│   ├── auth/
│   │   ├── login/page.tsx          # Page connexion
│   │   ├── signup/page.tsx         # Page inscription
│   │   └── callback/route.ts       # OAuth callback
│   ├── dashboard/
│   │   ├── layout.tsx              # Layout dashboard (sidebar)
│   │   ├── page.tsx                # Vue d'ensemble
│   │   ├── billing/page.tsx        # Abonnement
│   │   ├── settings/page.tsx       # Paramètres
│   │   └── workflows/
│   │       ├── page.tsx            # Liste workflows
│   │       ├── new/page.tsx        # Créer un workflow
│   │       └── [id]/page.tsx       # Détail workflow
│   └── api/
│       ├── billing/
│       │   ├── checkout/route.ts   # Créer session Stripe
│       │   └── portal/route.ts     # Portail facturation
│       └── webhooks/
│           └── stripe/route.ts     # Webhook Stripe (critique)
├── components/
│   └── dashboard/
│       └── WorkflowControls.tsx    # Pause / activer / supprimer
├── lib/
│   ├── supabase.ts                 # Clients Supabase (browser/server/service)
│   ├── stripe.ts                   # Utilitaires Stripe
│   ├── email.ts                    # Templates email (Resend)
│   └── utils.ts                    # Helpers génériques
├── types/
│   └── index.ts                    # Types TypeScript
├── middleware.ts                    # Protection des routes
├── supabase-schema.sql             # Schéma BDD complet
└── .env.local.example              # Template variables d'environnement
```

---

## Déploiement sur Vercel

```bash
npm install -g vercel
vercel
```

Ajoutez toutes les variables d'environnement dans Vercel → Settings → Environment Variables.

Mettez à jour les URLs dans Supabase et Stripe :
- Supabase → Authentication → URL : votre domaine Vercel
- Stripe → Webhooks : ajoutez `https://votre-domaine.vercel.app/api/webhooks/stripe`

---

## Prochaines étapes après le MVP

1. **Intégrations réelles** — Connecter Gmail, Sheets, Notion via OAuth
2. **Moteur d'exécution** — Cron jobs avec Vercel Cron ou Trigger.dev
3. **Éditeur visuel** — Drag & drop pour construire les workflows
4. **Templates** — Bibliothèque de workflows prêts à l'emploi
5. **Analytics** — Métriques détaillées par workflow
6. **API publique** — Pour les développeurs
