const theme = {
  boarder: "#0f172a",
  wallet: "#356ae1ff",
  topBar: "#1e293b",
  leftNav: "#1e293b",
  routeContainer: "#334155",

  activeTextColor: "#f1f5f9",
  inactiveTextColor: "#94a3b8",

  tableBackgroundColor: "#475569",
  tableHeaderBackgroundColor: "#0f172a",
  tableHeaderTextColor: "#94a3b8",

  tableSearchBarBackgroundColor: "#0f172a",

  tableRowPrimaryTextColor: "#f1f5f9",
  tableRowSecondaryTextColor: "#94a3b8",

  tableBorderColor: "#0f172a",

  instrumentCardBackgroundColor: "#0f172a",
  tradeFormBackgroundColor: "#1e293b",
  tradeFormOutline: "#94a3b8",
};

export type Theme = typeof theme;

// A more scalable solution is [themeing](https://mui.com/customization/theming/) but this
// is good for now.
export default theme;
