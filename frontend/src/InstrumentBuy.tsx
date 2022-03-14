import { Button } from "@material-ui/core";
import { useContext } from "react";

import { Instrument } from "./TradeContext";
import { AppContext } from "@/AppContext";

// Rendered in the `/trade/order/buy` and contains business logic related to placing a
// order for an instrument.
export default function InstrumentBuy({
  instrument,
}: {
  instrument: Instrument;
}) {
  const { appData, setAppData } = useContext(AppContext);
  return (
    <>
      {/* Add business logic related to the buy order here */}
      <div>Fee: {instrument.fee}</div>
      {/* The place order button. We can connect it with the wallet connection flow. */}
      <Button size="large" variant="contained" onClick={() => {}}>
        {appData == null ? "Wallet Not Connected" : "Place Order"}
      </Button>
    </>
  );
}
