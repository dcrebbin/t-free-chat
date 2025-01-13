"use client";

import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const defaultText = `### Who made T3 Chat?

T3 Chat is made by Ping Labs, a Y Combinator backed startup run by [Theo](https://x.com/theo) and [Mark](https://x.com/r_marked).

We're also the devs behind [UploadThing](https://uploadthing.com), [PicThing](https://pic.ping.gg), the [T3 Stack](https://t3.gg), and the best video call app ever, [Ping.gg](https://ping.gg).

### What models does T3 Chat use?

We're experimenting between a few models, primarily **DeepSeek v3** and **GPT-4o Mini**. We plan to introduce model selection in the near future (we love Claude!).

### How did you make T3 Chat so fast???

We built a lot of bespoke tech to make this possible. The big difference between T3 Chat and other AI chat apps is that we keep all of your data on your device.

### What's next for T3 Chat?

Great question. Theo has a long list of wishes that he's hoping to get added soon, like...
- Hotkey support
- Local search
- Branching chats
- Desktop app`;

  const [messages, setMessages] = useState<Message[]>([
    { role: "user", content: "Okay, I clicked, now what?" },
    { role: "assistant", content: defaultText },
  ]);

  let fallingInterval: NodeJS.Timeout | null = null;
  let collisionInterval: NodeJS.Timeout | null = null;
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef<HTMLImageElement>(null);
  const state = useRef({
    cursorHp: 3,
  });

  const chatMessageRefs = useRef<HTMLDivElement[]>([]);

  const newChatIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-message-square-plus h-4 w-4"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <path d="M12 7v6"></path>
      <path d="M9 10h6"></path>
    </svg>
  );

  const chatIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-message-square size-3 shrink-0 text-neutral-400"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  function sendMessage() {
    console.log("sendMessage");
    const message = textAreaRef.current?.value;
    if (message) {
      setMessages([...messages, { role: "user", content: message }]);
      textAreaRef.current!.value = "";
    }
    chatMessageRefs.current[0].style.position = "absolute";
    chatMessageRefs.current[0].style.right = "0";
    chatMessageRefs.current[0].scrollIntoView({ behavior: "smooth" });
    const currentY = chatMessageRefs.current[0].getBoundingClientRect().y;
    const windowHeight = window.innerHeight;
    const newY = windowHeight - currentY;
    chatMessageRefs.current[0].style.bottom = `${newY}px`;
    fallToBottom();
    mimicCursor();
    collisionDetection();
  }

  function collisionDetection() {
    if (collisionInterval) {
      clearInterval(collisionInterval);
    }
    collisionInterval = setInterval(() => {
      const cursor = cursorRef.current;
      const chatMessage = chatMessageRefs.current[0];
      const cursorRect = cursor?.getBoundingClientRect();
      const chatMessageRect = chatMessage?.getBoundingClientRect();
      if (cursorRect && chatMessageRect) {
        // Check if cursor overlaps with chat message
        const overlap = !(
          cursorRect.right < chatMessageRect.left ||
          cursorRect.left > chatMessageRect.right ||
          cursorRect.bottom < chatMessageRect.top ||
          cursorRect.top > chatMessageRect.bottom
        );

        if (overlap) {
          console.log("collision detected");
          state.current.cursorHp -= 1;
          updateCursor();
          clearInterval(collisionInterval!);
        }
      }
    }, 10);
  }

  function updateCursor() {
    console.log(state.current.cursorHp);
    switch (state.current.cursorHp) {
      case 3:
        cursorRef.current!.src = "/mouse-1.png";
        break;
      case 2:
        cursorRef.current!.src = "/mouse-2.png";
        break;
      case 1:
        cursorRef.current!.src = "/mouse-3.png";
        break;
      case 0:
        cursorRef.current!.remove();
        cursorRef.current = null;
        break;
    }
    cursorRef.current!.style.backgroundColor = "transparent";
  }

  function mimicCursor() {
    document.body.style.cursor = "none";
    const cursor = document.createElement("img");
    cursor.src = "/mouse-1.png";
    cursor.style.position = "fixed";
    cursor.style.top = "0";
    cursor.style.zIndex = "9999";
    cursor.style.left = "0";
    cursor.style.width = "20px";
    cursor.style.height = "20px";
    cursorRef.current = cursor;
    document.body.appendChild(cursor);
    window.addEventListener("mousemove", (e) => {
      cursorRef.current!.style.left = `${e.clientX}px`;
      cursorRef.current!.style.top = `${e.clientY}px`;
    });
  }

  function fallToBottom() {
    if (fallingInterval) {
      clearInterval(fallingInterval);
    }
    fallingInterval = setInterval(() => {
      const currentBottom = parseInt(chatMessageRefs.current[0].style.bottom);
      const currentRotation = chatMessageRefs.current[0].style.transform
        ? parseInt(
            chatMessageRefs.current[0].style.transform.match(
              /rotate\((-?\d+)deg\)/
            )?.[1] || "0"
          )
        : 0;

      if (currentBottom + 200 <= 0) {
        clearInterval(fallingInterval!);
        return;
      }

      const newRotation = currentRotation + (Math.random() * 10 - 5); // Random rotation between -5 and 5 degrees
      chatMessageRefs.current[0].style.transform = `rotate(${newRotation}deg)`;
      chatMessageRefs.current[0].style.bottom = `${currentBottom - 5}px`;
    }, 10);
  }

  return (
    <div
      className={`flex flex-col items-start justify-start h-screen text-white overflow-hidden`}
    >
      <div className="flex flex-row items-start justify-start h-screen">
        <div className="flex flex-col items-start w-72 justify-start h-screen border-r border-white/20 p-4 gap-6">
          <h1 className="text-xl">T3 Chat</h1>
          <a className="text-pink-400 flex flex-row items-center gap-2">
            {newChatIcon}
            New Chat
          </a>
          <div className="flex flex-col items-start justify-start gap-2">
            <h2 className="font-semibold text-neutral-400">Recent Threads</h2>
            <div className="flex flex-col items-start justify-start gap-2">
              <div className="flex flex-row items-center gap-2 h-10">
                {chatIcon} <h3>Why T3 Chat?</h3>
              </div>
              <div className="flex flex-row items-center gap-2 h-10">
                {chatIcon} <h3>Welcome to T3 Chat</h3>
              </div>
              <div className="flex flex-row items-center gap-2">
                {chatIcon} <h3>FAQ</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex overflow-auto flex-col items-center justify-start h-screen w-full px-[5%] lg:px-[10%] xl:px-[20%] pt-10">
          <div className="flex relative flex-col items-start justify-start gap-4 overflow-y-auto p-4">
            {messages.map((message, index) =>
              message.role === "user" ? (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) {
                      chatMessageRefs.current[index] = el;
                    }
                  }}
                  className="w-full flex flex-row items-center justify-end"
                >
                  <p className="bg-[#2D2D2D] rounded-2xl p-4">
                    {message.content}
                  </p>
                </div>
              ) : (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) {
                      chatMessageRefs.current[index] = el;
                    }
                  }}
                  className="prose prose-invert max-w-none w-full p-8"
                >
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                </div>
              )
            )}
          </div>
          <div className="relative w-full h-[7rem] border-none outline-none rounded-t-2xl bg-[#2D2D2D] bottom-0 p-4 ">
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              ref={textAreaRef}
              placeholder="Type your message here..."
              className="w-full h-full bg-transparent border-none outline-none"
            ></textarea>
            <select className="absolute z-10 bottom-0 right-0 w-full px-4 py-2 bg-transparent text-gray-400 border-none outline-none text-xs">
              <option value="gpt-4o-mini">4o Mini v</option>
              <option value="deepseek-v3">DeepSeek v3 v</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
