/* tategaki index.js */
/*eslint-env node */
/*eslint no-console: off */

import path from 'path';
import Koa from 'koa';
import serv from 'koa-static';

const app = new Koa();

app.use(async (ctx, next) => {
  const path = ctx.request.path;

  if (path === '') {
    console.log(`add slash:${ctx.url}`);
    console.log(`url:${ctx.request.url}`);
    console.log(`path:${ctx.request.path}`);
    ctx.request.path += '/';
    console.log(`url:${ctx.request.url}`);
    console.log(`path:${ctx.request.path}`);
  }

  await next();
});

// static resource
app.use(serv(path.join(__dirname, '/'), {
  index: 'index.html',
  extensions: ['html']
}));

export default app;
