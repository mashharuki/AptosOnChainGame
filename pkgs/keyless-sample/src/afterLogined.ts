import {
  getLocalEphemeralKeyPair,
  storeEphemeralKeyPair,
} from "./util/keyFunctions";
import "dotenv/config";
import {jwtDecode} from "jwt-decode";
import {Account, Aptos, AptosConfig, Network} from "@aptos-labs/ts-sdk";

/**
 * URLから id_token パラメーターを取得するメソッド
 * @param url
 * @returns
 */
const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url);
  const fragment = urlObject.hash.substring(1);
  const params = new URLSearchParams(fragment);
  return params.get("id_token");
};

/**
 * Google認証後にトランザクションを送信する処理を試すスクリプト
 */
async function main() {
  console.log(
    " =================================== [Start] =================================== "
  );

  // リダイレクト後のURL
  // 環境変数から取得する
  const url = process.env.URL;
  console.log("URL:", url);

  // リダイレクト先のURLから id_token要素を取得する
  // window.location.href = https://.../login/google/callback#id_token=...
  // const jwt = parseJWTFromURL(window.location.href)
  const jwt = parseJWTFromURL(url);

  const payload = jwtDecode<{nonce: string}>(jwt);
  const jwtNonce = payload.nonce;
  // get KeyPair
  const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce);

  // DevNetに接続してインスタンスを生成
  const config = new AptosConfig({network: Network.LOCAL});
  const aptos = new Aptos(config);
  // keylessAccount情報を取得する。
  const keylessAccount = await aptos.deriveKeylessAccount({
    jwt,
    ephemeralKeyPair,
  });

  console.log("KeylessAccount:", {keylessAccount});
  // fund some amount
  await aptos.fundAccount({
    accountAddress: keylessAccount.accountAddress,
    amount: 1000,
  });

  const bob = Account.generate();
  // send test token
  const transaction = await aptos.transferCoinTransaction({
    sender: keylessAccount.accountAddress,
    recipient: bob.accountAddress,
    amount: 1,
  });
  // sign & Send Tx
  const committedTxn = await aptos.signAndSubmitTransaction({
    signer: keylessAccount,
    transaction,
  });
  // get Response Tx
  const committedTransactionResponse = await aptos.waitForTransaction({
    transactionHash: committedTxn.hash,
  });

  console.log("committedTransactionResponse:", {committedTransactionResponse});

  console.log(
    " =================================== [End] =================================== "
  );
}

main().catch((error) => {
  console.error("error:", JSON.stringify(error));
  process.exitCode = 1;
});
