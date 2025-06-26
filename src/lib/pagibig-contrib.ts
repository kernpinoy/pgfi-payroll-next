export function getPagibigOffset(grossPay: number) {
  const ans = grossPay * 0.02;
  console.log("ans:", ans);

  return Math.abs(ans - 200);
}
