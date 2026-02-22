"use client";

import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useBreadcrumb } from "@/context/BreadcrumbContext";

export default function AppBreadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();
  const { dynamicLabel } = useBreadcrumb();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment !== "");

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      <Link
        underline="hover"
        color="inherit"
        onClick={() => router.push("/")}
        sx={{ cursor: "pointer" }}
      >
        Home
      </Link>

      {pathSegments.map((segment, index) => {
        const routeTo =
          "/" + pathSegments.slice(0, index + 1).join("/");

        const isLast =
          index === pathSegments.length - 1;

        let label =
          segment.charAt(0).toUpperCase() +
          segment.slice(1);

        // 🔥 Replace last segment if dynamic label exists
        if (isLast && dynamicLabel) {
          label = dynamicLabel;
        }

        return isLast ? (
          <Typography key={routeTo} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link
            key={routeTo}
            underline="hover"
            color="inherit"
            onClick={() => router.push(routeTo)}
            sx={{ cursor: "pointer" }}
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}