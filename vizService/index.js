const restify = require('restify');
const fs = require('fs');
const sqrl = require('squirrelly')

async function visualize(req, res, next) {
  console.log('request received : ' + req);
  const {
    sketchify,
    grammar,
    dataset,
  } = req.query;

  console.log(dataset);
  const data_buffer = new Buffer(dataset, 'base64');
  const decode_data = data_buffer.toString('utf-8');
  console.log(decode_data);

  fs.readFile('./template/viz.html', 'utf8', (err, data) => {
    if (err) throw err;
    const html = sqrl.Render(data, {
        sketchify: parseInt(sketchify),
        grammar:grammar,
        dataset:decode_data,
    });
    console.log(html);
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(html),
      'Content-Type': 'text/html'
    });
    res.write(html);
    res.end();
  });
}

const server = restify.createServer();
server.use(restify.plugins.queryParser());
server.get('/viz', visualize);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});