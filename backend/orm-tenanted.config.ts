import cnn from 'src/orm-tenanted.config';

cnn.initialize().then(() => {
    console.log('cnn initialized to tenanted schema');
}).catch((err) => {
    console.log('cnn error', err);
});


export default cnn;
