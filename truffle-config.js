require('babel-register');
require('babel-polyfill');

//Hay que intalar npm install truffle-hdwallet-provider
var HDWalletProvider = require("truffle-hdwallet-provider")
//Poner la mnemonic phrase aquí
var mnemonic = "orange blue yellow ..."

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    //Hay que crearse una cuenta en infura y alli seleccionar el primer endpoint 
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic,"endpoint")
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
    //truffle migrate --network bscTestnet
    bscTestnet: {
      provider: () => new HDWalletProvider(mnemonic,"https://data-seed-prebsc-1-s1.binance.org:8545"),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.6.8",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
