import { useState, useMemo, useContext } from "react";
import TableComponent from "../components/table/TableComponent";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "../model/Asset";
import { AssetContext, AssetContextType } from "../context/AssetContext";
import ActionButtons from "../components/ActionButtons";
import { getMinutesFormat } from "../utils/durationUtils";
import { Button } from "react-bootstrap";
import AssetForm from "../components/FormPopin";

/**
 * Assets view component
 */
const AssetsView = () => {
  const [showForm, setShowForm] = useState(false);

  const { assets, setSelectedAsset } = useContext(
    AssetContext,
  ) as AssetContextType;

  // Build table columns
  const cols = useMemo<Array<ColumnDef<Asset>>>(
    () => [
      {
        header: "Code",
        cell: (table) => table.renderValue(),
        accessorKey: "code",
        size: 200,
      },
      {
        header: "Activation offset",
        cell: (table) => getMinutesFormat(table.renderValue() as string),
        accessorKey: "activationOffset",
        size: 200,
      },
      {
        header: "Email",
        cell: (table) => table.renderValue(),
        accessorKey: "contact.email",
        size: 200,
      },
      {
        header: "Phone number",
        cell: (table) => table.renderValue(),
        accessorKey: "contact.phoneNumber",
        size: 200,
      },
      {
        header: "Actions",
        cell: (table) => (
          <ActionButtons
            asset={table.row.original as Asset}
            setShowForm={setShowForm}
          />
        ),
        accessorKey: "actions",
      },
    ],
    [],
  );

  return (
    <>
      <AssetForm show={showForm} setShow={setShowForm} />
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => {
            setSelectedAsset({} as Asset);
            setShowForm(true);
          }}
        >
          Add new asset
        </Button>
      </div>
      <TableComponent columns={cols} data={assets} />
    </>
  );
};

export default AssetsView;
