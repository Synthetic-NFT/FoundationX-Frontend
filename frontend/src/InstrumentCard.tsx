import React from "react";

import { Instrument } from "./api";
import { NFTIcons } from "./fakeData";
import theme from "./theme";

// export default function InstrumentCard({
//   instrument,
// }: {
//   instrument: Instrument;
// }) {
//   const data = [
//     ["Price", instrument.price],
//     // ["Fee", instrument.fee],
//   ];

//   // @ts-ignore
//   return (
//     <div
//       style={{
//         color: theme.activeTextColor,
//         borderRadius: "0.25rem",
//         display: "flex",
//         fontSize: "14pt",
//         padding: "0.67rem",
//         width: "14rem",
//         height: "21rem",
//         flexDirection: "column",
//         marginLeft: "1rem",
//         backgroundColor: theme.instrumentCardBackgroundColor,
//       }}
//     >
//       <div style={{ display: "flex", flexDirection: "column" }}>
//         <div style={{ display: "flex", flexDirection: "row" }}>
//           <img
//             src={NFTIcons.get(instrument.ticker)}
//             alt={instrument.ticker}
//             style={{height:"2rem", width:"2rem"}}
//           />
//           <div
//             style={{
//               marginRight: "0.67rem",
//             }}
//           />
//           <b style={{ marginTop: "0.75rem" }}>{instrument.ticker}</b>
//         </div>
//         <div
//           style={{
//             color: theme.inactiveTextColor,
//             display: "flex",
//             flexDirection: "column",
//             marginTop: "1.33rem",
//             fontSize: "12pt",
//           }}
//         >
//           {data.map(([label, value]) => (
//             <div
//               style={{
//                 display: "flex",
//                 flex: "1 0 100%",
//                 justifyContent: "space-between",
//               }}
//               key={label}
//             >
//               <div>{label}</div>
//               <div>{value}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function InstrumentCard({
  instrument,
}: {
  instrument: Instrument;
}) {
  const data = [
    ["Oracle Price", instrument.price],
    // ["Premium", instrument.fee],
    // ["Liquidity ", instrument.fee],
  ];

  // @ts-ignore
  return (
    <div
      style={{
        color: theme.activeTextColor,
        borderRadius: "0.75rem",
        display: "flex",
        fontSize: "14pt",
        padding: "1.33rem",
        width: "17.29rem",
        height: "8.7rem",
        flexDirection: "column",
        marginLeft: "1rem",
        background: "linear-gradient(160.35deg, rgba(31, 30, 35, 0.6) 13.15%, #25283C 93.23%)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <img
              src={NFTIcons.get(instrument.ticker)}
              alt={instrument.ticker}
              style={{ height: "2rem", width: "2rem" }}
            />
            <div
              style={{
                marginRight: "0.67rem",
              }}
            />
            <div style={{ lineHeight: "2rem", }}>{instrument.ticker}</div>
          </div>
          {/* <div style={{
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "0.67rem",
            lineHeight: "2rem",
            color: "#565656",
          }}>191.36 UST</div> */}
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
                justifyContent: "space-between",
                fontStyle: "normal",
                fontWeight: 300,
                fontSize: "0.58rem",
                lineHeight: "0.875rem",
                color: "#FFFFFF",
                marginBottom: "0.25rem",
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