/**
 * Keylessを試すサンプルスクリプト
 */
async function main() {
  console.log(
    " =================================== [Start] =================================== "
  );

  console.log(
    " =================================== [End] =================================== "
  );
}

main().catch((error) => {
  console.error("error:", error);
  process.exitCode = 1;
});
