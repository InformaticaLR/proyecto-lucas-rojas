import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Background from "@/components/Background";
import { Toaster } from "react-hot-toast";

//const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  weight: "400",
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: "Licitaciones Lucas Rojas",
  description: "Licitaciones Lucas Rojas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Header/>
        <Background/>
        <Toaster position="top-center"
        containerClassName=""
        containerStyle={{
          top: 80
        }}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#21b026",
            color: "#fff",
          },
        }} />
        {children}
        </body>
    </html>
  );
}
