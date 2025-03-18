import { useEffect, useState } from "react";

const MINIKUBE_URL = "http://127.0.0.1:58317";

// TODO: Add hot-reload to k8s
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(MINIKUBE_URL)
      .then((res) => {
        console.log("res", res);
        return res.json();
      })
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div>
      <h1>Frontend React App</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
