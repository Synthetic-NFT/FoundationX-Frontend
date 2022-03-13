export const tableColumns: {
  id: string;
  label: string;
  minWidth: number;
  align?: "right";
}[] = [
  { id: "ticker", label: "Ticker", minWidth: 170 },
  { id: "price", label: "Price", minWidth: 170, align: "right" },
  { id: "fee", label: "Fee", minWidth: 170, align: "right" },
];

export default tableColumns;
