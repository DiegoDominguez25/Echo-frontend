import { useGenericResource } from "./GenericResource";
import type { Sentences, Words, Texts } from "@/data/types/ResourcesData";

export const useSentences = () => {
  const hook = useGenericResource<Sentences>("sentences");
  console.log("🎣 Initializing sentences hook...");
  return {
    ...hook,
  };
};

export const useWords = () => {
  const hook = useGenericResource<Words>("words");

  console.log("🎣 Initializing words hook...");
  return {
    ...hook,
  };
};

export const useTexts = () => {
  const hook = useGenericResource<Texts>("texts");
  console.log("🎣 Initializing texts hook...");
  return {
    ...hook,
  };
};
