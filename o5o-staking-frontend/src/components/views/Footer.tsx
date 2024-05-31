/* eslint-disable jsx-a11y/alt-text */
import discord from "../assets/img/discord.png";
import twiter from "../assets/img/tweet.png";
import Logo from "../assets/logo.png";


const Footer = () => {
  return (
    <footer className="py-4 px-12 border-t-2 bg-white z-10">
      <div className="flex justify-between items-center">
        <a href="/">
          <img src={Logo} alt="Twitter" className="w-14" />
        </a>
        <p className="text-center md:text-start">
          Copyright 2022 O5O. All rights reserved.
        </p>
        <div className="flex">
          <a href="https://twitter.com/o5o_official">
            <img src={twiter} alt="Twitter" className="w-8" />
          </a>
          <a href="https://discord.gg/o5o" className="ml-6">
            <img src={discord} alt="Discord" className="w-8" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
