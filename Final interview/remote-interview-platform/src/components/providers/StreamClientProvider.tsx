"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [streamVideoClient, setStreamVideoClient] = useState<StreamVideoClient>();
  
  // Mock User
  const user = {
    id: "mock-user-123",
    firstName: "Demo",
    lastName: "User",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
  };

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const isMock = apiKey === "mock_stream_key" || !apiKey;

  useEffect(() => {
    if (isMock) {
      console.log("Stream Mock Mode Active - Skipping WS connection");
      return;
    }

    const client = new StreamVideoClient({
      apiKey: apiKey!,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        image: user.imageUrl,
      },
      tokenProvider: streamTokenProvider,
    });

    setStreamVideoClient(client);
  }, []);

  if (isMock) return <div className="mock-stream-container">{children}</div>;
  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
