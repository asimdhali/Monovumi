"use client";

import { createContext, useContext } from "react";

const HomeFeedContext = createContext(null);

export function HomeFeedProvider({ children }) {
  return (
    <HomeFeedContext.Provider value={{}}>{children}</HomeFeedContext.Provider>
  );
}

export function useHomeFeed() {
  return useContext(HomeFeedContext);
}
