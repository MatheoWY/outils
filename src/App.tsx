import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Flux from "./pages/Flux";
import NotFound from "./pages/NotFound";
import Signatures from "./pages/Signatures";
import MethodeWorkAndYou from "./pages/MethodeWorkAndYou";
import N8n from "./pages/N8n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carte" element={<Index />} />
          <Route path="/flux" element={<Flux />} />
          <Route path="/signatures" element={<Signatures />} />
          <Route path="/methode" element={<MethodeWorkAndYou />} />
          <Route path="/n8n" element={<N8n />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
