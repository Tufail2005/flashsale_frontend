interface HeaderProps {
  isConnected: boolean;
  timestamp?: string;
  isFetching: boolean;
  autoRefresh: boolean;
  onRefresh: () => void;
  onAutoRefreshToggle: (checked: boolean) => void;
  onCreateProduct: () => void;
  onRehydrate: () => void;
}

function TopNavBar({
  onCreateProduct,
  onRehydrate,
}: {
  onCreateProduct: () => void;
  onRehydrate: () => void;
}) {
  return (
    <div
      className="card top-nav-bar"
      style={{
        margin: "0 0 24px 0",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        className="logo"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "20px",
          fontWeight: "bold",
          color: "var(--text)",
        }}
      >
        <span style={{ fontSize: "24px" }}>⚡</span> FlashSale Admin
      </div>

      <div className="nav-actions" style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={onCreateProduct}
          style={{ background: "var(--green)", color: "#000" }}
        >
          + Create Product
        </button>
        <button
          onClick={onRehydrate}
          style={{ background: "var(--orange)", color: "#000" }}
        >
          🔄 Rehydrate DB
        </button>
      </div>
    </div>
  );
}

export function DashboardHeader({
  isConnected,
  timestamp,
  isFetching,
  autoRefresh,
  onRefresh,
  onAutoRefreshToggle,
  onCreateProduct,
  onRehydrate,
}: HeaderProps) {
  return (
    <header>
      <TopNavBar onCreateProduct={onCreateProduct} onRehydrate={onRehydrate} />

      <div className="header-row">
        <div>
          <h1>
            <span
              className={`status-dot ${isConnected ? "connected" : ""}`}
            ></span>
            Live Ops Dashboard
          </h1>
          <p>
            Last Updated:{" "}
            <span id="last-updated">
              {timestamp
                ? new Date(timestamp).toLocaleTimeString()
                : "Waiting for data..."}
            </span>
          </p>
        </div>

        <div className="controls">
          <button onClick={onRefresh} disabled={!isConnected || isFetching}>
            {isFetching ? "Fetching..." : "Fetch Live Data"}
          </button>
          <label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshToggle(e.target.checked)}
            />{" "}
            Auto-Refresh (5s)
          </label>
        </div>
      </div>
    </header>
  );
}
