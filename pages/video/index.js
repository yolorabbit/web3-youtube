import React, { useEffect, useState, useCallback } from "react";
import { useApolloClient, gql } from "@apollo/client";

import Video from "../../components/Video";
import VideoComponent from "../../components/VideoContainer";
import { Header } from "../../components/Header";

export default function VideoPage() {
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);

  const client = useApolloClient();
  const getUrlVars = () => {
    var vars = {};
    window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  };

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

  const getRelatedVideos = useCallback(() => {
    client
      .query({
        query: GET_VIDEOS,
        variables: {
          first: 20,
          skip: 0,
          orderBy: "createdAt",
          orderDirection: "desc",
          where: {},
        },
        fetchPolicy: "network-only",
      })
      .then(({ data }) => {
        setRelatedVideos(data.videos);
        const video = data?.videos?.find(
          (video) => video.id === getUrlVars().id
        );

        setVideo(video);
      })
      .catch((err) => {
        console.log("Something went wrong. please try again.!", err.message);
      });
  }, [GET_VIDEOS, client]);

  useEffect(() => {
    getRelatedVideos();
  }, [getRelatedVideos]);

  return (
    <div className="w-full bg-[#1a1c1f] flex flex-row">
      <div className="flex-1 flex flex-col">
        <Header />
        {video && (
          <div className="flex flex-col m-10 justify-between lg:flex-row">
            <div className="lg:w-4/6 w-6/6">
              <VideoComponent video={video} />
            </div>
            <div className="w-2/6">
              <h4 className="text-md font-bold text-white ml-5 mb-3">
                Related Videos
              </h4>
              {relatedVideos ? (
                <>
                  {relatedVideos.map((video) => (
                    <div
                      onClick={() => {
                        setVideo(video);
                      }}
                      key={video.id}
                    >
                      <Video video={video} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="ml-6 text-xl text-gray-400 mb-8">
                  No Related videos
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
