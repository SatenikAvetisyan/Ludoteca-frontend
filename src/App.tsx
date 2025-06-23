import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Game } from "./pages/Game/Game";
import { Author } from "./pages/Author/Author";
import { Category } from "./pages/Category/Category";
import { Clients } from "./pages/Clients/Clients";
import { Loan } from "./pages/Loan/Loan";
import { Layout } from "./components/Layout";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { LoaderProvider } from "./context/LoaderProvider";

function App() {
  return (
    <LoaderProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index path="games" element={<Game />} />
            <Route path="categories" element={<Category />} />
            <Route path="authors" element={<Author />} />
            <Route path="clients" element={<Clients />} />
            <Route path="loan" element={<Loan />} />
            <Route path="*" element={<Navigate to="/games" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </LoaderProvider>
  );
}

export default App;