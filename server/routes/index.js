const fs = require('fs');
const path = require('path');

module.exports = (app) => {
	fs.readdirSync('routes/api/').forEach((file) => {
		require(`./api/${file.substr(0, file.indexOf('.'))}`)(app);
	})
}



























// const express = require('express');
// var RateLimit = require('express-rate-limit');
// const fs = require('fs');
// const jwt = require ('jsonwebtoken');

// const app = express();

// //const read_string = fs.readFileSync('input.txt','utf8');
// //let read_string = fs.readFileSync('input.txt','utf8')

// const read_string =`Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,,mes  yeux  se  fermaient  si  vite  que  je n’avais pas le temps de me dire: «Je,m’endors.»  Et, une demi-heure après, la pensée qu’il était temps de chercher le,sommeil  m’éveillait;  je  voulais poser le volume que je croyais avoir dans les,mains  et  souffler  ma  lumière;  je  n’avais pas cessé en dormant de faire des,réflexions  sur  ce  que  je venais de lire, mais ces réflexions avaient pris un,tour  un  peu  particulier;  il me semblait que j’étais moi-même ce dont parlait,l’ouvrage:   une  église,  un  quatuor,  la  rivalité  de  François  Ier  et  de,Charles-Quint.

// Cette croyance survivait pendant quelques secondes à mon réveil;,elle  ne  choquait pas ma raison, mais pesait comme des écailles sur mes yeux et,les  empêchait  de  se  rendre compte que le bougeoir n’était plus allumé.
//  Puis,elle  commençait  à  me  devenir inintelligible, comme après la métempsycose les,pensées  d’une  existence  antérieure;  le  sujet  du livre se détachait de moi,,j’étais  libre de m’y appliquer ou non; aussitôt je recouvrais la vue et j’étais,bien  étonné de trouver autour de moi une obscurité, douce et reposante pour mes,yeux,  mais peut-être plus encore pour mon esprit, à qui elle apparaissait comme,une  chose sans cause, incompréhensible, comme une chose vraiment obscure. Je me,demandais  quelle  heure  il  pouvait être; j’entendais le sifflement des trains,qui,  plus ou moins éloigné, comme le chant d’un oiseau dans une forêt, relevant,les  distances,  me décrivait l’étendue de la campagne déserte où le voyageur se,hâte vers la station prochaine; et le petit chemin qu’il suit va être gravé dans,son  souvenir  par  l’excitation  qu’il  doit  à des lieux nouveaux, à des actes,inaccoutumés, à la causerie récente et aux adieux sous la lampe étrangère qui le,suivent  encore  dans  le silence de la nuit, à la douceur prochaine du retour.`



// // console.log('file readed');
// // console.log('file ',read_string);


// app.get('/api',(req,res)=>{

//     res.json({
//         message:'welecome to the API'
//     })
// });

// app.post('/api/justify',getToken,(req,res,)=>{
//     jwt.verify(req.token,'secretkey',(err,authData)=>{
//         if(err){
//             res.json({
//                 message:'token incorrect'
//             })
//         }else{

//             res.json({

//                 message : textJustification(read_string.split('\n').join(' ').split(' '),80),
//                 authData
//             })

//                 fs.writeFile('output.txt',e,(err,data) =>{
//                     if(err)
//                          console.log(err);

//                         console.log('success !!!');
//                 })

//         }
//     })
// })

// app.post('/api/token',(req,res)=>{
//     //create a user
//     const user ={
//         id:1,
//         username:'samir',
//         email:'samir@gmail.com'
//     }


//     jwt.sign({user},'secretkey',(err,token) => {
//         res.json({
//             token
//         });
//     });
// })

// //FORMAT OF TOKEN
// //Authorisation : Bearer acces_token
// //verify token
// function getToken(req,res,next){
//     //Get auth header value

//     const bearerHeader = req.headers['authorization'];
//     if(typeof bearerHeader !== 'undefined'){
//         const bearer = bearerHeader.split(' ');
//         //Get token from array
//         const bearerToken = bearer[1];
//         // set the token
//         req.token = bearerToken;
//         //next middleware
//         next();
//     }
//     else{
//         res.json({
//             message:'token incorrect'
//         })
//     }

//     }

//     // const fullJustify = (words, maxLen) => {
//     //     return asLines(words, maxLen).map(x => justify(x, maxLen))
//     //   }

//     //    const  asLines = (words, maxLen, curLine=[], charCount = 0, lines = []) => {

//     //     if (!words.length)
//     //       return lines.concat([curLine])

//     //     const nextWord        = words[0]
//     //     const remainingWords  = words.slice(1)
//     //     const additionalChars = nextWord.length + (curLine.length ? 1 : 0)
//     //     const nextCharCount   = charCount + additionalChars
//     //     const breakLine       = nextCharCount > maxLen

//     //     if (breakLine)
//     //       return asLines(words, maxLen, [], 0, lines.concat([curLine]))

//     //     return asLines( remainingWords, maxLen, curLine.concat(nextWord),
//     //       nextCharCount, lines )
//     //   }

//     //    const justify = (words, len) => {
//     //     if (words.length == 1)
//     //       return words[0] + ' '.repeat(len - words[0].length)

//     //     const numPaddedWords  = words.length - 1
//     //     const totalChars      = words.reduce((m, w) => m + w.length, 0)
//     //     const extraChars      = len - totalChars
//     //     const spaceBetween    = Math.floor(extraChars / numPaddedWords)
//     //     const spacer          = ' '.repeat(spaceBetween)
//     //     const extraSpaces     = extraChars - spaceBetween * numPaddedWords
//     //     const leftPaddedWords = words.slice(1).map(
//     //       (w, i) => spacer + (i < extraSpaces ? ' ' : '') + w
//     //     )
//     //     return [words[0], ...leftPaddedWords].join('')
//     //   }

//     function textJustification(words, l) {
//         //1. Split into lines, add between words to count
//         //2. Add spaces between words
//         // - Split extra spaces evenly between words
//         // - When spaces divide unevenly, split the extra and distribute again.
//         //  - For lines with one word only, words are left justified, spaces on the right.
//         // - For the last line of text, words are left justified, spaces on the right.

//        var lines = [];
//         var i = 0;
//         lines[i] = [];
//         for(var n in words) {
//           if(lines[i].join(' ').length === 0 && words[n].length <= l) {
//             lines[i].push(words[n]);
//           }
//           else if((lines[i].join(' ').length + words[n].length + 1) <= l) {
//             lines[i].push(words[n]);
//           }
//           else {
//             lines[++i] = [];
//             lines[i].push(words[n]);
//           }
//         }

//        for(var x in lines) {
//          var line = lines[x].join(" ");
//          var spaces = l - line.length;

//          // last line
//          if( x == lines.length - 1) {
//           lines[x] = appendSpaces(line, spaces);
//          }
//          // just 1 word on the line
//          else if(lines[x].length == 1) {
//           var word = lines[x].join("");
//           spaces = l - word.length;
//           lines[x] = appendSpaces(word, spaces);
//          }
//          else {
//           var w = lines[x];
//           var gaps = w.length - 1;
//           spaces = l - w.join("").length;
//           var extraSpaces = spaces % gaps;
//           var spacesPerGap = Math.floor(spaces / gaps);

//           line = "";
//           for(var j = 0; j < w.length; j++) {
//            var addOneSpace = false;
//            if(extraSpaces > 0) {
//             addOneSpace = true;
//             extraSpaces--;
//            }
//            var filler = spacesPerGap + (addOneSpace ? 1 : 0);
//            if (j == w.length - 1) {
//             line += w[j];
//            }
//            else {
//             line += appendSpaces(w[j], filler);
//            }
//           }

//          lines[x] = line;
//          }
//         }

//         return lines;
//        }

//        function appendSpaces(str, n) {
//          for(var x = 0; x < n; x++ ) {
//            str += " ";
//          }
//          return str;
//        }


// app.listen(5003,()=>console.log('serever listen 5002')
// );