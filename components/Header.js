import React from "react";
import Link from "next/link";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Image from "next/image";

export const Header = ({ search }) => {
  return (
    <header className="w-full flex justify-between h-20 items-center border-b p-4 border-[#202229]">
      <div className=" w-1/3">
        <Link href="/home">
          <Image
            width={60}
            src={
              "https://rotony.com.br/wp-content/uploads/2021/09/free-youtube-logo-icon-2431-thumb.png"
            }
            className="cursor-pointer"
            alt="YouTube Logo"
          />
        </Link>
      </div>
      <div className=" w-1/3  flex justify-center items-center">
        {search ? (
          <input
            type="text"
            onChange={(e) => search(e.target.value)}
            placeholder="Type to search"
            className=" border-0 bg-transparent focus:outline-none text-white"
          />
        ) : null}
      </div>
      <div className=" w-1/3 flex justify-end">
        <Link href="/upload">
          <AiOutlinePlusCircle
            size="30px"
            className="mr-8  cursor-pointer fill-whiteIcons dark:fill-white cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
};
