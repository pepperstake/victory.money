import { ConnectButton } from "@rainbow-me/rainbowkit";
import CreateForm from "components/CreateForm";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 12,
        }}
      >
        <ConnectButton />
      </div>
      <CreateForm />
    </>
  );
};

export default Home;
