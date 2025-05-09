import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Main />
    </div>
  );
}
