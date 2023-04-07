const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, evm } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  // List of accounts
  accounts = await web3.eth.getAccounts();
  // From account at index 0, deploy contract to local test network.
  lottery = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("When Lottery contract is deployed", () => {
  it("Contract is successfully deployed", () => {
    // Validate if contract address is generated after deployment.
    assert.ok(lottery._address);
  });

  it("Allows one account to enter", async () => {
    // Account/Player at index 2 enters lottery game
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("1", "ether") });
    const players = await lottery.methods.getPlayerList().call();
    assert.equal(accounts[2], players[0]);
    assert.equal(1, players.length);
  });

  it("Allows multiple accounts to enter", async () => {
    // Account/Player at index 3, 4, 5 enters lottery game
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
  });

  it("Requires minimum amount of ether", async () => {
    // As its a negative scenario, on execution an error will be thrown which will be caight by catch statement
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
    // As its a negative scenario, on execution an error will be thrown which will be caight by catch statement
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
    // As its a negative scenario, on execution an error will be thrown which will be caight by catch statement
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
    assert(finalBalance > initialBalance);
  });
});
