import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

let owner: any;
let buyer1: any;
let buyer2: any;
let buyer3: any;
let USDC: any;
let USDCAddress: any;
let NFT: any;
let NFTAddress: any;
const NFT_uri: string = "ipfs://MyCustomNFT";

describe("Create Initial Contracts of all types", function () {
  it("get accounts", async function () {
    [owner, buyer1, buyer2, buyer3] =
      await ethers.getSigners();
    console.log("\tAccount address\t", await owner.getAddress());
  });
  it("should deploy USDC Contract", async function () {
    const instanceUSDC = await ethers.getContractFactory("USDCToken");
    USDC = await instanceUSDC.deploy();
    USDCAddress = await USDC.getAddress();
    console.log("\tUSDC Contract deployed at:", USDCAddress);
  });
  it("should deploy NFT Contract", async function () {
    const instanceNFT = await ethers.getContractFactory("CustomNFT");
    NFT = await instanceNFT.deploy();
    NFTAddress = await NFT.getAddress();
    console.log("\tNFT Contract deployed at:", NFTAddress);
    await NFT.setUSDC(USDCAddress);
  });
  it("set tokenURI", async function(){
    await NFT.setURI(0, "first Logo");
    await NFT.setURI(1, "second Logo");
    await NFT.setURI(2, "third Logo");
  })
});
describe("Send USDC to buyers", async function(){
  it("start distributing FeeToken", async function(){
    await USDC.transfer(buyer1.address, ethers.parseUnits("10000", 6));
    await USDC.transfer(buyer2.address, ethers.parseUnits("10000", 6));
    await USDC.transfer(buyer3.address, ethers.parseUnits("10000", 6));
    expect(await USDC.balanceOf(buyer1.address)).to.equal(ethers.parseUnits("10000", 6));
    expect(await USDC.balanceOf(buyer2.address)).to.equal(ethers.parseUnits("10000", 6));
    expect(await USDC.balanceOf(buyer3.address)).to.equal(ethers.parseUnits("10000", 6));
  })
})

describe("buy NFT", async function(){
    it("buyer1 : buy NFT", async function(){
        await USDC.connect(buyer1).approve(NFTAddress, ethers.parseUnits("3000", 6));
        await NFT.connect(buyer1).buyWithUSDC([0],[3]);
        expect(await NFT.balanceOf(buyer1, 0)).to.equal(3);
    })
    it("buyer2 : buy NFT", async function(){
        await USDC.connect(buyer2).approve(NFTAddress, ethers.parseUnits("4000", 6));
        await NFT.connect(buyer2).buyWithUSDC([0, 1],[2, 2]);
        expect(await NFT.balanceOf(buyer2, 0)).to.equal(2);
        expect(await NFT.balanceOf(buyer2, 1)).to.equal(2);
    })
    it("buyer3 : buy NFT", async function(){
        await USDC.connect(buyer3).approve(NFTAddress, ethers.parseUnits("6000", 6));
        await NFT.connect(buyer3).buyWithUSDC([0, 1, 2],[1, 2, 3]);
        expect(await NFT.balanceOf(buyer3, 0)).to.equal(1);
        expect(await NFT.balanceOf(buyer3, 1)).to.equal(2);
        expect(await NFT.balanceOf(buyer3, 2)).to.equal(3);
    })
    it("check owner's USDC balance", async function(){
        expect(await USDC.balanceOf(owner.address)).to.equal(ethers.parseUnits("10000000000", 6) - ethers.parseUnits("30000", 6) + ethers.parseUnits("13000", 6));
    })
    it("uri", async function(){
      const uri_1 = await NFT.uri(0);
      const uri_2 = await NFT.uri(1);
      const uri_3 = await NFT.uri(2);
      console.log("\turi_1 : ", uri_1);
      console.log("\turi_2 : ", uri_2);
      console.log("\turi_3 : ", uri_3);

    })
})