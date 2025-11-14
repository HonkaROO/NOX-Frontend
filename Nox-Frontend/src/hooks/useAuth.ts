import { useContext } from "react";
import { AutContext } from "@/context/AuthContext";

export function useAuth() {
  const context = useContext(AutContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
