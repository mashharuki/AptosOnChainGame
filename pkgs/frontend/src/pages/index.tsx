import Image from "next/image";
import { Inter } from "next/font/google";
import {
  getLocalEphemeralKeyPair,
  parseJWTFromURL,
  storeEphemeralKeyPair,
} from "@/util/keyFunctions";
import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { BASE_LOGIN_URL, REDIRECT_URL } from "@/util/constants";
import Router from "next/router";
import { jwtDecode } from "jwt-decode";
import { getAptosClient } from "@/util/aptosClient";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

/**
 * Home Component
 * @returns
 */
export default function Home() {
  /**
   * google認証してKeylessAccountを作成するメソッド
   */
  const login = async () => {
    // キーペア生成
    const ephemeralKeyPair = EphemeralKeyPair.generate();
    // localStorageに保存
    storeEphemeralKeyPair(ephemeralKeyPair);

    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    // Get the nonce associated with ephemeralKeyPair
    const nonce = ephemeralKeyPair.nonce;
    // create login url
    const loginUrl = `${BASE_LOGIN_URL}&nonce=${nonce}&redirect_uri=${REDIRECT_URL}&client_id=${clientId}`;
    // 認証画面に遷移させる
    const authWindow = window.open(loginUrl, "_blank");

    const checkAuthInterval = setInterval(() => {
      if (authWindow!.closed) {
        clearInterval(checkAuthInterval);
        // 認証画面が閉じられた後にここで後続の処理を実行する
        // この例では、後続の処理をここに記述する
        console.log("認証が完了しました。後続の処理を実行します。");
        // 元の画面にリダイレクトするなどの後続処理を実行する
      }
    }, 1000); // 1秒ごとに認証画面が閉じられたかどうかを確認する

    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get("returnUrl");

    console.log(urlParams);

    if (returnUrl) {
      const jwt: any = parseJWTFromURL(window.location.href);

      const payload = jwtDecode<{ nonce: string }>(jwt!);
      const jwtNonce = payload.nonce;
      // get KeyPair
      const keyPair = getLocalEphemeralKeyPair(jwtNonce);

      console.log({ jwt });
      console.log({ jwtNonce });
      console.log({ keyPair });

      // DevNetに接続してインスタンスを生成
      const aptos = getAptosClient();

      // keylessAccount情報を取得する。
      const keylessAccount = await aptos.deriveKeylessAccount({
        jwt,
        ephemeralKeyPair,
      });

      console.log("KeylessAccount:", { keylessAccount });
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex"></div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={login}
        >
          SignUp/Login
        </button>
      </div>
    </main>
  );
}
