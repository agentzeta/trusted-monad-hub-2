// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contracts/TruthToken.sol";
import "../contracts/TrustedVerification.sol";

contract DeployScript is Script {
    function run() public {
        // Read the private key from environment and add 0x prefix if needed
        string memory rawKey = vm.envString("PRIVATE_KEY");
        bytes memory rawKeyBytes = bytes(rawKey);
        
        // Check if key already has 0x prefix
        bool hasPrefix = rawKeyBytes.length >= 2 && rawKeyBytes[0] == '0' && rawKeyBytes[1] == 'x';
        
        // Convert to uint256
        uint256 deployerPrivateKey;
        if (hasPrefix) {
            deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        } else {
            // Add 0x prefix and parse
            deployerPrivateKey = vm.parseUint(string(abi.encodePacked("0x", rawKey)));
        }
        
        address deployer = vm.addr(deployerPrivateKey);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy TruthToken
        TruthToken truthToken = new TruthToken(deployer);
        console.log("TruthToken deployed to:", address(truthToken));

        // Deploy TrustedVerification
        TrustedVerification trustedVerification = new TrustedVerification(
            address(truthToken),
            deployer
        );
        console.log("TrustedVerification deployed to:", address(trustedVerification));

        vm.stopBroadcast();

        // Log the addresses to make it easy to update .env
        console.log("\nUpdate your .env file with these values:");
        console.log("TRUTH_TOKEN_ADDRESS=", address(truthToken));
        console.log("VERIFICATION_CONTRACT_ADDRESS=", address(trustedVerification));
    }
}
