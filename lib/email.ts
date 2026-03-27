import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

// ================================
// EMAIL DE BIENVENUE
// ================================
export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Bienvenue sur AutoFlow !',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
        <h1 style="font-size:24px;color:#0f172a">Bienvenue, ${name || 'là'} !</h1>
        <p style="color:#475569;line-height:1.6">Votre compte est prêt. Vous pouvez dès maintenant créer votre première automatisation.</p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#0f172a;color:#fff;border-radius:8px;text-decoration:none;font-weight:500">
          Accéder au dashboard →
        </a>
        <p style="margin-top:40px;font-size:13px;color:#94a3b8">Des questions ? Répondez directement à cet email.</p>
      </div>
    `,
  })
}

// ================================
// EMAIL CONFIRMATION ABONNEMENT
// ================================
export async function sendSubscriptionConfirmationEmail(to: string, plan: string) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Votre abonnement ${plan} est actif`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
        <h1 style="font-size:24px;color:#0f172a">Abonnement activé</h1>
        <p style="color:#475569;line-height:1.6">
          Votre plan <strong>${plan}</strong> est maintenant actif. Toutes vos limites ont été augmentées.
        </p>
        <a href="${APP_URL}/dashboard" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#0f172a;color:#fff;border-radius:8px;text-decoration:none;font-weight:500">
          Voir mon dashboard →
        </a>
      </div>
    `,
  })
}

// ================================
// EMAIL RAPPORT MENSUEL
// ================================
export async function sendMonthlyReport(to: string, stats: { runs: number; timeSaved: number }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Votre rapport mensuel AutoFlow`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 20px">
        <h1 style="font-size:24px;color:#0f172a">Ce mois-ci avec AutoFlow</h1>
        <div style="display:flex;gap:24px;margin:24px 0">
          <div style="flex:1;background:#f8fafc;border-radius:12px;padding:20px;text-align:center">
            <div style="font-size:32px;font-weight:700;color:#0f172a">${stats.runs}</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px">automatisations exécutées</div>
          </div>
          <div style="flex:1;background:#f8fafc;border-radius:12px;padding:20px;text-align:center">
            <div style="font-size:32px;font-weight:700;color:#0f172a">${stats.timeSaved}h</div>
            <div style="font-size:13px;color:#64748b;margin-top:4px">économisées</div>
          </div>
        </div>
        <a href="${APP_URL}/dashboard" style="display:inline-block;margin-top:8px;padding:12px 24px;background:#0f172a;color:#fff;border-radius:8px;text-decoration:none;font-weight:500">
          Voir le détail →
        </a>
      </div>
    `,
  })
}
