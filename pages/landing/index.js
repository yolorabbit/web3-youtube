import React from "react";
import { useRouter } from "next/router";

function Landing() {
  const router = useRouter();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      localStorage.setItem("walletAddress", accounts[0]);
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="relative bg-black flex flex-col h-screen justify-center items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-5xl text-white md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              It is YouTube, but{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
                Decentralized
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="text-xl text-gray-400 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Create, share and watch videos
              </p>
              <button
                className="items-center  bg-white rounded-full font-medium  p-4 shadow-lg"
                onClick={connectWallet}
              >
                <span className="text-gray-600">Connect wallet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
