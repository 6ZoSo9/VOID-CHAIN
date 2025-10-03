// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";

/// @notice Extremely simplified constant-product AMM for dev/demo only. NOT audited.
contract DeadSimpleAMM {
    IERC20 public immutable token0;
    IERC20 public immutable token1;
    uint256 public reserve0;
    uint256 public reserve1;
    uint256 public constant FEE_BPS = 30; // 0.3%

    event Sync(uint256 r0, uint256 r1);
    event Swap(address indexed sender, bool zeroForOne, uint256 amountIn, uint256 amountOut);
    event Add(address indexed sender, uint256 amount0, uint256 amount1);
    event Remove(address indexed sender, uint256 amount0, uint256 amount1);

    constructor(IERC20 _t0, IERC20 _t1){
        token0 = _t0; token1 = _t1;
    }

    function _sync(uint256 new0, uint256 new1) internal {
        reserve0 = new0; reserve1 = new1; emit Sync(new0, new1);
    }

    function addLiquidity(uint256 amt0, uint256 amt1) external {
        require(amt0>0 && amt1>0, "amt");
        require(token0.transferFrom(msg.sender, address(this), amt0), "t0");
        require(token1.transferFrom(msg.sender, address(this), amt1), "t1");
        _sync(reserve0 + amt0, reserve1 + amt1);
        emit Add(msg.sender, amt0, amt1);
    }

    function removeLiquidity(uint256 amt0, uint256 amt1) external {
        require(amt0<=reserve0 && amt1<=reserve1, "res");
        require(token0.transfer(msg.sender, amt0), "t0");
        require(token1.transfer(msg.sender, amt1), "t1");
        _sync(reserve0 - amt0, reserve1 - amt1);
        emit Remove(msg.sender, amt0, amt1);
    }

    function getAmountOut(bool zeroForOne, uint256 amountIn) public view returns (uint256) {
        require(amountIn>0, "amtIn");
        if(zeroForOne){
            uint256 amountInWithFee = amountIn * (10000 - FEE_BPS) / 10000;
            uint256 num = reserve1 * amountInWithFee;
            uint256 den = reserve0 + amountInWithFee;
            return num / den;
        }else{
            uint256 amountInWithFee = amountIn * (10000 - FEE_BPS) / 10000;
            uint256 num = reserve0 * amountInWithFee;
            uint256 den = reserve1 + amountInWithFee;
            return num / den;
        }
    }

    function swap(bool zeroForOne, uint256 amountIn, uint256 minOut) external {
        if(zeroForOne){
            require(token0.transferFrom(msg.sender, address(this), amountIn), "t0");
            uint256 out = getAmountOut(true, amountIn);
            require(out >= minOut, "slip");
            require(token1.transfer(msg.sender, out), "t1");
            _sync(reserve0 + amountIn, reserve1 - out);
            emit Swap(msg.sender, true, amountIn, out);
        }else{
            require(token1.transferFrom(msg.sender, address(this), amountIn), "t1");
            uint256 out = getAmountOut(false, amountIn);
            require(out >= minOut, "slip");
            require(token0.transfer(msg.sender, out), "t0");
            _sync(reserve0 - out, reserve1 + amountIn);
            emit Swap(msg.sender, false, amountIn, out);
        }
    }
}
