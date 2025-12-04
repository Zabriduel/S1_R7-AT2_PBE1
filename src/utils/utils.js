const geolib = require('geolib');

const funcoesUteis = {
    distanciaCeps: async (pIdEndereco) => {
        try {
            const dadosCliente = await clienteModel.selectEnderecoById(pIdEndereco);

            const dadosCep = await (await fetch(`https://cep.awesomeapi.com.br/json/${dadosCliente[0].cep}`)).json();
            if (dadosCep.code == 'ivalid') {
                return res.status(400).json({ message: dadosCep.message });
            }

            const saidaGalpao = { latitude: -22.81937, longitude: -47.27421 };
            const casaCliente = { latitude: dadosCep.lat, longitude: dadosCep.lng };

            const distanciaMetros = geolib.getDistance(saidaGalpao, casaCliente);
            const distanciaKm = (distanciaMetros / 1000).toFixed(2);

            return distanciaKm;

        } catch (error) {
            console.error("Erro ViaCEP:", error);
            return { erro: true, message: "Erro ao consultar o ViaCEP." };
        }
    }
}

module.exports = { funcoesUteis }