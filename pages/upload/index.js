import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { BiCloud, BiPlus } from "react-icons/bi";
import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import Image from "next/image";

import { getContract } from "../../utils";

const auth =
  "Basic " +
  Buffer.from(
    process.env.NEXT_PUBLIC_INFURA_PROJECTID +
      ":" +
      process.env.NEXT_PUBLIC_INFURA_KEY
  ).toString("base64");

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState("");

  const thumbnailRef = useRef();
  const videoRef = useRef();
  const router = useRouter();

  const client = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const uploadVideo = async (thumbnail) => {
    try {
      // Uploading the video to IPFS
      const added = await client.add(video);
      // Getting the hash of the uploaded video and passing both video and thumbnail to the saveVideo function
      await saveVideo(added.path, thumbnail);
    } catch (error) {
      setLoading(false);
      console.log("Error uploading file: ", error);
    }
  };

  const uploadThumbnail = useCallback(
    async (thumbnail) => {
      setLoading(true);
      try {
        // Uploading the thumbnail to IPFS
        const added = await client.add(thumbnail);
        // Getting the hash of the uploaded thumbnail and passing it to the uploadVideo function
        uploadVideo(added.path);
      } catch (error) {
        setLoading(false);
        console.log("Error uploading file: ", error);
      }
    },
    [client, uploadVideo]
  );

  const handleSubmit = useCallback(async () => {
    if (
      title === "" ||
      description === "" ||
      category === "" ||
      location === "" ||
      thumbnail === "" ||
      video === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    uploadThumbnail(thumbnail);
  }, [
    title,
    description,
    category,
    location,
    thumbnail,
    video,
    uploadThumbnail,
  ]);

  const saveVideo = async (video, thumbnail) => {
    // Get the contract from the getContract function
    let contract = await getContract();

    let UploadedDate = String(new Date());
    // Upload the video to the contract
    await contract.uploadVideo(
      video,
      title,
      description,
      location,
      category,
      thumbnail,
      UploadedDate
    );
    setLoading(false);
    router.push("/home");
  };

  return (
    <div className="w-full h-screen bg-[#1a1c1f] flex flex-row">
      <div className="flex-1 flex flex-col">
        <div className="mt-5 mr-10 flex justify-end">
          <div className="flex items-center">
            <Link href="/home">
              <div className="bg-transparent cursor-pointer text-[#9CA3AF] py-2 px-6 border rounded-lg border-gray-600 mr-6">
                Discard
              </div>
            </Link>
            <button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg flex px-4 justify-between flex-row items-center"
            >
              {loading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 text-gray-200 animate-spin dark:text-white-600 fill-gray-800"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                <BiCloud />
              )}
              <p className="ml-2">Upload</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col m-10 mt-5 lg:flex-row">
          <div className="flex lg:w-3/4 flex-col ">
            <label className="text-[#9CA3AF]  text-sm">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Avatar the Last Airbender
"
              className="w-[90%] text-white placeholder:text-gray-600  rounded-md mt-2 h-12 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
            />
            <label className="text-[#9CA3AF] mt-10">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The world is divided into four nations -- the Water Tribe, the Earth Kingdom, the Fire Nation and and the Air Nomads -- each represented by a natural element for which the nation is named. "
              className="w-[90%] text-white h-32 placeholder:text-gray-600 rounded-md mt-2 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
            />

            <div className="flex flex-row mt-10 w-[90%] justify-between">
              <div className="flex flex-col w-2/5">
                <label className="text-[#9CA3AF]  text-sm">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  type="text"
                  placeholder="Recife - Brazil"
                  className="w-[90%] text-white placeholder:text-gray-600  rounded-md mt-2 h-12 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
                />
              </div>
              <div className="flex flex-col w-2/5">
                <label className="text-[#9CA3AF]  text-sm">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-[90%] text-white placeholder:text-gray-600  rounded-md mt-2 h-12 p-2 border  bg-[#1a1c1f] border-[#444752] focus:outline-none"
                >
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Gaming</option>
                  <option>News</option>
                  <option>Entertainment</option>
                  <option>Education</option>
                  <option>Science & Technology</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <label className="text-[#9CA3AF]  mt-10 text-sm">Thumbnail</label>
            <div
              onClick={() => {
                thumbnailRef.current.click();
              }}
              className="border-2 w-64 border-gray-600  border-dashed rounded-md mt-2 p-2  h-36 items-center justify-center flex"
            >
              {thumbnail ? (
                <Image
                  onClick={() => {
                    thumbnailRef.current.click();
                  }}
                  src={URL.createObjectURL(thumbnail)}
                  alt="thumbnail"
                  className="h-full rounded-md"
                />
              ) : (
                <BiPlus size={40} color="gray" />
              )}
            </div>
            <input
              type="file"
              className="hidden"
              ref={thumbnailRef}
              onChange={(e) => {
                setThumbnail(e.target.files[0]);
              }}
            />
          </div>
          <div
            onClick={() => {
              videoRef.current.click();
            }}
            className={
              video
                ? " w-96 rounded-md  h-64 items-center justify-center flex"
                : "border-2 border-gray-600 w-96 border-dashed rounded-md mt-8   h-64 items-center justify-center flex"
            }
          >
            {video ? (
              <video
                controls
                src={URL.createObjectURL(video)}
                className="h-full rounded-md"
              />
            ) : (
              <p className="text-[#9CA3AF]">Upload Video</p>
            )}
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          ref={videoRef}
          accept={"video/*"}
          onChange={(e) => {
            setVideo(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}
