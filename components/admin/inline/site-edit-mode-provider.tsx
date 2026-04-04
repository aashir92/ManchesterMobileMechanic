"use client";

import { createContext, useContext, type ReactNode } from "react";

const SiteEditModeContext = createContext(false);

export function SiteEditModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  return (
    <SiteEditModeContext.Provider value={isAdmin}>
      {children}
    </SiteEditModeContext.Provider>
  );
}

export function useSiteEditMode(): boolean {
  return useContext(SiteEditModeContext);
}
