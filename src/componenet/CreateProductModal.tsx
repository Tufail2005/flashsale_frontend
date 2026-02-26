// src/components/CreateProductModal.tsx
import React, { useState } from "react";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export function CreateProductModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "sneaker",
    isFlashSale: false,
    allocatedStock: 0,
    availableStock: 0,
    attributes: '{\n  "brand": "Nike",\n  "color": "Red"\n}',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Safely parse the JSON string back into an object for the backend
      const parsedAttributes = JSON.parse(formData.attributes);

      await onSubmit({
        name: formData.name,
        type: formData.type,
        isFlashSale: formData.isFlashSale,
        allocatedStock: Number(formData.allocatedStock),
        availableStock: Number(formData.availableStock),
        attributes: parsedAttributes,
      });
      onClose(); // Close on success
    } catch (error) {
      alert("Invalid JSON in attributes field!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ color: "var(--text)", marginTop: 0 }}>Add New Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              required
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type / Category</label>
              <input
                required
                className="form-input"
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            </div>
            <div className="form-group" style={{ justifyContent: "center" }}>
              <label
                style={{
                  cursor: "pointer",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  color: "var(--orange)",
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.isFlashSale}
                  onChange={(e) =>
                    setFormData({ ...formData, isFlashSale: e.target.checked })
                  }
                />
                ⚡ Flash Sale Item
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Allocated Stock (Total)</label>
              <input
                required
                className="form-input"
                type="number"
                min="0"
                value={formData.allocatedStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allocatedStock: parseInt(e.target.value),
                    availableStock: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>Available Stock (Live)</label>
              <input
                required
                className="form-input"
                type="number"
                min="0"
                value={formData.availableStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableStock: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Attributes (JSON)</label>
            <textarea
              className="form-input"
              rows={4}
              value={formData.attributes}
              onChange={(e) =>
                setFormData({ ...formData, attributes: e.target.value })
              }
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: "var(--green)" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
