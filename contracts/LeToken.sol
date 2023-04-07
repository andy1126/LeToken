// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LeToken is ERC20 {
    address public owner;
    uint256 public transactionFee;
    uint256 public burnRate;

    constructor(uint256 fee, uint256 rate) ERC20("LeToken", "LTK") {
        owner = msg.sender;
        transactionFee = fee;
        burnRate = rate;
        _mint(msg.sender, 10000000000);
    }

    function issue(uint256 amount) public {
        require(msg.sender == owner, "Only owner can issue tokens");
        _mint(owner, amount);
    }

    function burn(uint256 amount) public {
        require(msg.sender == owner, "Only owner can burn tokens");
        _burn(owner, amount);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        uint256 fee = amount * transactionFee / 10000;
        uint256 burnAmount = amount * burnRate / 10000;
        uint256 totalAmount = amount + fee;
        require(balanceOf(msg.sender) >= totalAmount, "Not enough balance to make the transfer");
        _transfer(msg.sender, recipient, amount);
        _burn(msg.sender, burnAmount);
        if (fee > 0) {
            _transfer(msg.sender, owner, fee);
        }
        return true;
    }
}