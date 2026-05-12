import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root-minimal">{children}</div>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
