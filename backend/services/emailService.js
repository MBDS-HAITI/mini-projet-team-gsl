const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email de notification de note
exports.sendGradeNotificationEmail = async ({ studentEmail, studentName, courseName, grade, date }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentEmail,
    subject: `Nouvelle note disponible - ${courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .grade-box { background: white; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .grade-value { font-size: 48px; font-weight: bold; color: ${grade >= 10 ? '#10b981' : '#ef4444'}; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Nouvelle Note Disponible</h1>
          </div>
          <div class="content">
            <p>Bonjour ${studentName},</p>
            <p>Une nouvelle note a été ajoutée à votre dossier académique.</p>
            
            <div class="grade-box">
              <h2 style="margin-top: 0; color: #667eea;">${courseName}</h2>
              <div class="grade-value">${grade}/20</div>
              <p style="color: #666; margin-bottom: 0;">Date: ${new Date(date).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <p>Connectez-vous à votre espace pour consulter le détail de vos notes et statistiques.</p>
            
            <div class="footer">
              <p>Cet email est envoyé automatiquement, merci de ne pas y répondre.</p>
              <p>© ${new Date().getFullYear()} Student Management System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Email de l'admin/scolarité vers les étudiants
exports.sendAdminToStudentEmail = async ({ studentEmail, studentName, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentEmail,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Message de l'Administration</h1>
          </div>
          <div class="content">
            <p>Bonjour ${studentName},</p>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <div class="footer">
              <p>Pour toute question, contactez l'administration.</p>
              <p>© ${new Date().getFullYear()} Student Management System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Email de l'étudiant vers l'admin
exports.sendStudentToAdminEmail = async ({ studentEmail, studentName, subject, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    replyTo: studentEmail,
    subject: `[Étudiant] ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .message-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid #ddd; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📨 Message d'un Étudiant</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <strong>De:</strong> ${studentName}<br>
              <strong>Email:</strong> ${studentEmail}<br>
              <strong>Sujet:</strong> ${subject}
            </div>
            <div class="message-box">
              <strong>Message:</strong><br><br>
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666; font-size: 12px;">
              Pour répondre, utilisez directement l'adresse email: ${studentEmail}
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Email de bienvenue avec identifiants
exports.sendWelcomeWithCredentials = async ({ studentEmail, studentName, studentNumber, tempPassword }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentEmail,
    subject: 'Bienvenue - Vos identifiants de connexion',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .credential-item { margin: 10px 0; }
          .credential-label { font-weight: bold; color: #667eea; }
          .credential-value { background: #f0f0f0; padding: 8px 12px; border-radius: 4px; font-family: monospace; display: inline-block; margin-left: 10px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Bienvenue ${studentName} !</h1>
          </div>
          <div class="content">
            <p>Votre compte étudiant a été créé avec succès. Voici vos identifiants de connexion :</p>
            
            <div class="credentials">
              <div class="credential-item">
                <span class="credential-label">📧 Email :</span>
                <span class="credential-value">${studentEmail}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">🔢 Numéro étudiant :</span>
                <span class="credential-value">${studentNumber}</span>
              </div>
              <div class="credential-item">
                <span class="credential-label">🔑 Mot de passe temporaire :</span>
                <span class="credential-value">${tempPassword}</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong> Ce mot de passe est temporaire. Veuillez le changer lors de votre première connexion pour des raisons de sécurité.
            </div>
            
            <p>Pour vous connecter :</p>
            <ol>
              <li>Rendez-vous sur la page de connexion étudiants</li>
              <li>Utilisez votre email et le mot de passe ci-dessus</li>
              <li>Changez votre mot de passe dans votre profil</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/student-login" class="button">Se connecter</a>
            </div>
            
            <div class="footer">
              <p>Si vous n'avez pas demandé la création de ce compte, veuillez contacter l'administration.</p>
              <p>© ${new Date().getFullYear()} Student Management System</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

// Email de réinitialisation de mot de passe
exports.sendPasswordResetEmail = async ({ studentEmail, studentName, studentNumber, tempPassword }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: studentEmail,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #dc3545; margin: 20px 0; }
          .credential-label { font-weight: bold; color: #dc3545; }
          .credential-value { background: #f0f0f0; padding: 8px 12px; border-radius: 4px; font-family: monospace; display: inline-block; margin-left: 10px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔑 Réinitialisation de mot de passe</h1>
          </div>
          <div class="content">
            <p>Bonjour ${studentName},</p>
            <p>Votre mot de passe a été réinitialisé par l'administration.</p>
            
            <div class="credentials">
              <div style="margin: 10px 0;">
                <span class="credential-label">🔑 Nouveau mot de passe temporaire :</span>
                <span class="credential-value">${tempPassword}</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Sécurité :</strong> Changez ce mot de passe immédiatement après vous être connecté.
            </div>
            
            <p>Si vous n'avez pas demandé cette réinitialisation, contactez immédiatement l'administration.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};