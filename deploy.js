// deploy code will go here

const HDWalletProvider = require("@truffle/hdwallet-provider");
const provider = new HDWalletProvider(
  "veteran rival stand spot figure result coffee unlock nerve pool enjoy nasty",
  "https://goerli.infura.io/v3/907858062dee4354aebf39f9a1f75040"
);
const Web3 = require("web3");
const web3 = new Web3(provider);
const { abi, evm } = require("./compile");

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from Metamask account:", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("Contract deployed at address:", result._address);
  provider.engine.stop();
};
deploy();
