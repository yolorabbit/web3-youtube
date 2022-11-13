import React, { useEffect, useState, useCallback } from "react";
import { useApolloClient, gql } from "@apollo/client";
import { useRouter } from "next/router";

import Video from "../../components/Video";
import { Header } from "../../components/Header";

export default function Main() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const client = useApolloClient();

  const GET_VIDEOS = gql`
    query videos(
      $first: Int
      $skip: Int
      $orderBy: Video_orderBy
      $orderDirection: OrderDirection
      $where: Video_filter
    ) {
      videos(
        first: $first
        skip: $skip
        orderBy: $orderBy
        orderDirection: $orderDirection
        where: $where
      ) {
        id
        hash
        title
        description
        location
        category
        thumbnailHash
        date
        author
        createdAt
      }
    }
  `;

  const getVideos = useCallback(() => {
    client
      .query({
        query: GET_VIDEOS,
        variables: {
          first: 200,
          skip: 0,
          orderBy: "createdAt",
          orderDirection: "desc",
          //search filter
          where: {
            ...(search && {
              title_contains_nocase: search,
            }),
          },
        },
        fetchPolicy: "network-only",
      })
      .then(({ data }) => {
        setVideos(data.videos);
      })
      .catch((err) => {
        alert("Something went wrong. please try again.!", err.message);
      });
  }, [GET_VIDEOS, client, search]);

  useEffect(() => {
    getVideos();
  }, [search, getVideos]);

  return (
    <div className="w-full bg-[#1a1c1f] flex flex-row">
      <div className="flex-1 h-screen flex flex-col">
        <Header
          search={(e) => {
            setSearch(e);
          }}
        />
        <div className="flex flex-row flex-wrap">
          {videos.map((video, index) => (
            <div
              key={index}
              className="w-80"
              onClick={() => {
                router.push(`/video?id=${video.id}`);
              }}
            >
              <Video video={video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
