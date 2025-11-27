const mysql = require('mysql2/promise');

const poll = mysql.createPool({
    host: '10.87.169.15',
    user: 'gabriel',
    password: 'MySQL1234',
    database: 'rapidoEseguro',
    port: '3306',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await poll.getConnection();
        console.log('Conectando ao MySQL');
        connection.release;
    } catch (error) {
        console.error(`Erro co conectar com o MySQL: ${error}`);
    }
})();

module.exports = { poll };