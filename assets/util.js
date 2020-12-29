export function formatMMDDYYYY(date) {
  let _date = new Date(date);
  return _date.toLocaleString("en-US", { timeZone: "UTC", dateStyle: "short" });
}

export function formatAmount(amount) {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(amount);
}
