import React, { createContext, useReducer } from "react";
import { Asset } from "../model/Asset";
import { reducer, Types } from "../reducer/assetReducer";
import { initialState } from "../reducer/initialState";

export type AssetContextType = {
  assets: Asset[];
  selectedAsset: Asset;
  addAsset: (asset: Asset) => void;
  editAsset: (oldAsset: Asset, newAsset: Asset) => void;
  deleteAsset: (asset: Asset) => void;
  setSelectedAsset: (asset: Asset) => void;
  isCodeUnique: (code: string) => boolean;
};

// Context
export const AssetContext = createContext<AssetContextType | null>(null);

// Provider to dispath actions
export const Provider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {
    assets: state.assets,
    selectedAsset: state.selectedAsset,
    addAsset: (asset: Asset) => {
      dispatch({ type: Types.ADD_ASSET, asset });
    },
    editAsset: (oldAsset: Asset, newAsset: Asset) => {
      dispatch({ type: Types.EDIT_ASSET, oldAsset, newAsset });
    },
    deleteAsset: (asset: Asset) => {
      dispatch({ type: Types.DELETE_ASSET, asset });
    },
    setSelectedAsset: (asset: Asset) => {
      dispatch({ type: Types.SET_SELECTED_ASSET, asset });
    },
    isCodeUnique: (code: string) => {
      return state.assets.some((asset) => asset.code === code);
    },
  };

  return (
    <AssetContext.Provider value={value}>{children}</AssetContext.Provider>
  );
};
