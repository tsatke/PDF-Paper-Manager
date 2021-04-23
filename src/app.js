require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');

const io = require('./io');


const app = express();
app.set('view engine', 'handlebars');

app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/../views/layouts',
    helpers: require('./handlebars-helpers')
}));

app.use(express.static(__dirname + '/../public'))

app.get('/', async (req, res) => {
    const [parsedPapers, invalidPaperFileNames] = await io.getPaperList();
    res.render('main', {layout: 'index', papers: parsedPapers, invalidPaperFileNames: invalidPaperFileNames});
});

app.get('/papers', async (req, res) => {
    res.header("Content-Type",'application/json');
    return res.send(JSON.stringify(await io.getPaperList(), null, 4));
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
