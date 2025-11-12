import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSentences, useWords, useTexts } from "@/hooks/resourceHooks";
import type { ResourceWithProgress } from "@/services/api/createResourceService";
import type { Sentences, Words, Texts } from "@/data/interfaces/ResourcesData";

type ResourceType = "words" | "sentences" | "texts";
type ResourceData = Words | Sentences | Texts;

export const useResource = (user_id: string | undefined) => {
  const { type, resource_uid } = useParams<{
    type: string;
    resource_uid: string;
  }>();

  const [resource, setResource] =
    useState<ResourceWithProgress<ResourceData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const wordsHook = useWords();
  const sentencesHook = useSentences();
  const textsHook = useTexts();

  const resourceHooks = useMemo(
    () => ({
      words: wordsHook,
      sentences: sentencesHook,
      texts: textsHook,
    }),
    [wordsHook, sentencesHook, textsHook]
  );

  useEffect(() => {
    const loadResource = async () => {
      if (!user_id || !resource_uid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        if (!type || !resource_uid) {
          throw new Error("Invalid resource type or ID");
        }

        const resourceType = type as ResourceType;
        if (!["words", "sentences", "texts"].includes(resourceType)) {
          throw new Error("Unsupported resource type");
        }

        const currentHook = resourceHooks[resourceType];
        const resourceData = await currentHook.getByIdWithProgress(
          resource_uid,
          user_id
        );

        setResource(resourceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadResource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, resource_uid]);

  return {
    resource,
    setResource,
    loading,
    error,
    type,
    resource_uid,
  };
};
