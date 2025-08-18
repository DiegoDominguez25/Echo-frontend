import { useGenericResource } from "./GenericResource";
import type { Sentences, Words, Texts } from "@/data/types/ResourcesData";
import {
  mockSentences,
  mockWords,
  mockTexts,
} from "@/data/mockups/resourcesData";

export const useSentences = () => {
  const hook = useGenericResource<Sentences>("sentences", mockSentences);

  return {
    ...hook,
  };
};

export const useWords = () => {
  const hook = useGenericResource<Words>("words", mockWords);

  return {
    ...hook,
  };
};

export const useTexts = () => {
  const hook = useGenericResource<Texts>("texts", mockTexts);

  return {
    ...hook,
  };
};
