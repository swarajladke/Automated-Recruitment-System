import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const getCall = async () => {
      // Mock Bypass: If using mock keys, don't hang on queryCalls
      if (process.env.NEXT_PUBLIC_STREAM_API_KEY?.includes("mock") || !process.env.NEXT_PUBLIC_STREAM_API_KEY) {
        console.warn("Using Mock Stream Key - Bypassing real call fetch");
        setCall({ id } as any); // Minimal mock call object
        setIsCallLoading(false);
        return;
      }

      try {
        const { calls } = await client.queryCalls({ filter_conditions: { id } });

        if (calls.length > 0) setCall(calls[0]);
      } catch (error) {
        console.error(error);
        setCall(undefined);
      } finally {
        setIsCallLoading(false);
      }
    };

    getCall();
  }, [client, id]);

  return { call, isCallLoading };
};

export default useGetCallById;
