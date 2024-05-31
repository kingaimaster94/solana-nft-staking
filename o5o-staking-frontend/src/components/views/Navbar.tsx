/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useMediaQuery } from "react-responsive";
import { WalletMultiButton, } from "@solana/wallet-adapter-react-ui";
import WalletBtnImg from '../assets/wallet-icon.png';
import { useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { RiUser3Fill } from "react-icons/ri";
import { REWARD_TOKEN_DECIMALS } from "../../constant/env";
import {AiOutlineBars} from 'react-icons/ai';

interface NavbarInterface {
  globalData: any;
  setMinSiderBar:any
  minSidebar:any
}

const Navbar = (props: NavbarInterface | undefined = undefined) => {
  //Media Quearry
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 950px)" });
  const { publicKey, wallet, disconnect } = useWallet();
  const base58 = useMemo(() => publicKey === null || publicKey === void 0 ? void 0 : publicKey.toBase58(), [publicKey]);
  
  const floorPriceOfNft = 50;

  return (
    <div className="border-b border-grey-light h-24">
      <div className="flex items-center justify-between border-b h-24">
        <AiOutlineBars onClick={()=>{props && props.setMinSiderBar(!props.minSidebar)}} style={{lineHeight:'40px', fontSize:'36px',minWidth:'36px', minHeight:'36px'}} className={`flex sm:hidden ml-3 font-bold cursor-pointer ${props&&props.minSidebar?'mobile-change-2':'' }`}/>
        {/* {props &&  props.globalData ? <span className="ml-10">TBA : {props.globalData ? props.globalData.stakedCount * floorPriceOfNft : 0}</span>:<span></span>} */}
        <span className="ml-10">Total Locked Value: TBA</span>
        <div className="flex items-center">
        <WalletMultiButton className="mr-3 sm:mr-12" />
        <RiUser3Fill className="mr-3 sm:mr-24" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
