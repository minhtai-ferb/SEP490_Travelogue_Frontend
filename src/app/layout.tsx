import "@/app/globals.css";
import { Provider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import Head from "next/head"; 
import '@ant-design/v5-patch-for-react-19';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Traveloge",
  description: "Traveloge - Tây Ninh Du khảo Về Nguồn",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("[antd: compatible]")) {
      return;
    }
    originalWarn(...args);
  };

  return (
    <html lang="en">
      {typeof window !== "undefined" && (
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=G-HWLT49JNTK`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-HWLT49JNTK');
              `,
            }}
          ></script>
          <script async src="https://apis.google.com/js/api.js"></script>
        </Head>
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <Providers>{children}</Providers>
        </Provider>
      </body>
    </html>
  );
}
