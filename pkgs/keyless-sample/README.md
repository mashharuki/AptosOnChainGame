# Keyless Sample Code

## Keyless について

**現在動いているのは DevNet のみ。**

**現在対応しているプロバイダーは、Google のみ**

電子メールはオンチェーン上では公開されない。

## Keyless の開発ガイド

以下 3 ステップにより Keyless 化の対応が完了する。

- IdP との OpenID 統合を設定します。  
  このステップで、dApp は選択した IdP（Google など）に登録し、client_id を受け取ります。
- Aptos TypeScript SDK をインストールします。
- アプリケーションクライアントにキーレスアカウントのサポートを統合する  
  ユーザー用に「Sign In with [Idp]」フローを設定します。
  ユーザーの KeylessAccount をインスタンス化する
  KeylessAccount 経由でトランザクションに署名し、送信します。

サポートされている Idp は、Google のみ

AuthURL

https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=id_token&scope=openid%20email&nonce=${NONCE}

まず Google のサイトに行って Credentials を作成する。

```json
{
  "web": {
    "client_id": "XXXX",
    "project_id": "XXXX",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "XXXX"
  }
}
```

## 動かした履歴
