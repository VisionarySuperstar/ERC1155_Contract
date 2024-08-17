
// Importing necessary functionalities from the Hardhat package.
import { ethers } from 'hardhat'

async function main() {
    // Retrieve the first signer, typically the default account in Hardhat, to use as the deployer.
    const [deployer] = await ethers.getSigners()
    console.log('Contract is deploying...')
    const instanceUSDC = await ethers.getContractFactory('USDCToken');
    const USDCContract = await instanceUSDC.deploy(); // base
    // Waiting for the contract deployment to be confirmed on the blockchain.
    await USDCContract.waitForDeployment()

    // Logging the address of the deployed My404 contract.
    console.log(`USDC contract is deployed. Token address: ${USDCContract.target}`)
}

// This pattern allows the use of async/await throughout and ensures that errors are caught and handled properly.
main().catch(error => {
    console.error(error)
    process.exitCode = 1
})