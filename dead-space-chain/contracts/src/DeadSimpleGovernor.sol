// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal, unaudited demonstration governor. For production use OpenZeppelin Governor + Timelock.
interface IVotes {
    function balanceOf(address who) external view returns (uint256);
}

contract DeadSimpleGovernor {
    struct Proposal {
        address target;
        bytes data;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 start;
        uint256 end;
        bool executed;
        mapping(address=>bool) hasVoted;
    }

    IVotes public immutable votes;
    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant QUORUM = 100_000e18; // example quorum
    uint256 public propCount;
    mapping(uint256=>Proposal) public proposals;

    event Proposed(uint256 id, address target);
    event Voted(uint256 id, address voter, bool support, uint256 weight);
    event Executed(uint256 id);

    constructor(IVotes _votes){ votes = _votes; }

    function propose(address target, bytes calldata data) external returns (uint256 id){
        id = ++propCount;
        Proposal storage p = proposals[id];
        p.target = target; p.data = data;
        p.start = block.timestamp; p.end = block.timestamp + VOTING_PERIOD;
        emit Proposed(id, target);
    }

    function vote(uint256 id, bool support) external {
        Proposal storage p = proposals[id];
        require(block.timestamp >= p.start && block.timestamp < p.end, "closed");
        require(!p.hasVoted[msg.sender], "voted");
        uint256 weight = votes.balanceOf(msg.sender);
        require(weight>0, "no power");
        p.hasVoted[msg.sender] = true;
        if(support) p.forVotes += weight; else p.againstVotes += weight;
        emit Voted(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp >= p.end, "not ended");
        require(!p.executed, "executed");
        require(p.forVotes > p.againstVotes, "not passed");
        require(p.forVotes + p.againstVotes >= QUORUM, "no quorum");
        p.executed = true;
        (bool ok,) = p.target.call(p.data);
        require(ok, "exec failed");
        emit Executed(id);
    }
}
