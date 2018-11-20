const jwt = require('jsonwebtoken');
const user = require('../../modelData/dummyUser');

module.exports = (app) => {

    app.post('/api/user/create', (req, res, next) => {
        const { body } = req;
        const { username } = body;
        const { email } = body;
        const { password } = body;
        console.log(username);
        console.log(password);
        res.json({
            username,
            email,
            password
        })
    })

    app.post('/api/user/login', (req, res, next) => {
        const { body } = req;
        const { username } = body;
        const { password } = body;
        console.log(username);
        console.log(password);

        //checking to make sure the user entered the correct username/password combo
        if(username === user.username && password === user.password) {
            //if user log in success, generate a JWT token for the user with a secret key
            jwt.sign({user}, 'privatekey', { expiresIn: '1h' },(err, token) => {
                if(err) { console.log(err) }
                res.send(token);
            });
        } else {
            console.log('ERROR: Could not log in');
        }
    })

    //This is a protected route
    app.get('/api/user/data', checkToken, (req, res) => {
        //verify the JWT token generated for the user
        jwt.verify(req.token, 'privatekey', (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {

                //If token is successfully verified, we can send the autorized data
                res.json({
                    message: 'Successful log in',
                    authorizedData
                });
                console.log('SUCCESS: Connected to protected route');
            }
        })
    });



    app.post('/api/justify', checkToken, (req, res) => {
        //verify the JWT token generated for the user
        jwt.verify(req.token, 'privatekey', (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
               const { body } = req
               const { text } = body
                //If token is successfully verified, we can send the autorized data
                res.json({
                    message: textJustification(text.split(' '),80)

                });
                console.log('SUCCESS: Connected to protected route');
            }
        })
    });
}

    //This is a protected route

//Check to make sure header is not undefined, if so, return Forbidden (403)
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

    function textJustification(words, l) {
        //1. Split into lines, add between words to count
        //2. Add spaces between words
        // - Split extra spaces evenly between words
        // - When spaces divide unevenly, split the extra and distribute again.
        //  - For lines with one word only, words are left justified, spaces on the right.
        // - For the last line of text, words are left justified, spaces on the right.

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

       function appendSpaces(str, n) {
         for(var x = 0; x < n; x++ ) {
           str += " ";
         }
         return str;
       }
