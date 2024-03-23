import type {NextApiRequest, NextApiResponse} from "next";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import {type NextRequest} from "next/server";

export default function handler(req: NextRequest, res: NextApiResponse) {
  // 認証後のURLを取得
  const searchParams = req.nextUrl.searchParams;
  // id_tokenパラメータを取得する
  const idToken = searchParams.get("id_token");

  console.log("idtoken:", idToken);

  res.status(200).json({name: "John Doe"});
}
