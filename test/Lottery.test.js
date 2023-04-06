const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log(`List of accounts available for test: ${accounts}`);
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("When Lottery contract is deployed", () => {
  xit("Contract is successfully deployed", () => {
    assert.ok(lottery._address);
    console.log(`Contract address: ${lottery._address}`);
  });

  xit("Allows one account to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("1", "ether") });
    const players = await lottery.methods.getPlayerList().call();
    assert.equal(accounts[2], players[0]);
    assert.equal(1, players.length);
    console.log(`Players entered in Lottery game: ${players}`);
  });

  xit("Allows multiple accounts to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[3], value: web3.utils.toWei("1", "ether") });
    await lottery.methods
      .enter()
      .send({ from: accounts[4], value: web3.utils.toWei("1", "ether") });
    await lottery.methods
      .enter()
      .send({ from: accounts[5], value: web3.utils.toWei("1", "ether") });
    const players = await lottery.methods.getPlayerList().call();
    assert.equal(accounts[3], players[0]);
    assert.equal(accounts[4], players[1]);
    assert.equal(accounts[5], players[2]);
    assert.equal(3, players.length);
    console.log(`Players entered in Lottery game: ${players}`);
  });
});
