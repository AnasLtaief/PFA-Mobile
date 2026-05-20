import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to: string, token: string) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: '"Campus Covoiturage" <noreply@campuscovoiturage.dz>',
    to,
    subject: 'Vérifiez votre adresse email',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0A0A0F; color: #F0F0F5; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #13131A;">
        <h2 style="color: #6C63FF; text-align: center;">Bienvenue sur Campus Covoiturage !</h2>
        <p>Bonjour,</p>
        <p>Merci de vous être inscrit sur Campus Covoiturage, la plateforme de covoiturage exclusive pour les étudiants universitaires algériens.</p>
        <p>Pour finaliser votre inscription et activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #6C63FF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(108, 99, 255, 0.2);">Vérifier mon email</a>
        </div>
        <p style="color: #8A8A9E; font-size: 12px;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur : <br/> <a href="${url}" style="color: #00D4AA;">${url}</a></p>
        <hr style="border: 0; border-top: 1px solid #13131A; margin: 30px 0;" />
        <p style="color: #8A8A9E; font-size: 12px; text-align: center;">Ce lien expirera dans 24 heures. Si vous n'avez pas demandé cet email, veuillez l'ignorer.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: '"Campus Covoiturage" <noreply@campuscovoiturage.dz>',
    to,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0A0A0F; color: #F0F0F5; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #13131A;">
        <h2 style="color: #6C63FF; text-align: center;">Réinitialisation du mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.</p>
        <p>Veuillez cliquer sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #6C63FF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(108, 99, 255, 0.2);">Réinitialiser mon mot de passe</a>
        </div>
        <p style="color: #8A8A9E; font-size: 12px;">Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur : <br/> <a href="${url}" style="color: #00D4AA;">${url}</a></p>
        <hr style="border: 0; border-top: 1px solid #13131A; margin: 30px 0;" />
        <p style="color: #8A8A9E; font-size: 12px; text-align: center;">Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email et votre mot de passe restera inchangé.</p>
      </div>
    `,
  });
};

export const sendPaymentReceipt = async (
  to: string,
  receipt: { amount: number; rideDetails: string; date: Date; paymentId: string }
) => {
  await transporter.sendMail({
    from: '"Campus Covoiturage" <payments@campuscovoiturage.dz>',
    to,
    subject: 'Reçu de paiement - Campus Covoiturage',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0A0A0F; color: #F0F0F5; padding: 40px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #13131A;">
        <h2 style="color: #00D4AA; text-align: center;">Reçu de paiement</h2>
        <p>Bonjour,</p>
        <p>Merci pour votre réservation sur Campus Covoiturage. Votre paiement a été traité avec succès.</p>
        <div style="background-color: #13131A; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #6C63FF;">
          <table style="width: 100%; color: #F0F0F5;">
            <tr>
              <td style="padding: 8px 0; color: #8A8A9E;">ID de transaction :</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${receipt.paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8A8A9E;">Date :</td>
              <td style="padding: 8px 0; text-align: right;">${new Date(receipt.date).toLocaleDateString('fr-FR')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8A8A9E;">Description :</td>
              <td style="padding: 8px 0; text-align: right;">${receipt.rideDetails}</td>
            </tr>
            <tr style="border-top: 1px solid #8A8A9E;">
              <td style="padding: 16px 0 0 0; font-size: 18px; font-weight: bold; color: #00D4AA;">Montant total :</td>
              <td style="padding: 16px 0 0 0; font-size: 18px; font-weight: bold; text-align: right; color: #00D4AA;">${receipt.amount} DZD</td>
            </tr>
          </table>
        </div>
        <p style="text-align: center; color: #8A8A9E;">Bon voyage avec Campus Covoiturage !</p>
      </div>
    `,
  });
};
