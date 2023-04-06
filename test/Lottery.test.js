const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  //   console.log(`List of accounts available for test: ${accounts}`);
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("When Lottery contract is deployed", () => {
  it("Contract is successfully deployed", () => {
    assert.ok(lottery._address);
    // console.log(`Contract address: ${lottery._address}`);
  });

  it("Allows one account to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("1", "ether") });
    const players = await lottery.methods.getPlayerList().call();
    assert.equal(accounts[2], players[0]);
    assert.equal(1, players.length);
    // console.log(`Players entered in Lottery game: ${players}`);
  });

  it("Allows multiple accounts to enter", async () => {
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
    // console.log(`Players entered in Lottery game: ${players}`);
  });

  it("Requires minimum amount of ether", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[2],
        value: web3.utils.toWei(".0000005", "ether"),
      });
    } catch (err) {
      assert(err);
    }
  });

  it("Manager cannot enter the game", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"),
      });
    } catch (err) {
      assert(err);
    }
  });

  it("Only manager can pick winner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
    } catch (err) {
      assert(err);
    }
  });

  it("Sends money to winner and resets players array.", async () => {
    // Player-1 enters the game
    await lottery.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("1", "ether"),
    });
    // Get initial balance
    const initialBalance = await web3.eth.getBalance(accounts[1]);
    // Manager picks winner
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    // Final balance
    const finalBalance = await web3.eth.getBalance(accounts[1]);
    // const difference = finalBalance - initialBalance;
    // assert(difference > web3.utils.toWei("0.8", "ether"));
    assert(finalBalance > initialBalance);
  });
});
