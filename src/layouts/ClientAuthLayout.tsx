import { Outlet } from "react-router-dom";

const ClientAuthLayout = () => {
  return (
    <main className="flex-grow">
      <Outlet />
    </main>
  );
};

export default ClientAuthLayout;