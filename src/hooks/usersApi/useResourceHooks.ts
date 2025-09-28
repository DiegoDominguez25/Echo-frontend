import { useGenericResource } from "./GenericResource";
import type { Sentences, Words, Texts } from "@/data/types/ResourcesData";

export const useSentences = () => {
  const hook = useGenericResource<Sentences>("sentences");
  return {
    ...hook,
  };
};

export const useWords = () => {
  const hook = useGenericResource<Words>("words");
  return {
    ...hook,
  };
};

export const useTexts = () => {
  const hook = useGenericResource<Texts>("texts");
  return {
    ...hook,
  };
};
