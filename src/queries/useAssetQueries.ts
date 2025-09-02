import axios, { AxiosError } from "axios";
import { Asset } from "../model/Asset";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:4000/assets";

export const useGetAssetsQuery = () => {
  return useQuery<Asset[], AxiosError>({
    queryKey: ["ASSETS"],
    queryFn: () => axios.get(API_URL).then((res) => res.data),
  });
};

export const useCreateAssetsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Asset, AxiosError, Asset>({
    mutationFn: (newAsset: Asset) =>
      axios.post(API_URL, newAsset).then((res) => res.data),
    onSuccess: (newAsset) => {
      const oldAssets = queryClient.getQueryData<Asset[]>(["ASSETS"]) || [];
      queryClient.setQueryData(["ASSETS"], [...oldAssets, newAsset]);
    },
  });
};

export const useEditAssetsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Asset, AxiosError, Asset>({
    mutationFn: (assetToEdit: Asset) =>
      axios
        .put(`${API_URL}/${assetToEdit.id}`, assetToEdit)
        .then((res) => res.data),
    onSuccess: (editedAsset) => {
      const oldAssets = queryClient.getQueryData<Asset[]>(["ASSETS"]) || [];
      queryClient.setQueryData(
        ["ASSETS"],
        oldAssets.map((asset) =>
          asset.id === editedAsset.id ? editedAsset : asset,
        ),
      );
    },
  });
};

export const useDeleteAssetsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Asset, AxiosError, Asset>({
    mutationFn: (assetToDelete: Asset) =>
      axios.delete(`${API_URL}/${assetToDelete.id}`).then((res) => res.data),
    onSuccess: (_, deletedAsset) => {
      const oldAssets = queryClient.getQueryData<Asset[]>(["ASSETS"]) || [];
      queryClient.setQueryData(
        ["ASSETS"],
        oldAssets.filter((asset) => asset.id !== deletedAsset.id),
      );
    },
  });
};
