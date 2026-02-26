import { type FlashProduct, type NormalProduct } from "../types";

export function FlashSalesList({ products }: { products: FlashProduct[] }) {
  return (
    <div className="card">
      <h2>ACTIVE FLASH SALES (Redis)</h2>
      <div id="flash-sales-container">
        {!products || products.length === 0 ? (
          <p>No active flash sales.</p>
        ) : (
          products.map((p) => (
            <p key={p.id} className="flash-item">
              [ID: {p.id}] {p.name} - Available Stock:{" "}
              <strong
                style={{
                  fontSize: "1.2em",
                  color: p.liveStock === 0 ? "red" : "inherit",
                }}
              >
                {p.liveStock}
              </strong>
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export function StandardInventoryList({
  products,
}: {
  products: NormalProduct[];
}) {
  return (
    <div className="card">
      <h2>STANDARD INVENTORY (PostgreSQL)</h2>
      <div id="normal-products-container">
        {!products || products.length === 0 ? (
          <p>No standard products.</p>
        ) : (
          products.map((p) => (
            <p key={p.id} className="normal-item">
              [ID: {p.id}] {p.name} - Available Stock: {p.availableStock}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
