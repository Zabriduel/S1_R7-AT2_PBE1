const { clienteModel } = require('../models/clienteModel');
const geolib = require('geolib');

const funcoesUteis = {
    distanciaCeps: async (pIdEndereco) => {
        const dadosCliente = await clienteModel.selectEnderecoById(pIdEndereco);

        if (!dadosCliente || dadosCliente.length === 0) {
            throw new Error("Endereço do cliente não encontrado.");
        }

        const dadosCep = await (await fetch(`https://cep.awesomeapi.com.br/json/${dadosCliente[0].cep}`)).json();
        if (dadosCep.code == 'invalid') {
            throw new Error(dadosCep.message)
        };


        const saidaGalpao = { latitude: -22.81937, longitude: -47.27421 };
        const casaCliente = { latitude: dadosCep.lat, longitude: dadosCep.lng };

        const distanciaMetros = geolib.getDistance(saidaGalpao, casaCliente);
        const distanciaKm = (distanciaMetros / 1000).toFixed(2);

        return distanciaKm ;
    },

    DadosCep: async (cep) => {
        try {
            if (!cep || String(cep).length !== 8 || isNaN(Number(cep))) {
                return { erro: true, message: "CEP inválido ou não informado." };
            }
            console.log(cep);
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const json = await response.json();

            if (json.erro) {
                return { erro: true, message: "CEP não encontrado no ViaCEP." };
            }

            return {
                erro: false,
                logradouro: json.logradouro,
                bairro: json.bairro,
                cidade: json.localidade,
                estado: json.uf
            };

        } catch (error) {
            console.error("Erro ViaCEP:", error);
            return { erro: true, message: "Erro ao consultar o ViaCEP." };
        }

    }

}

module.exports = { funcoesUteis }