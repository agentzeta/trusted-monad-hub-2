// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TruthToken is ERC20, Ownable {
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingTimestamp;
    
    uint256 public constant STAKING_PERIOD = 7 days;
    uint256 public constant REWARD_RATE = 5; // 5% APR
    
    constructor() ERC20("Truth Token", "TRUTH") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(
            balanceOf(msg.sender) >= amount,
            "Insufficient balance"
        );
        
        _transfer(msg.sender, address(this), amount);
        
        if (stakingBalance[msg.sender] > 0) {
            claimRewards();
        }
        
        stakingBalance[msg.sender] += amount;
        stakingTimestamp[msg.sender] = block.timestamp;
    }
    
    function claimRewards() public {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            _mint(msg.sender, rewards);
            stakingTimestamp[msg.sender] = block.timestamp;
        }
    }
    
    function calculateRewards(address account) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - stakingTimestamp[account];
        return (stakingBalance[account] * REWARD_RATE * timeElapsed) / (365 days * 100);
    }
}
