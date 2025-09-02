import { Asset } from "../model/Asset";
import { Modal, Row, Col } from "react-bootstrap";

interface DetailPopinProps {
  show: boolean;
  setShow: (show: boolean) => void;
  asset: Asset;
}

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
          <Col>Email :</Col>
          <Col className="fw-bold">{asset.contact.email}</Col>
        </Row>
        <Row>
          <Col>Phone number :</Col>
          <Col className="fw-bold">{asset.contact.phone}</Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default DetailPopin;
