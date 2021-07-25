import { expect } from "chai";
import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { beforeEach } from "mocha";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

chai.use(solidity);

describe("Bored Ape", () => {
  let boredApeContract: Contract;
  let owner: SignerWithAddress;
  let address1: SignerWithAddress;

  beforeEach(async () => {
    const BoredApeFactory = await ethers.getContractFactory(
      "BoredApeYachtClub"
    );
    [owner, address1] = await ethers.getSigners();
    boredApeContract = await BoredApeFactory.deploy(
      "Bored Ape Yacht Club",
      "BAYC",
      10000,
      1
    );
  });

  it("Should initialize the Bored Ape contract", async () => {
    expect(await boredApeContract.MAX_APES()).to.equal(10000);
  });

  it("Should set the right owner", async () => {
    expect(await boredApeContract.owner()).to.equal(await owner.address);
  });

  it("Should mint an ape", async () => {
    await boredApeContract.flipSaleState();
    const apePrice = await boredApeContract.apePrice();
    const tokenId = await boredApeContract.totalSupply();
    expect(
      await boredApeContract.mintApe(1, {
        value: apePrice,
      })
    )
      .to.emit(boredApeContract, "Transfer")
      .withArgs(ethers.constants.AddressZero, owner.address, tokenId);
  });
});
