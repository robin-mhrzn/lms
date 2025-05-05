import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./../globals.css";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "@/components/common/scrollToTop";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { AuthProvider } from "@/context/auth/Auth.Context";
import Header from "@/components/layout/public/Header";
import Footer from "@/components/layout/public/Footer";
import Loading from "../loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMS",
  description: "Learning Management System",
};
const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <Header />
      </AuthProvider>
      <main className="">{children}</main>
      <Footer />
      <ScrollToTop />
    </Suspense>
  );
}
