import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "大埔宏福苑維修火災事件簿",
  description: "關於大埔宏福苑大維修期間發生火災的事件時間表。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK">
      <body
        className={`${notoSansTC.variable} font-sans antialiased bg-slate-50`}
      >
        {children}

      </body>
    </html>
  );
}
