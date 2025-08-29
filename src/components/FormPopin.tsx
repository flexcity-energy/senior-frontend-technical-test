import { useContext, useEffect } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import { AssetContext, AssetContextType } from "../context/AssetContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AssetFormObject } from "../model/AssetFormObject";
import { convertToAsset, convertToAssetForm } from "../utils/assetUtils";
import { assetSchema } from "../schemaForm/assetSchema";

/**
 * Form popin props
 */
interface FormPopinProps {
  /**
   * Popin show state
   */
  show: boolean;

  /**
   * Callback function to edit show state
   */
  setShow: (show: boolean) => void;
}

/**
 * Default asset form values
 */
const defaultValues = {
  code: "",
  activationOffset: 0,
  contact: { email: "", phoneNumber: "" },
} as AssetFormObject;

/**
 * Form popin component for adding or editing an asset
 */
const FormPopin = ({ show, setShow }: FormPopinProps) => {
  const { assets, selectedAsset, editAsset, addAsset } = useContext(
    AssetContext,
  ) as AssetContextType;

  // Init form settings with useForm hook
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<AssetFormObject>({
    resolver: yupResolver(assetSchema(assets, selectedAsset.code)),
    defaultValues,
  });

  /**
   * Reset form values to default
   */
  const resetDefaultValues = () => {
    // If edit mode, reset default asset values
    if (selectedAsset.code) reset(convertToAssetForm(selectedAsset));
    // If add mode, reset to empty value
    else reset(defaultValues);
  };

  // When selected asset changes, reset values
  useEffect(() => {
    resetDefaultValues();
  }, [selectedAsset]);

  /**
   * Close popin
   */
  const closePopin = () => setShow(false);

  /**
   * Action when form is submitted
   * @param asset form values
   */
  const onSubmit = (data: AssetFormObject) => {
    // Convert asset form object to asset
    const newAsset = convertToAsset(data);

    // Edit or add the asset to list
    selectedAsset.code
      ? editAsset(selectedAsset, newAsset)
      : addAsset(newAsset);

    closePopin();
  };

  return (
    <Modal show={show} onHide={closePopin}>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedAsset.code ? "Edit" : "Add"} asset {selectedAsset?.code}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Code field */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Code :
            </Form.Label>
            <Col>
              <Form.Control type="text" {...register("code")} />
              {errors.code && (
                <Form.Text className="text-danger">
                  {errors.code && errors.code.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          {/* Activation offset field */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Offset :
            </Form.Label>
            <Col>
              <Form.Control type="number" {...register("activationOffset")} />
              {errors.activationOffset && (
                <Form.Text className="text-danger">
                  {errors.activationOffset.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          {/* Email field */}
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

          {/* Phone number field */}
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="3">
              Phone :
            </Form.Label>
            <Col>
              <Form.Control type="tel" {...register("contact.phoneNumber")} />
              {errors.contact?.phoneNumber && (
                <Form.Text className="text-danger">
                  {errors.contact.phoneNumber.message}
                </Form.Text>
              )}
            </Col>
          </Form.Group>

          {/* Cancel and save buttons */}
          <div className="d-flex justify-content-end">
            <Button className="mx-2" variant="secondary" onClick={closePopin}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {selectedAsset.code ? "Edit" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FormPopin;
