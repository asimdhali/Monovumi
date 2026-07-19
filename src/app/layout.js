import {
  Geist,
  Geist_Mono,
  Hind_Siliguri,
  Tiro_Bangla,
} from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import { AuthProvider } from "./AuthContext";
import { BookDetailedProvider } from "./BookDetailedContext";
import FeaturedBar from "./FeaturedBar";
import { PostsProvider } from "./PostsContext";

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
  title: "মনোভূমি — নৈতিক শিক্ষা ও জ্ঞানের ঠিকানা",
  description:
    "বাংলাদেশীদের নৈতিক শিক্ষা, দক্ষতা ও জ্ঞান-বিজ্ঞান অর্জনের ফ্রি প্ল্যাটফর্ম",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} ${tiroBangla.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[var(--color-app-bg)] text-[var(--color-app-text)]">
        <AuthProvider>
          <BookDetailedProvider>
            <PostsProvider>
              <Navbar />
              <FeaturedBar />
              {children}
            </PostsProvider>
          </BookDetailedProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
