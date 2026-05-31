import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "限定バトル ルール抽選",
  description: "TikTok LIVE向け限定バトルルール抽選アプリ",
};

const APP_VERSION = "Ver：2026/05/31-1";
const APP_CREDIT = "作成：みそ🎨🐾 @miso_eg";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-zinc-950 text-white">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>

          <footer className="border-t border-zinc-800 bg-zinc-900 px-6 py-4">
            <div className="mx-auto max-w-3xl text-center text-sm text-zinc-500">
              <p>{APP_VERSION}</p>
              <p className="mt-1">{APP_CREDIT}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}