"use client";

import { createContext, useContext, useState } from "react";

interface BreadcrumbContextType {
  dynamicLabel: string | null;
  setDynamicLabel: (label: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  dynamicLabel: null,
  setDynamicLabel: () => {},
});

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dynamicLabel, setDynamicLabel] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider
      value={{ dynamicLabel, setDynamicLabel }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  return useContext(BreadcrumbContext);
}