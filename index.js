const configExpress = require('./config/configExpress');

app = configExpress();

app.listen(3000, () => console.log('Servidor Rodando na porta 3000'))
