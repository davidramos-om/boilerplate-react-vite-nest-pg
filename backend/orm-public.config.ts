import cnn from 'src/orm-public.config';

cnn.initialize().then(() => {
  console.log('cnn initialized to public schema');
}).catch((err) => {
  console.log('cnn error', err);
});


export default cnn;
