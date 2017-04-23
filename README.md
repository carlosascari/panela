## panela

A lightweight web development framework, rich in functionality.

**Highlights**

- Static pages are served with nginx.
- Subdomains + ssl updgrades are also handled with nginx.
- Dynamic pages are rendered with express.
- Works with most Connect middlewares, and all Express middlewares.
- Database configuration with model scaffolding is powered by knex.
- Includes a watchable build processor w/ a seamless LiveReload integration.

> Panela is a framework intended to be a practical tool for web development. 

As a web developer you may need to create frontend heavy website with no or very litte server-side features, or a server-side heavy site with little or heavy frontend. 

> Panela provides an intuitive and familiar api.

If you are familiar with express, Panela's api is very similar, and you can take advantage of existing express middlewares.

> Panela serves a configurable live reload script to all html pages.

By taking advantage of the Build Processor api, files that are built can be watched for changes and update a page being previewd in the browser automatically.
This feature is not included in a `production` enviroment.

## Installation

`npm i panela --save`

## Basic Usage

```
const panela = require('panela');

const app = panela();

app.host('chiki.com', {})
  .get('/', '~/Home.html')
  .get('/add/:url', (req, res) => {
    res.end('ok');
  })
  .get('/:hash', (req, res) => {
    res.end('ok');
  })

app.listen()
  .then((hostname, port, pid) => {
    console.log('Ok!');
  })
  .catch(e => console.log(e));

```

## Advance Usage

```
const panela = require('panela');

const app = panela();

app.builder('website', {
  out: './dist'
})
.step((done) => {
  // Create Directory
  done();
})
.step((done) => {
  // Create Directory
  done();
})
.step((done) => {
  // LESS
  done();
})
.step((done) => {
  // JS
  done();
})
.step((done) => {
  // FONTS
  done();
})
.step((done) => {
  // Images, Videos, Audio
  done();
});

app.database('main', {
  client: 'sqlite',
  connection: {
    filename: './chiki.db'
  },
  migrations: {
    extension: 'js',
    tableName: 'knex_migrations',
    directory: './migrations',
    disableTransactions: false
  },
  pool: { max: 10, min: 2 },
  seeds: {
    extension: 'js',
    directory: './seeds'
  },
  useNullAsDefault: true,
});

app.engine('mustache-regexp', {
  views: '~/views',
  extension: 'html',
  defaultLocals: {},
  defaultLayout: '',
  render: (path, options={}) => {
    const { layout, locals } = options;
    return new Promise((ok, bad) => {
      ok('<render>');
    });
  }
});

app.host('chiki.com', {
  port: 80,
  nginx: {},
})
.options('/', (req, res) => {
  res.end();
})
.get('/', (req, res) => {
  res.end();
})

app.host('static.chiki.com', {})
.static('~/static/')

app.host('chiki.com', {})
.get('/', '~/Home.html')
.get('/add/:url', (req, res) => {
  res.end('ok');
})
.get('/x/:url', (req, res) => {
  res.end('ok');
})
.get('/:hash', (req, res) => {
  res.end('ok');
})

app.host('api.chiki.com', {})
.get('/', (req, res) => {
  res.json({ok: true});
})
.get('/:hash', (req, res) => {
  res.json({ok: true});
})
.post('/:hash', (req, res) => {
  res.json({ok: true});
})
.route('/extra', route => {
  route
  .get('/', '~/extra.html')
  .get('/apples', '~/extra-apples.html')
  .get('/oranges', '~/extra-oranges.html')
  .route('/eat', route => {
    route.get('/', 'xxx');
    route.post('/eat', 'xxx');
  })
})

app.builder('website').build()
.then(b => {
  app.database('main').latest()
  .then(k => {
    app.listen()
    .then(l => {
      console.log('Ok!');
    })
    .catch(e => console.log(e));
  })
  .catch(e => console.log(e))
})
.catch(e => console.log(e));

```