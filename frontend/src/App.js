import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Portfolio from "@/components/Portfolio";
import AdminPage from "@/components/admin/AdminPage";

function App() {
  return (
    <div className="App relative min-h-screen bg-[#0A0A0A] text-[#F4F4F5]">
      <div className="grain" aria-hidden="true"></div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/messages" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#121212",
            border: "1px solid rgba(0,229,255,0.3)",
            color: "#F4F4F5",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}

export default App;
