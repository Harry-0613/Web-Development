"use client";

import { KeyboardEventHandler, useRef } from "react";

import GrowingTextarea from "@/components/GrowingTextarea";
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";

type ReplyInputProps = {
  replyToTweetId: number;
  usernameToReply?: string;
  replyToHandle: string;
  initialLiked: boolean;
};

export default function ReplyInput({
  replyToTweetId,
  usernameToReply,
  initialLiked,
}: ReplyInputProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTweet} = useTweet();

  const handleReply = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    if (!handle) return;

    try {
      await postTweet({
        handle,
        content,
        replyToTweetId,
      });
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting reply");
    }
  };

  const handleKeyPress: KeyboardEventHandler<HTMLDivElement> = (event) => {
    // 您的按键处理逻辑
    if (event.key === 'Enter') {
      handleReply();
    }
  };
  // const handleKeyPress = (event:KeyboardEvent) => {
    // if (event.key === 'Enter') {
    //   handleReply();
    // }
  // }


  return (
    <div>
    {initialLiked?(
    // this allows us to focus (put the cursor in) the textarea when the user
    // clicks anywhere on the div
    <div className="bg-yellow-100" onClick={() => textareaRef.current?.focus()}>
      <div className="grid grid-cols-[fit-content(48px)_1fr] gap-4 px-4 pt-4" onKeyDown={handleKeyPress}>
        <GrowingTextarea
          ref={textareaRef}
          wrapperClassName="col-start-2 row-start-2"
          className="bg-transparent text-xl outline-none placeholder:text-gray-500"
          placeholder={`${usernameToReply}留下你的想法吧`}
        />
      </div>
      {/* <div className="p-4 text-end">
        <button
          className={cn(
            "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
            "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
          )}
          onClick={handleReply}
          disabled={loading}
        >
          Reply
        </button>
      </div> */}
    </div>):(
      <div className="bg-yellow-100 p-2 rounded-full text-black font-bold">
      參加活動來加入討論吧
      </div>
    )
    }
    </div>
  );
}
