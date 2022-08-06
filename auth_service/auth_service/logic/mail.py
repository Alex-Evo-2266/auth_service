import yaml, smtplib
import logging
from auth_service.settings import config

logger = logging.getLogger(__name__)

async def send_email(subject, to_email, message):
	"""
	Send an email
	"""
	logger.debug(f"send email input param. subject: {subject}, to_email: {to_email}, message: {message}")

	try:
		if (not to_email or to_email == ""):
			logger.error("no recipient's email.")
			return
		from_email = config.get("email_login")
		password = config.get("email_password")
		if(not from_email or not password):
			logger.error("no login or password from email")
			return
		if(from_email == '' or password == ''):
			logger.warning("no login or password from email")
			return

		BODY = "\r\n".join((
			"From: %s" % from_email,
			"To: %s" % to_email,
			"Subject: %s" % subject ,
			"",
			message
		))
		server = smtplib.SMTP_SSL('smtp.mail.ru')
		server.login(from_email,password)
		server.sendmail(from_email,to_email,BODY)
		server.quit()
	except Exception as e:
		logger.error(f"error send email. detail: {e}")