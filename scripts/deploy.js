// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with wallet address:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Wallet balance:", hre.ethers.formatEther(balance), "ETH");

    console.log("Starting deployment...");
    const Tracking = await hre.ethers.getContractFactory("Tracking");
    console.log("Contract factory obtained...");
    const tracking = await Tracking.deploy();
    console.log("Deployment transaction sent...");
    await tracking.waitForDeployment();
    console.log("Contract deployed to:", await tracking.getAddress());
    console.log("Deployment complete.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment error:", error);
        process.exit(1);
    });