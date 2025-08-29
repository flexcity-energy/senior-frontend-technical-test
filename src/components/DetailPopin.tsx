import { Asset } from "../model/Asset";
import { Modal, Row, Col } from "react-bootstrap";
import { getMinutesFormat } from "../utils/durationUtils";

/**
 * Detail popin props
 */
interface DetailPopinProps {
  /**
   * Popin show state
   */
  show: boolean;

  /**
   * Callback function to edit show state
   */
  setShow: (show: boolean) => void;

  /**
   * Asset
   */
  asset: Asset;
}

/**
 * Detail popin component
 */
const DetailPopin = ({ show, setShow, asset }: DetailPopinProps) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{asset.code} detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>Code :</Col>
          <Col className="fw-bold">{asset.code}</Col>
        </Row>
        <Row>
          <Col>Activation offset :</Col>
          <Col className="fw-bold">
            {getMinutesFormat(asset.activationOffset)}
          </Col>
        </Row>
        <Row>
          <Col>Email :</Col>
          <Col className="fw-bold">{asset.contact.email}</Col>
        </Row>
        <Row>
          <Col>Phone number :</Col>
          <Col className="fw-bold">{asset.contact.phoneNumber}</Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default DetailPopin;
