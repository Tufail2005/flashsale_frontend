import { type OrderMetric } from "../types";

interface SystemHealthProps {
  metrics: OrderMetric[];
  dlqRescues: number;
}

export function SystemHealth({ metrics, dlqRescues }: SystemHealthProps) {
  const getMetric = (status: string) => {
    return metrics?.find((m) => m.status === status)?.count || 0;
  };

  return (
    <div className="card" style={{ marginTop: 0 }}>
      <h2>SYSTEM HEALTH & METRICS</h2>
      <table className="metrics-table">
        <tbody>
          <tr>
            <td>
              <div className="stat-box">
                <h3>CONFIRMED ORDERS</h3>
                <div className="value val-confirmed">
                  {getMetric("CONFIRMED")}
                </div>
              </div>
            </td>
            <td>
              <div className="stat-box">
                <h3>PENDING IN QUEUE</h3>
                <div className="value val-pending">{getMetric("PENDING")}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div className="stat-box">
                <h3>FAILED PAYMENTS</h3>
                <div className="value val-failed">{getMetric("FAILED")}</div>
              </div>
            </td>
            <td>
              <div className="stat-box">
                <h3 style={{ color: "var(--blue)" }}>DLQ RESCUES</h3>
                <div className="value val-dlq">{dlqRescues || 0}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
