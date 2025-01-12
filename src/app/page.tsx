import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  return (
    <div className="flex flex-row items-start justify-start h-screen text-white">
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
      <div className="flex flex-col items-center justify-start h-screen w-full px-[20%] pt-10">
        <div className="w-full flex flex-row items-center justify-end">
          <p className="bg-[#2D2D2D] rounded-2xl p-4">
            Okay, I clicked, now what?
          </p>
        </div>
        <div className="prose prose-invert max-w-none w-full p-8 overflow-auto">
          <Markdown remarkPlugins={[remarkGfm]}>{defaultText}</Markdown>
        </div>
      </div>
    </div>
  );
}
