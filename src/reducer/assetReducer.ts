import { Asset } from "../model/Asset";

export enum Types {
  ADD_ASSET = "ADD",
  EDIT_ASSET = "EDIT",
  DELETE_ASSET = "DELETE",
  SET_SELECTED_ASSET = "SET_SELECTED_ASSET",
  IS_CODE_UNIQUE = "IS_CODE_UNIQUE",
}

// An enum with all the types of actions to use in our reducer
export type AssetAction =
  | { type: Types.ADD_ASSET; asset: Asset }
  | { type: Types.EDIT_ASSET; oldAsset: Asset; newAsset: Asset }
  | { type: Types.DELETE_ASSET; asset: Asset }
  | { type: Types.SET_SELECTED_ASSET; asset: Asset }
  | { type: Types.IS_CODE_UNIQUE; code: string };

// An interface for the global asset state
export interface AssetState {
  assets: Asset[];
  selectedAsset: Asset;
}

// Reducer to handle actions
export const reducer = (state: AssetState, action: AssetAction) => {
  switch (action.type) {
    case Types.ADD_ASSET:
      return { ...state, assets: [action.asset, ...state.assets] };
    case Types.EDIT_ASSET:
      return {
        ...state,
        assets: state.assets.map((asset) =>
          asset.code === action.oldAsset.code ? action.newAsset : asset,
        ),
      };
    case Types.DELETE_ASSET:
      return {
        ...state,
        assets: state.assets.filter(
          (asset) => asset.code !== action.asset.code,
        ),
      };
    case Types.SET_SELECTED_ASSET:
      return {
        ...state,
        selectedAsset: action.asset,
      };
    default:
      return state;
  }
};
