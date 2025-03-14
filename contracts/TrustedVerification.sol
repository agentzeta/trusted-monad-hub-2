/ SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustedVerification is Ownable {
    IERC20 public truthToken;
    
    struct Verification {
        bytes32 contentHash;
        address verifier;
        uint256 timestamp;
        bytes zkProof;
        uint256 stake;
        bool isValid;
    }
    
    mapping(bytes32 => Verification) public verifications;
    mapping(address => uint256) public stakedAmount;
    
    uint256 public constant MINIMUM_STAKE = 100 * 10**18; // 100 TRUTH tokens
    
    event VerificationSubmitted(
        bytes32 indexed contentHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    constructor(address _truthToken) {
        truthToken = IERC20(_truthToken);
    }
    
    function submitVerification(
        bytes32 _contentHash,
        bytes calldata _zkProof
    ) external {
        require(
            truthToken.balanceOf(msg.sender) >= MINIMUM_STAKE,
            "Insufficient stake"
        );
        
        truthToken.transferFrom(msg.sender, address(this), MINIMUM_STAKE);
        
        verifications[_contentHash] = Verification({
            contentHash: _contentHash,
            verifier: msg.sender,
            timestamp: block.timestamp,
            zkProof: _zkProof,
            stake: MINIMUM_STAKE,
            isValid: true
        });
        
        stakedAmount[msg.sender] += MINIMUM_STAKE;
        
        emit VerificationSubmitted(_contentHash, msg.sender, block.timestamp);
    }
}
