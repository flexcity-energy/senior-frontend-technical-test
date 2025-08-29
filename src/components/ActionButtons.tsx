import { useState, useContext } from "react";
import { Asset } from "../model/Asset";
import { PencilFill, TrashFill, EyeFill } from "react-bootstrap-icons";
import { AssetContext, AssetContextType } from "../context/AssetContext";
import { Button } from "react-bootstrap";
import AssetDetail from "./DetailPopin";

/**
 * Action buttons props
 */
interface ActionButtonsProps {
  /**
   * Asset in selected row
   */
  asset: Asset;

  /**
   * Callback function to show/hide the form popin
   * @param show
   */
  setShowForm: (show: boolean) => void;
}

/**
 * Action buttons component for performing action on table rows
 */
const ActionButtons = ({ asset, setShowForm }: ActionButtonsProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const { setSelectedAsset, deleteAsset } = useContext(
    AssetContext,
  ) as AssetContextType;

  return (
    <>
      {/* Asset Detail Popin */}
      <AssetDetail show={showDetail} setShow={setShowDetail} asset={asset} />
      <div className="d-flex">
        {/* Show asset detail button */}
        <Button
          className="m-1"
          onClick={() => {
            setShowDetail(true);
          }}
        >
          <EyeFill />
        </Button>

        {/* Edit asset button  */}
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

        {/* Delete asset button */}
        <Button
          className="m-1"
          variant="danger"
          onClick={() => deleteAsset(asset)}
        >
          <TrashFill />
        </Button>
      </div>
    </>
  );
};

export default ActionButtons;
