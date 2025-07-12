export function getPagibigOffset(grossPay: number) {
  const ans = grossPay * 0.02;

  return Math.abs(ans - 200);
}
