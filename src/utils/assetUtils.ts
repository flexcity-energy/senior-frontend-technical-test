import { Asset } from "../model/Asset";

export const isCodeUnique = (
  assets: Asset[],
  previousCode: string,
  newCode: string | undefined,
): boolean => {
  const arr = assets.filter((asset) => asset.code !== previousCode);
  return !arr.some((asset) => asset.code === newCode);
};
