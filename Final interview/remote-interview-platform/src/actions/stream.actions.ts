"use server";

import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
  // Mock User
  const user = { id: "mock-user-123" };

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  const token = streamClient.generateUserToken({ user_id: user.id });

  return token;
};
