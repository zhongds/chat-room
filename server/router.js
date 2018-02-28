const Router = require('koa-router');
const router = new Router();
router.get('/login', (ctx, next) => {
  console.log('login ctx', ctx);
}).get('/', (ctx, next) => {
  console.log('root router', ctx);
})

module.exports = router;
