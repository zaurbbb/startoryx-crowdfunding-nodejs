const nodemailer = require('nodemailer')

class MailService{

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_APP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on ' + process.env.URL,
            text: '',
            html:
                `
                    <div>
                        <h1>To activate follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }

    async sendResetLink(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Reset password on ' + process.env.URL,
            text: '',
            html:
                `
                    <div>
                        <h1>To reset your password follow the link</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}

module.exports = new MailService()