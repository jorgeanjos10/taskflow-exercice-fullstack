import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Layout from "@/components/Layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <Layout>{children}</Layout>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
