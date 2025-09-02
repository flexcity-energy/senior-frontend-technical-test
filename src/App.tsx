import { Container } from "react-bootstrap";
import Assets from "./view/AssetsView";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnReconnect: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <h1 className="text-center m-3">Assets</h1>
        <Assets />
      </Container>
    </QueryClientProvider>
  );
};

export default App;
