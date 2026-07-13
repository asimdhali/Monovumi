import { Geist, Geist_Mono, Hind_Siliguri, Tiro_Bangla } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const hindSiliguri = Hind_Siliguri({
  variable: "--font-bengali-sans",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});
const tiroBangla = Tiro_Bangla({
  variable: "--font-bengali-serif",
  subsets: ["bengali"],
  weight: ["400"],
});

export const metadata = {
  title: "MonoVumi",
  description: "এক টুকরো চিন্তার জায়গা",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} ${tiroBangla.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FBF9F4]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}