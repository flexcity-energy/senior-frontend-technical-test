import moment from "moment";
import { Asset } from "../model/Asset";
import { AssetFormObject } from "../model/AssetFormObject";
import { getMinutes } from "./durationUtils";

/**
 * Convert asset to asset form object
 * @param asset
 * @returns asset form object
 */
export const convertToAssetForm = (asset: Asset): AssetFormObject => {
  return {
    ...asset,
    activationOffset: Number(getMinutes(asset.activationOffset)),
  };
};

/**
 * Convert asset form object to asset
 * @param asset form object
 * @returns asset
 */
export const convertToAsset = (assetForm: AssetFormObject): Asset => {
  const duration = moment.duration({ minute: assetForm.activationOffset });

  return {
    ...assetForm,
    activationOffset: duration.toISOString(),
  };
};

/**
 * Check if asset code is unique
 * @param assets
 * @param previousCode
 * @param newCode
 * @returns true if unique
 */
export const isCodeUnique = (
  assets: Asset[],
  previousCode: string,
  newCode: string | undefined,
): boolean => {
  // Remove the old asset code from list
  const arr = assets.filter((asset) => asset.code !== previousCode);

  // Check if new code already exists in list
  return !arr.some((asset) => asset.code === newCode);
};
