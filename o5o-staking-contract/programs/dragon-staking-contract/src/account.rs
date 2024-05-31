use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct GlobalPool {
    pub staked_count: u32,
    
    pub rarity_point: u64,
    pub duration_point: i64,
    pub account_verify_point: u64,

    pub available_token_amount:u64,
    pub allocated_token_amount:u64,
    pub claimed_token_amount: u64,
}

#[account]
pub struct UserPoolData {
    pub owner: Pubkey,
    pub nft_mint: Pubkey,
}

#[account]
pub struct UserPool {
    pub owner: Pubkey,

    pub staked_count: u32,

    pub rarity_point: u64,
    pub duration_point: i64,
    pub account_verify_point: u64,

    pub claimable_reward: u64,
    pub earned_reward: u64,
    pub daily_reward: u64,

    pub reward_time: i64,
    pub gang_created_time: i64,
}

impl UserPool {
    pub fn calc_reward(&mut self, now: i64, daily_reward: u64) -> Result<u64> {
        self.claimable_reward = self.claimable_reward + daily_reward;
        self.reward_time = now;
        Ok(self.claimable_reward)
    }

    pub fn get_total_point(&mut self) -> Result<f64> {
        let total_point = self.staked_count as f64 + self.rarity_point as f64 + self.duration_point as f64 + self.account_verify_point as f64;
        Ok(total_point)
    }
}

impl GlobalPool {
    pub fn get_total_point(&mut self) -> Result<f64> {
        let total_point = self.staked_count as f64 + self.rarity_point as f64 + self.duration_point as f64 + self.account_verify_point as f64;
        Ok(total_point)
    }
}