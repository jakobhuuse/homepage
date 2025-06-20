import Navbar from "@/components/navbar";
import { ReactNode } from "react";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main>
        <h1>Welcome to the Game Hub</h1>
        <p>Select a game to start playing!</p>
      </main>
    </div>
  );
}