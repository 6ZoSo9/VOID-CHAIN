// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract WalletOracle {
    bytes32 public constant RESULT_TYPEHASH = keccak256("Result(bytes32 jobId,bytes32 inputHash,bytes32 outputHash,uint256 timestamp)");
    bytes32 public immutable DOMAIN_SEPARATOR;
    struct Job { address submitter; bytes32 inputHash; bytes32 outputHash; uint64 createdAt; bool fulfilled; }
    mapping(bytes32 => Job) public jobs;
    mapping(address => address) public oracleOf;
    event OracleSet(address indexed user, address indexed oracle);
    event JobPosted(bytes32 indexed jobId, address indexed user, bytes32 inputHash);
    event JobFulfilled(bytes32 indexed jobId, address indexed oracle, bytes32 outputHash);
    constructor() {
        DOMAIN_SEPARATOR = keccak256(abi.encode(
            keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
            keccak256(bytes("WalletOracle")), keccak256(bytes("1")), block.chainid, address(this)
        ));
    }
    function setOracle(address oracle) external { oracleOf[msg.sender] = oracle; emit OracleSet(msg.sender, oracle); }
    function postJob(bytes32 jobId, bytes32 inputHash) external {
        require(jobs[jobId].createdAt == 0, "job exists");
        jobs[jobId] = Job(msg.sender, inputHash, 0x0, uint64(block.timestamp), false);
        emit JobPosted(jobId, msg.sender, inputHash);
    }
    function fulfillJob(bytes32 jobId, bytes32 outputHash, uint256 timestamp, uint8 v, bytes32 r, bytes32 s) external {
        Job storage j = jobs[jobId];
        require(j.createdAt != 0 && !j.fulfilled, "bad job");
        address oracle = oracleOf[j.submitter];
        require(oracle != address(0), "no oracle");
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, keccak256(abi.encode(RESULT_TYPEHASH, jobId, j.inputHash, outputHash, timestamp))));
        address signer = ecrecover(digest, v, r, s);
        require(signer == oracle, "bad sig");
        j.fulfilled = true; j.outputHash = outputHash;
        emit JobFulfilled(jobId, signer, outputHash);
    }
}
