const Koa = require('koa');
const send = require('koa-send');
const app = new Koa();

const PAGE_PREFIX_PATH = '/pages';
const STATIC_PREFIX_PATH = '/static';
const WEB_STATIC_LOCATION = './build';
const OSS_DOMAIN = 'http://static.7shengzhaohuan.online';
const LPSIM_PREFIX_PATH = '/lpsim';
const LPSIM_API_PREFIX = '/api';
const LPSIM_LOCATION = './lpsim';
const LPSIM_DOMAIN = 'http://localhost:8000';
// response
// XXX: 所有的接口请求都必须放置在静态文件服务之前
app.use(async ctx => {
  // react编译后的静态文件的地址
  if (ctx.path.startsWith(STATIC_PREFIX_PATH)){
    ctx.redirect(`${OSS_DOMAIN}${ctx.path}`);
    // await send(ctx, ctx.path, {
    //   root: WEB_STATIC_LOCATION,
    //   index: 'index.html',
    // });
  } else if(ctx.path.startsWith(LPSIM_PREFIX_PATH)){
    const path = ctx.path.replace(LPSIM_PREFIX_PATH, '');
    if(path.startsWith(LPSIM_API_PREFIX)){
      const apiPath = path.replace(LPSIM_API_PREFIX, '');
      ctx.redirect(`${LPSIM_DOMAIN}${apiPath}`);
    } else if(path === '/' || path === ''){
      await send(ctx, `${LPSIM_LOCATION}/index.html`);
    } else {
      // 有点hack, 后面还是上cdn吧……
      await send(ctx, `${LPSIM_LOCATION}/lpsim/${path}`);
    }
  } else {
    // react的页面访问入口文件
    await send(ctx, `${WEB_STATIC_LOCATION}/index.html`);
  }
});

app.listen(13948);