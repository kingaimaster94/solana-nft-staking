export const COLLECTION_NAME = "CRAB";
export const COLLECTION_SYMBOL = "CRAB";

export const STAKE_STATUS = {
  UNSTAKED: 0,
  STAKED: 1,
};
export const STAKE_DATA_SIZE = 432

export const STAKE_CONTRACT_IDL =
{
  "version": "0.1.0",
  "name": "dragon_staking",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initUserPool",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stakeNft",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPoolData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rarity",
          "type": "u8"
        }
      ]
    },
    {
      "name": "unstakeNft",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPoolData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destNftAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "globalBump",
          "type": "u8"
        },
        {
          "name": "rarity",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimReward",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initDurationPoint",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initAllocatedPoint",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "calcDurationBonus",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "calcAccountBonus",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "calcDailyReward",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userPool",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "depositToken",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawToken",
      "accounts": [
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "sourceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "GlobalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stakedCount",
            "type": "u32"
          },
          {
            "name": "rarityPoint",
            "type": "u64"
          },
          {
            "name": "durationPoint",
            "type": "i64"
          },
          {
            "name": "accountVerifyPoint",
            "type": "u64"
          },
          {
            "name": "availableTokenAmount",
            "type": "u64"
          },
          {
            "name": "allocatedTokenAmount",
            "type": "u64"
          },
          {
            "name": "claimedTokenAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UserPoolData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "nftMint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "UserPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "stakedCount",
            "type": "u32"
          },
          {
            "name": "rarityPoint",
            "type": "u64"
          },
          {
            "name": "durationPoint",
            "type": "i64"
          },
          {
            "name": "accountVerifyPoint",
            "type": "u64"
          },
          {
            "name": "claimableReward",
            "type": "u64"
          },
          {
            "name": "earnedReward",
            "type": "u64"
          },
          {
            "name": "dailyReward",
            "type": "u64"
          },
          {
            "name": "rewardTime",
            "type": "i64"
          },
          {
            "name": "gangCreatedTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidUserPool",
      "msg": "Invalid User Pool"
    },
    {
      "code": 6001,
      "name": "InvalidPoolError",
      "msg": "Invalid pool number"
    },
    {
      "code": 6002,
      "name": "InvalidNFTAddress",
      "msg": "No Matching NFT to withdraw"
    },
    {
      "code": 6003,
      "name": "InvalidOwner",
      "msg": "NFT Owner key mismatch"
    },
    {
      "code": 6004,
      "name": "InvalidWithdrawTime",
      "msg": "Staking Locked Now"
    },
    {
      "code": 6005,
      "name": "IndexOverflow",
      "msg": "Withdraw NFT Index OverFlow"
    },
    {
      "code": 6006,
      "name": "LackLamports",
      "msg": "Insufficient Lamports"
    },
    {
      "code": 6007,
      "name": "InvalidRewardAmount",
      "msg": "Invalid reward amount"
    }
  ],
  "metadata": {
    "address": "Bnmuo5aGbvhwUGYkkZydyxgsyPNuXNL9GhkVH6XpKnu1"
  }
}