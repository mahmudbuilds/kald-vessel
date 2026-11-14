import { useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import type { FlaskEdition, FlaskSize } from '../data/products';

export interface CartItem {
  key: string;
  edition: FlaskEdition;
  size: FlaskSize;
  engraving: string;
  unitPrice: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
  onClear: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear,
}: CartDrawerProps) {
  const [checkedOut, setCheckedOut] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const freeShippingThreshold = 100;
  const shippingPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      onClear();
      setCheckedOut(false);
      onClose();
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col justify-between border-l border-[#f4f1ea]/12 bg-[#0d0d10] p-6 text-[#f4f1ea] shadow-2xl md:p-8">
        <div>
          <div className="flex items-center justify-between border-b border-[#f4f1ea]/12 pb-5">
            <div>
              <span className="block font-mono-tech text-[10px] tracking-[0.22em] text-[#d4724e] uppercase">
                YOUR RESERVATION
              </span>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase">
                Studio Bag
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              data-cursor="CLOSE"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f4f1ea]/15 transition-colors hover:border-[#f4f1ea]"
              aria-label="Close bag"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Carbon-Neutral Shipping Meter */}
          <div className="mt-5 rounded-2xl border border-[#f4f1ea]/10 bg-[#141418] p-4">
            <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.16em] uppercase">
              <span>
                {remaining === 0
                  ? 'EXPRESS CARBON-NEUTRAL SHIPPING UNLOCKED'
                  : `ADD $${remaining} FOR FREE EXPRESS SHIPPING`}
              </span>
              <span className="text-[#d4724e]">{Math.round(shippingPct)}%</span>
            </div>
            <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-[#f4f1ea]/10">
              <div
                className="h-full bg-[#d4724e] transition-all duration-500"
                style={{ width: `${shippingPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cart Items */}
        <div className="my-6 flex-1 overflow-y-auto pr-1">
          {checkedOut ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-[#d4724e]" />
              <h3 className="font-display text-2xl font-bold uppercase">
                Reservation Confirmed
              </h3>
              <p className="max-w-xs text-sm text-[#f4f1ea]/65">
                Batch 04 dispatch telemetry has been queued. Gothenburg studio
                engraving begins shortly.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="font-mono-tech text-xs tracking-[0.2em] text-[#f4f1ea]/40 uppercase">
                YOUR BAG IS EMPTY
              </span>
              <p className="max-w-xs text-sm text-[#f4f1ea]/55">
                Configure a KALD 01 Vacuum Vessel in your preferred mineral finish
                and capacity.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[#f4f1ea]/10 bg-[#141418] p-4"
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      className="mt-1 h-9 w-9 shrink-0 rounded-xl border border-white/15"
                      style={{ backgroundColor: item.edition.hex }}
                    />
                    <div>
                      <h4 className="font-display text-sm font-bold uppercase">
                        KALD 01 · {item.edition.name}
                      </h4>
                      <span className="mt-0.5 block font-mono-tech text-[10px] tracking-[0.16em] text-[#f4f1ea]/55 uppercase">
                        {item.size.label} · ETCH:{' '}
                        {item.engraving ? item.engraving : 'NONE'}
                      </span>

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, -1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f4f1ea]/15 hover:border-[#f4f1ea]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[20px] text-center font-mono-tech text-xs">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f4f1ea]/15 hover:border-[#f4f1ea]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <span className="font-mono-tech text-sm font-medium">
                      ${item.unitPrice * item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(item.key)}
                      className="text-[#f4f1ea]/40 transition-colors hover:text-[#d4724e]"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && !checkedOut && (
          <div className="border-t border-[#f4f1ea]/12 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono-tech text-xs tracking-[0.18em] text-[#f4f1ea]/60 uppercase">
                ESTIMATED TOTAL
              </span>
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                ${subtotal}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              data-cursor="ORDER"
              className="w-full rounded-full bg-[#f4f1ea] py-4 font-mono-tech text-xs font-semibold tracking-[0.22em] text-[#09090b] uppercase transition-colors hover:bg-[#d4724e]"
            >
              Complete Reservation — ${subtotal}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
