import React from "react";

import { NFTIcons } from "../fakeData";
import theme from "../theme";
import {Instrument} from "../util/dataStructures";

export default function SwapperCard({
  cardWidth,
  instrument,
}: {
  cardWidth: string;
  instrument: Instrument;
}) {
  const data = [
    ["Full Name", instrument.fullName],
    ["Address", instrument.address],
  ];

  // @ts-ignore
  return (
    <div
      style={{
        color: theme.activeTextColor,
        borderRadius: "0.25rem",
        display: "flex",
        flex: cardWidth,
        fontSize: "14pt",
        padding: "0.67rem",
        width: "14rem",
        height: "21rem",
        flexDirection: "column",
        marginLeft: "1rem",
        backgroundColor: theme.instrumentCardBackgroundColor,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            src={NFTIcons.get(instrument.ticker)}
            alt={instrument.ticker}
            style={{height:"2rem", width:"2rem"}}
          />
          <div
            style={{
              marginRight: "0.67rem",
            }}
          />
          <b style={{ marginTop: "0.75rem" }}>{instrument.ticker}</b>
        </div>
        <div
          style={{
            color: theme.inactiveTextColor,
            display: "flex",
            flexDirection: "column",
            marginTop: "1.33rem",
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
