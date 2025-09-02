import { useState, useMemo } from "react";
import TableComponent from "../components/table/TableComponent";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "../model/Asset";
import ActionButtons from "../components/ActionButtons";
import { Button } from "react-bootstrap";
import AssetForm from "../components/FormPopin";
import { useGetAssetsQuery } from "../queries/useAssetQueries";

const AssetsView = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    undefined,
  );

  const { data: assets = [] } = useGetAssetsQuery();

  const cols = useMemo<Array<ColumnDef<Asset>>>(
    () => [
      {
        header: "Code",
        cell: (table) => table.renderValue(),
        accessorKey: "code",
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
        accessorKey: "contact.phone",
        size: 200,
      },
      {
        header: "Actions",
        cell: (table) => (
          <ActionButtons
            asset={table.row.original as Asset}
            setShowForm={setShowForm}
            setSelectedAsset={setSelectedAsset}
          />
        ),
        accessorKey: "actions",
      },
    ],
    [],
  );

  return (
    <>
      <AssetForm
        show={showForm}
        setShow={setShowForm}
        selectedAsset={selectedAsset}
      />
      <div className="d-flex justify-content-end">
        <Button
          onClick={() => {
            setSelectedAsset(undefined);
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
