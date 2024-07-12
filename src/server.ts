import bootstrap from './app';

bootstrap()
   .attachWebhook()
   .then((app) => {
      app.listen(3000, () => {
         console.log('webhook attached');
      });
   });
