"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";


import useLike from "@/hooks/useLike";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  initialLikes: number;
  initialLiked?: boolean;
  tweetId: number;
  handle?: string;
};

export default function LikeButton({
  initialLikes,
  initialLiked,
  tweetId,
  handle,
}: LikeButtonProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const { likeTweet, unlikeTweet, loading } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the tweet page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (liked) {
      await unlikeTweet({
        tweetId,
        userHandle: handle,
      });
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await likeTweet({
        tweetId,
        userHandle: handle,
      });
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <>
      <button
        className={cn(
          "flex w-25 items-center gap-1 border border-gray-300 rounded hover:text-brand" ,
          liked && "bg-green-300 text-black font-bold",
        )}
        onClick={handleClick}
        disabled={loading}
      >
        <div
          className={cn(
            "flex items-center gap-1 rounded-full p-1.5 transition-colors duration-300 hover:bg-brand/10",
            
          )}
        >
          {/* <Check size={18} /> */}
          {liked?"我已參加":"我想參加"}
        </div>       
      </button>
      {/* {likesCount === null ? 0 : likesCount}人參加 */}
    </>
  );
}
