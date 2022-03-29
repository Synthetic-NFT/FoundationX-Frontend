import React from "react";

import { Instrument } from "./api";
import { NFTIcons } from "./fakeData";
import theme from "./theme";

export default function InstrumentCard({
  instrument,
}: {
  instrument: Instrument;
}) {
  const data = [
    ["Price", instrument.price],
    ["Fee", instrument.fee],
  ];

  // @ts-ignore
    return (
    <div
      style={{
        color: theme.activeTextColor,
        borderRadius: "6px",
        display: "flex",
        fontSize: "14pt",
        padding: "16px",
        width: "336px",
        height: "224px",
        flexDirection: "column",
        marginLeft: "24px",
        backgroundColor: theme.instrumentCardBackgroundColor,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            src={NFTIcons.get(instrument.ticker)}
            alt={instrument.ticker}
            width="48px"
            height="48px"
          />
          <div
            style={{
              marginRight: "16px",
            }}
          />
          <b style={{ marginTop: "8px" }}>{instrument.ticker}</b>
        </div>
        <div
          style={{
            color: theme.inactiveTextColor,
            display: "flex",
            flexDirection: "column",
            marginTop: "32px",
            fontSize: "12pt",
          }}
        >
          {data.map(([label, value]) => (
            <div
              style={{
                display: "flex",
                flex: "1 0 100%",
                justifyContent: "space-between",
              }}
              key={label}
            >
              <div>{label}</div>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
