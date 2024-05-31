/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";

interface StakeInterface {
  image: any;
  name: string;
  index: number;
  selected: boolean;
  nft: any;
  handleOrderCollect: (
    e: boolean,
    i: number
  ) => void;
}

const Stake = (props: StakeInterface) => {
  return (
    <div className="flex-basis">
      <label className="cursor-pointer block relative cardTop p-3 rounded-borderRadiusCard mb-mbcard bg-gray-600">
        <div className="rounded-borderRadiusCard relative mt-mtcard">
          <img
            src={props.image}
            alt="NFT image"
            className="w-full relative imgTop"
          />
        </div>
        <div className="pt-ptcard px-2 flex items-center justify-between staking">
          <h4>{props.name}</h4>
          <div className="flex items-center">
            <input
              id={"staking" + props.index}
              type="checkbox"
              name={"staking" + props.index}
              className="hidden"
              onChange={(e) => {
                console.log("test", "skake", e)
                props.handleOrderCollect(e.target.checked, props.index);
              }}
            />
            <label
              htmlFor={"staking" + props.index}
              className="flex items-center cursor-pointer"
            >
              <span className="w-6 h-6 inline-block mr-1 rounded-full border border-white opacity-50"></span>
            </label>
          </div>
        </div>
      </label>
    </div>
  );
};

export default Stake;
