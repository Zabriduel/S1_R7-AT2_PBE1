const { clienteModel } = require('../models/clienteModel');
const axios = require('axios');
const geolib = require('geolib');

const funcoesUteis = {

    /**
     * Função para calcular a distância em quilômetros entre endereço de origem e o CEP de um cliente,
     * utilizando coordenadas geográficas e o módulo geolib.     * 
     * @async
     * @function distanciaCeps
     * @param {number} pIdEndereco ID do endereço do cliente
     * @returns {Promise<string>} Distância em quilômetros com duas casas decimais
     * 
     * @example
     * // Chamada interna:
     * "8.42"
     */
    distanciaCeps: async (pIdEndereco) => {
        const dadosCliente = await clienteModel.selectEnderecoById(pIdEndereco);

        if (!dadosCliente || dadosCliente.length === 0) {
            throw new Error("Endereço do cliente não encontrado.");
        }

        const dadosCep = await (await fetch(`https://cep.awesomeapi.com.br/json/${dadosCliente[0].cep}`)).json();
        if (dadosCep.code == 'invalid') {
            throw new Error(dadosCep.message);
        };
        if (dadosCep.code == 'not_found') {
            throw new Error(dadosCep.message);
        };
        const saidaGalpao = { latitude: -22.81937, longitude: -47.27421 };
        const casaCliente = { latitude: dadosCep.lat, longitude: dadosCep.lng };

        const distanciaMetros = geolib.getDistance(saidaGalpao, casaCliente);
        const distanciaKm = (distanciaMetros / 1000).toFixed(2);

        return distanciaKm;
    },

    /**
    * Função para calcular a distância entre o endereço de origem e o endereço do cliente,
    * utilizando a API Google.
    * @async
    * @function calcularDistancia
    * @param {number} pIdEndereco ID do endereço do cliente
    * @returns {Promise<string>} Distância em quilômetros com duas casas decimais
    * 
    * @example
    * // Chamada interna:
    * "12.75"
    * 
    */
    calcularDistancia: async (pIdEndereco) => {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const dadosCliente = await clienteModel.selectEnderecoById(pIdEndereco);

        if (!dadosCliente || dadosCliente.length === 0) {
            throw new Error("Endereço do cliente não encontrado.");
        }

        const dadosCep = await (await fetch(`https://cep.awesomeapi.com.br/json/${dadosCliente[0].cep}`)).json();
        if (dadosCep.code == 'invalid') {
            throw new Error(dadosCep.message)
        };
        if (dadosCep.code == 'not_found') {
            throw new Error(dadosCep.message);
        };

        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=-22.81937,-47.27421&destinations=${dadosCep.lat},${dadosCep.lng}&key=${apiKey}`;

        try {
            const resultado = await axios.get(url);
            const data = resultado.data;
            
            if (data.status !== 'OK') {
                throw new Error('Erro na API do Google');
            }

            const elemento = data.rows[0].elements[0];
            const distanciaMetros = elemento.distance.value;
            const distanciaKm = (distanciaMetros / 1000).toFixed(2);
            return distanciaKm



        } catch (error) {
            console.error('Erro ao calcular distância:', error);
            throw error;
        }
    },

    /**
     * Função para buscar dados de um CEP utilizando a API ViaCEP.Rota usada nos cadastros de cliente e endereço.
     * 
     * @async
     * @function dadosCep
     * @param {string} cep CEP informado pelo usuário
     * @returns {Promise<Object>} Objeto contendo logradouro, bairro, cidade e estado
     * 
     * @example
     *  {
            "endereco": {
                "cep": "84262240",
                "logradouro": "Rua Santo Antônio",
                "bairro": "Bela Vista do Paraíso",
                "cidade": "Telêmaco Borba",
                "estado": "PR",
                "numero": "990",
                "complemento": "Casa"
            }
        }
     * 
     * @throws {Error} Se o CEP for inválido ou não existir no ViaCEP
     */
    dadosCep: async (cep) => {
        if (!cep || String(cep).length !== 8 || isNaN(Number(cep))) {
            throw new Error("CEP inválido ou não informado.");
        }

        console.log("CEP recebido:", cep);

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const json = await response.json();

        if (json.erro) {
            throw new Error("CEP não encontrado no ViaCEP.");
        }

        return {
            logradouro: json.logradouro,
            bairro: json.bairro,
            cidade: json.localidade,
            estado: json.uf
        };
    }

}
module.exports = { funcoesUteis };
