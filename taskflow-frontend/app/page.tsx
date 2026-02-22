"use client";

import { Container, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";
import UserSelector from "@/components/UserSelector";

export default function Home() {
  return (
    <Container sx={{ mt: 6 }}>
      <Stack spacing={4}>
        <Typography variant="h4" fontWeight="bold">
            TaskFlow
        </Typography>

        <UserSelector />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" component={Link} href="/employees">
            Manage Employees
          </Button>

          <Button variant="outlined" component={Link} href="/vacations">
            Manage Vacations
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
