import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./Dashboard.css";
import { type DashboardData } from "./types";
import { DashboardHeader } from "./componenet/DashboardHeader";
import { SystemHealth } from "./componenet/SystemHealth";
import {
  FlashSalesList,
  StandardInventoryList,
} from "./componenet/InventoryViews";
import { CreateProductModal } from "./componenet/CreateProductModal";

const API_URL = import.meta.env?.DEV
  ? "http://127.0.0.1:8787"
  : "https://flashsalebackend.gudduahmedansari786.workers.dev";

export default function Dashboard() {
  // --- STATE ---
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // --- REFS ---
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const autoRefreshTimerRef = useRef<number | null>(null);
  const reconnectDelay = useRef(5000);

  // --- API ACTIONS ---

  // POST to your existing /seed-catalog endpoint
  const handleCreateProduct = async (productData: any) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/admin/seed-catalog`,
        productData
      );
      alert(`Success: ${res.data.msg}`);
      requestData(); // Instantly refresh the dashboard WebSocket to show the new item
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.msg || "Failed to create product");
    }
  };

  const handleRehydrate = async () => {
    // Adding a confirmation so you don't accidentally click it during a live sale!
    if (
      !window.confirm(
        "Are you sure you want to run the Rehydration protocol? This will overwrite Redis inventory."
      )
    )
      return;

    try {
      const res = await axios.post(`${API_URL}/api/v1/admin/rehydrate`);
      alert(res.data.msg);
      requestData(); // Refresh the dashboard to see the synced numbers
    } catch (error: any) {
      console.error(error);
      alert("Critical Failure during rehydration.");
    }
  };

  // --- ACTIONS ---
  const requestData = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "refresh" }));
    }
  }, []);

  const handleManualRefresh = () => {
    requestData();
    setIsFetching(true);
    setTimeout(() => setIsFetching(false), 500);
  };

  // --- WEBSOCKET LIFECYCLE ---
  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

    // Auto-switch between local testing and production Worker
    // const isLocal = import.meta.env?.DEV;
    const isLocal = false;

    const WS_URL = isLocal
      ? "ws://127.0.0.1:8787/api/v1/admin/dashboard/ws"
      : "wss://flashsalebackend.gudduahmedansari786.workers.dev/api/v1/admin/dashboard/ws";

    console.log("Attempting to connect to WebSocket at:", WS_URL); // <-- Added this so you can debug!

    const socket = new WebSocket(WS_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      reconnectDelay.current = 5000; // Reset backoff
      requestData(); // Fetch initial data
    };

    socket.onmessage = (event) => {
      const parsedData: DashboardData = JSON.parse(event.data);
      if (!parsedData.error) {
        setData(parsedData);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      // Exponential backoff reconnect
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connectWebSocket();
      }, reconnectDelay.current);
      reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 10000);
    };

    socket.onerror = () => {
      socket.close(); // Force close to trigger onclose reconnect logic
    };
  }, [requestData]);

  // Connect on Mount, Cleanup on Unmount
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeoutRef.current)
        clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connectWebSocket]);

  // Handle Auto-Refresh Toggle
  useEffect(() => {
    if (autoRefresh) {
      requestData(); // Fetch immediately on check
      autoRefreshTimerRef.current = window.setInterval(requestData, 5000);
    } else {
      if (autoRefreshTimerRef.current)
        clearInterval(autoRefreshTimerRef.current);
    }

    return () => {
      if (autoRefreshTimerRef.current)
        clearInterval(autoRefreshTimerRef.current);
    };
  }, [autoRefresh, requestData]);

  // --- RENDER ---
  return (
    <div className="dashboard-wrapper">
      <DashboardHeader
        isConnected={isConnected}
        timestamp={data?.timestamp}
        isFetching={isFetching}
        autoRefresh={autoRefresh}
        onRefresh={handleManualRefresh}
        onAutoRefreshToggle={setAutoRefresh}
        onCreateProduct={() => setIsCreateModalOpen(true)}
        onRehydrate={handleRehydrate}
      />

      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProduct}
      />

      <SystemHealth
        metrics={data?.orderMetrics || []}
        dlqRescues={data?.dlqRescues || 0}
      />

      <div className="grid">
        <FlashSalesList products={data?.flashSales || []} />
        <StandardInventoryList products={data?.normalProducts || []} />
      </div>
    </div>
  );
}
