import { Container } from "react-bootstrap";
import { Provider } from "./context/AssetContext";
import Assets from "./view/AssetsView";

const App = () => {
  return (
    <Provider>
      <Container>
        <h1 className="text-center m-3">Assets</h1>
        <Assets />
      </Container>
    </Provider>
  );
};

export default App;
