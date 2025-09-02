import { useState } from "react";
import { Asset } from "../model/Asset";
import { PencilFill, TrashFill, EyeFill } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import AssetDetail from "./DetailPopin";
import { useDeleteAssetsMutation } from "../queries/useAssetQueries";

interface ActionButtonsProps {
  asset: Asset;
  setShowForm: (show: boolean) => void;
  setSelectedAsset: (asset: Asset | undefined) => void;
}

const ActionButtons = ({
  asset,
  setShowForm,
  setSelectedAsset,
}: ActionButtonsProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const deleteMutation = useDeleteAssetsMutation();

  return (
    <>
      <AssetDetail show={showDetail} setShow={setShowDetail} asset={asset} />
      <div className="d-flex">
        <Button
          className="m-1"
          onClick={() => {
            setShowDetail(true);
          }}
        >
          <EyeFill />
        </Button>

        <Button
          className="m-1"
          variant="secondary"
          onClick={() => {
            setSelectedAsset(asset);
            setShowForm(true);
          }}
        >
          <PencilFill />
        </Button>

        <Button
          className="m-1"
          variant="danger"
          onClick={() => deleteMutation.mutate(asset)}
        >
          <TrashFill />
        </Button>
      </div>
    </>
  );
};

export default ActionButtons;
