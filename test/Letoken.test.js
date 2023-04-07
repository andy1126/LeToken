const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LeToken", function () {
  let token1;
  let token2;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    token2 = await ethers.getContractFactory("LeToken");
    token2 = await token2.connect(owner).deploy("Le Token", "LTK", 100, 50);
    await token2.connect(owner).issue(1000);
  });

  it("should have correct name, symbol, and decimals", async function () {
    expect(await token2.name()).to.equal("Le Token");
    expect(await token2.symbol()).to.equal("LTK");
    expect(await token2.decimals()).to.equal(18);
  });

  it("should have correct initial total supply", async function () {
    expect(await token2.totalSupply()).to.equal(1000);
  });

  it("should allow owner to issue more tokens", async function () {
    await token2.connect(owner).issue(500);
    expect(await token2.totalSupply()).to.equal(1500);
  });

  it("should not allow non-owner to issue more tokens", async function () {
    await expect(token2.connect(addr1).issue(500)).to.be.revertedWith("Only owner can issue tokens");
  });

  it("should allow owner to burn tokens", async function () {
    await token2.connect(owner).burn(500);
    expect(await token2.totalSupply()).to.equal(500);
  });

  it("should not allow non-owner to burn tokens", async function () {
    await expect(token2.connect(addr1).burn(500)).to.be.revertedWith("Only owner can burn tokens");
  });

  it("should transfer tokens with transaction fee and burn", async function () {
    await token2.connect(owner).transfer(addr1.address, 100);
    expect(await token2.balanceOf(addr1.address)).to.equal(50);
    expect(await token2.balanceOf(owner.address)).to.equal(50);
    expect(await token2.totalSupply()).to.equal(950);
  });

  it("should not transfer tokens if sender has insufficient balance", async function () {
    await expect(token2.connect(addr1).transfer(addr2.address, 100)).to.be.revertedWith("Not enough balance to make the transfer");
  });
});