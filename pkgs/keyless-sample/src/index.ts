import {EphemeralKeyPair} from "@aptos-labs/ts-sdk";
import {storeEphemeralKeyPair} from "./util/keyFunctions";
import clientSercet from "./../client_secret.json";

/**
 * Keylessを試すサンプルスクリプト
 */
async function main() {
  console.log(
    " =================================== [Start] =================================== "
  );
  // キーペア生成
  const ephemeralKeyPair = EphemeralKeyPair.generate();
  console.log(" ephemeralKeyPair :", ephemeralKeyPair);
  // localStorageに保存
  storeEphemeralKeyPair(ephemeralKeyPair);

  // 認証処理用に用意する。
  const redirectUri = "https://github.com/mashharuki";
  const clientId = clientSercet.web.client_id;
  // Get the nonce associated with ephemeralKeyPair
  const nonce = ephemeralKeyPair.nonce;
  // ログインURL
  const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&scope=openid+email+profile&nonce=${nonce}&redirect_uri=${redirectUri}&client_id=${clientId}`;

  console.log(" loginUrl:", loginUrl);

  // 以降、ログインが完了してGitHubの画面に遷移すれば成功！！
  // 遷移先のURLを取得しておくこと！！

  console.log(
    " =================================== [End] =================================== "
  );
}

main().catch((error) => {
  console.error("error:", error);
  process.exitCode = 1;
});
