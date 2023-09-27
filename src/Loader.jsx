import React from "react";
import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div>
      <MoonLoader
        color="#146ca7"
        size={25}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
