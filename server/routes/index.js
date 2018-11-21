const jwt = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
const models = require ('../../models');

/**
 * email regex
 * password regex
 * private key
 */
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;
const PRIVATE_KEY ='privatekey'

module.exports = (app) => {

	app.get('/',(req,res) => {
		res.status(200).send(`<h3>Welcome !</h3>`)
	})
	/**
	 * api/register :create a count
	 */
	app.post('/api/register', (req, res, next) => {
		const { body } = req;
		const { username, email, password } = body;

		if (email == null || username == null || password == null) {
				return res.status(400).json({ 'error': 'missing parameters' });
			}

		if (username.length >= 13 || username.length <= 4) {
				return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
			}

		if (!EMAIL_REGEX.test(email)) {
				return res.status(400).json({ 'error': 'email is not valid' });
			}

		if (!PASSWORD_REGEX.test(password)) {
				return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
			}
		/**
		 * check if the email user already exist
		 */
		models.users.findOne({
			attributes: ['email'],
			where: { email: email }
			}).then((userFound) => {
					if(!userFound){
						bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
							const newUser = new models.users({
								email: email,
								name: username,
								passeword: bcryptedPassword,
								})
								newUser.save();
						})
						return res.status(201).json({Message: "new user created"});
					}else{
						return res.status(409).json({ 'error': 'user already exist' })
					}
			}).catch((err) => {
				return res.status(500).json({ 'error': 'unable to verify user' });
			});
	})
	/***
	 * login to get a token
	 */
	app.post('/api/login', (req, res, next) => {
		const { body } = req;
		const { email, password } = body;

		if (email == null ||  password == null) {
			return res.status(400).json({ 'error': 'missing parameters' });
			}
			/**
			 * check if the email exist and the password is correct
			 */
			models.users.findOne({
				where: { email: email }
			})
				.then((userFound) => {
					if(userFound){
						bcrypt.compare(password, userFound.passeword, function(errBycrypt, resBycrypt) {
							if(resBycrypt){
									jwt.sign({userFound}, PRIVATE_KEY,(err, token) => {
										if(err) { console.log(err) }
										res.json({
												token,
												email
										});
									});
							}else{
									return res.status(403).json({ 'error': 'invalid password' });
								}
						})
					}else{
						return res.status(404).json({ 'error': 'user not exist in DB' });
					}
			})
			.catch(function(err) {
				return res.status(500).json({ 'error': 'unable to verify user' });
			});
	})
	/**
	 * justify the text
	 */
	app.post('/api/justify', checkToken, (req, res) => {
		const {body} = req
		/**
		 *verify the JWT token generated for the user
		 */
		jwt.verify(req.token, PRIVATE_KEY, (err, authorizedData) => {
				if(err){
					/**
					 * If error send Forbidden (403)
					 */
					console.log('ERROR: Could not connect to the protected route');
					res.sendStatus(403);
				} else {
						const  email = authorizedData.userFound.email
						const { text } = body
						models.users.findOne({
						where: { email: email }
					}).then((userFound) => {
							if(userFound){

								const nowDate = new Date();
								const nowDateMili = nowDate.getTime();
								const lastRate =  userFound.ratelimit +text.split(' ').length*80;
								const nbHourFromLastUpdate = (nowDateMili- userFound.updatedAt.getTime())/3600000
								if(nbHourFromLastUpdate >=25 && lastRate>80000){
									userFound.ratelimit = text.split(' ').length*80
									userFound.save()
									res.status(201).json({
										message: textJustification(text.split(' '),80),
									});
								}
								else if(nbHourFromLastUpdate <25 && lastRate>80000){
									return res.status(402).json({ 'error': 'Payment required' });
								}else{
									userFound.ratelimit = lastRate
									userFound.save()
									res.status(201).json({
										message: textJustification(text.split(' '),80),
									});
								}
							}else{
								return res.status(404).json({ 'error': 'incorrect token' });
							}
					}).catch((err) => {
						return res.status(500).json({ 'error': 'unable to verify user' });
					});
				}
		})
	});
}

/**
 *Check to make sure header is not undefined, if so, return Forbidden (403)
 */
const checkToken = (req, res, next) => {
	const header = req.headers['authorization'];
	if(typeof header !== 'undefined') {
			const bearer = header.split(' ');
			const token = bearer[1];

			req.token = token;
			next();
	} else {
			//If header is undefined return Forbidden (403)
			res.sendStatus(403)
	}
}

const  textJustification = (words, l) => {
		/**
		 * 1. Split into lines, add between words to count
		 * 2. Add spaces between words
		 *	- Split extra spaces evenly between words
		 *	- When spaces divide unevenly, split the extra and distribute again.
		 *  - For lines with one word only, words are left justified, spaces on the right.
		 *  - For the last line of text, words are left justified, spaces on the right.
		 */
		var lines = [];
		var i = 0;
		lines[i] = [];
		for(var n in words) {
			if(lines[i].join(' ').length === 0 && words[n].length <= l) {
				lines[i].push(words[n]);
			}
			else if((lines[i].join(' ').length + words[n].length + 1) <= l) {
				lines[i].push(words[n]);
			}
			else {
				lines[++i] = [];
				lines[i].push(words[n]);
			}
		}

		for(var x in lines) {
			var line = lines[x].join(" ");
			var spaces = l - line.length;

			// last line
			if( x == lines.length - 1) {
			lines[x] = appendSpaces(line, spaces);
			}
			// just 1 word on the line
			else if(lines[x].length == 1) {
			var word = lines[x].join("");
			spaces = l - word.length;
			lines[x] = appendSpaces(word, spaces);
			}
			else {
			var w = lines[x];
			var gaps = w.length - 1;
			spaces = l - w.join("").length;
			var extraSpaces = spaces % gaps;
			var spacesPerGap = Math.floor(spaces / gaps);

			line = "";
			for(var j = 0; j < w.length; j++) {
				var addOneSpace = false;
				if(extraSpaces > 0) {
				addOneSpace = true;
				extraSpaces--;
				}
				var filler = spacesPerGap + (addOneSpace ? 1 : 0);
				if (j == w.length - 1) {
				line += w[j];
				}
				else {
				line += appendSpaces(w[j], filler);
				}
			}

			lines[x] = line;
			}
		}

		return lines;
		}
const appendSpaces = (str, n) => {
	for(var x = 0; x < n; x++ ) {
		str += " ";
	}
	return str;
}
