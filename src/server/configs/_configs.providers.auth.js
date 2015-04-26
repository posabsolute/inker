/*
* Services config
* Names are case sensitive
* '1und1', 'AOL', 'DynectEmail', 'FastMail', 'GandiMail', 'Gmail', 'Godaddy', 'GodaddyAsia', 'GodaddyEurope'
* 'hot.ee', 'Hotmail', 'iCloud', 'mail.ee', 'Mail.ru', 'Mailgun', 'Mailjet', 'Mandrill', 'Naver', 'Postmark', 'QQ', 'QQex'
* 'SendCloud', 'SendGrid', 'SES', 'Yahoo', 'Yandex', 'Zoho'
*/
module.exports = {
	"services" : {
		// Info: http://alexselzer.com/nodemailer-mailgun/
		"MailGun" : {
			"auth" : {
		     	user: "user@account.mailgun.org",
		     	pass: "password"
		   	}
		},
		// pass is api key
		"Mandrill" : {
			"auth" : {
		     	user: "email@gmail.com",
		     	pass: "APIKEY"
		   	}
		},
		// Info https://sendgrid.com/blog/sending-email-nodemailer-sendgrid/
		"SendGrid" : {
			"auth" : {
			    user: 'username',
			    pass: 'password'
		   	}
		}
	}
};