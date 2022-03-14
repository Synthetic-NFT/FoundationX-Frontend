const theme = {
  boarder: "#0f172a",
  topBar: "#1e293b",
  leftNav: "#1e293b",
  routeContainer: "#334155",

  activeTextColor: "#f1f5f9",
  inactiveTextColor: "#94a3b8",
};

export type Theme = typeof theme;

// A more scalable solution is [themeing](https://mui.com/customization/theming/) but this
// is good for now.
export default theme;
