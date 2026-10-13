import { CheckCircle2, Package, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getOrders } from "../services/storage";

export default function OrderSuccess() {
  const { id } = useParams();
  const order = getOrders().find((o) => o.id === id);

  return (
    <main className="page">
      <div className="container success card">
        <CheckCircle2 className="success-icon" />
        <span className="eyebrow">ORDER CONFIRMED</span>
        <h1>Thank you for your order!</h1>
        <p>
          Your order <b>{id}</b> has been placed successfully.
        </p>

        {order && (
          <div className="success-box">
            <span><Package size={14} style={{ verticalAlign: "-2px", marginRight: "4px" }} /> Order Status</span>
            <b>{order.status}</b>

            <span>Total Amount</span>
            <b>${order.total.toFixed(2)}</b>

            <span>Payment Method</span>
            <b style={{ color: "#6246e8" }}>{order.payment}</b>

            {order.paymentDetails?.transactionId && (
              <>
                <span>Transaction ID (TrxID)</span>
                <b><code>{order.paymentDetails.transactionId}</code></b>
              </>
            )}

            {order.paymentDetails?.senderNumber && (
              <>
                <span>Sender Mobile</span>
                <b>{order.paymentDetails.senderNumber}</b>
              </>
            )}

            <span>Payment Status</span>
            <b>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: "12px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  background:
                    order.paymentDetails?.paymentStatus === "Paid"
                      ? "#dcfce7"
                      : order.paymentDetails?.paymentStatus === "Pending Verification"
                      ? "#fef3c7"
                      : "#f1f5f9",
                  color:
                    order.paymentDetails?.paymentStatus === "Paid"
                      ? "#15803d"
                      : order.paymentDetails?.paymentStatus === "Pending Verification"
                      ? "#b45309"
                      : "#475569",
                }}
              >
                {order.paymentDetails?.paymentStatus || "Unpaid"}
              </span>
            </b>
          </div>
        )}

        <div style={{ marginTop: "24px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <Link className="btn btn-primary" to="/orders">
            Track Order <ArrowRight size={16} />
          </Link>
          <Link className="btn btn-outline" to="/shop">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}