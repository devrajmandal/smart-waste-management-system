import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

function App() {
  const [auth, setAuth] = useState(() => {
    return !!localStorage.getItem("token");
  });

  return auth ? <Dashboard setAuth={setAuth} /> : <Landing setAuth={setAuth} />;
}

export default App;