# Api-justify

in order to use the API_justify
you have to:

1-register using /api/register :
 username,email,password

2-login using  api/login:
 email,password

the api return you a unique token

3-to justfy your use text use  api/justify:

rate limit is fixed per day, more 80 000 words a payment is required.


since I used an ORM : sequelize  the api can be work either online (using the postgreSQL DB) or locally (using SQLite).
