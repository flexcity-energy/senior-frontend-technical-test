import { useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AssetFormObject } from "../model/AssetFormObject";
import { assetSchema } from "../schemaForm/assetSchema";
import { Asset } from "../model/Asset";
import {
  useCreateAssetsMutation,
  useEditAssetsMutation,
  useGetAssetsQuery,
} from "../queries/useAssetQueries";

interface FormPopinProps {
  show: boolean;
  setShow: (show: boolean) => void;
  selectedAsset?: Asset;
}

const defaultValues = {
  code: "",
  contact: { email: "", phone: "" },
} as AssetFormObject;

const FormPopin = ({ show, setShow, selectedAsset }: FormPopinProps) => {
  const { data: assets = [] } = useGetAssetsQuery();
  const createMutation = useCreateAssetsMutation();
  const editMutation = useEditAssetsMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormObject>({
    resolver: yupResolver(assetSchema(assets, selectedAsset?.code)),
    defaultValues,
  });

  const resetDefaultValues = () => {
    if (selectedAsset?.code) reset(selectedAsset);
    else reset(defaultValues);
  };

  useEffect(() => {
    resetDefaultValues();
  }, [selectedAsset]);

  const closePopin = () => setShow(false);

  const onSubmit = (data: AssetFormObject) => {
    selectedAsset?.code
      ? editMutation.mutate({ ...data, code: selectedAsset.code })
      : createMutation.mutate(data);

    closePopin();
  };

  return (
    <Modal show={show} onHide={closePopin}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedAsset?.code ? "Edit" : "Add"} asset {selectedAsset?.code}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Code :
            </Form.Label>
            <Col>
              <Form.Control
                type="text"
                disabled={!!selectedAsset}
                {...register("code")}
              />
              {errors.code && (
                <Form.Text className="text-danger">
                  {errors.code && errors.code.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Email :
            </Form.Label>
            <Col>
              <Form.Control type="email" {...register("contact.email")} />
              {errors.contact?.email?.message && (
                <Form.Text className="text-danger">
                  {errors.contact.email.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Phone :
            </Form.Label>
            <Col>
              <Form.Control type="tel" {...register("contact.phone")} />
              {errors.contact?.phone && (
                <Form.Text className="text-danger">
                  {errors.contact.phone.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button className="mx-2" variant="secondary" onClick={closePopin}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedAsset?.code ? "Edit" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormPopin;
