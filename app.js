var express = require('express');
// var ejs = require('ejs');
var app = express();

app.set('views', `${__dirname}/dist`);
// app.engine('html', ejs.renderFile);
app.set('view engine','html');

app.use(express.static(__dirname + '/dist', {
  index: '화면목록.html'
}));


// app.use('/', (req, res) => {
//   res.send('<meta http-equiv="refresh" content="0; url=/화면목록.html">');
// });

// app.use('/', (req, res) => {
//   res.send('화면목록.html');
// });

// app.use("/common", express.static(__dirname + '/common'));
// app.use("/css", express.static(__dirname + '/css'));



var server = app.listen(8100, () =>{
  console.log('done');
});