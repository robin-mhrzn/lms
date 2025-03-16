import Footer from "@/components/publicLayout/footer";
import Header from "@/components/publicLayout/header";
import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="flex-grow">
        <Header></Header>
        {children}
        <Footer></Footer>
      </main>
    </div>
  );
}

export default Layout;
