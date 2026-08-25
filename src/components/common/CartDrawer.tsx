import React, { useState } from 'react';
import { CartItem } from '../../types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Package 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 25;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    const orderNum = `HH-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(orderNum);
    setCheckoutSuccess(true);
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="bg-[#faf9f5] w-full max-w-md h-full shadow-2xl border-l border-[#c4c7c7] flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#c4c7c7]/50 bg-[#efeeea]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#94492d]" />
            <h3 className="text-[17px] font-display font-bold text-[#1b1c1a]">
              Masterpiece Cart ({items.length})
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#e9e8e4] text-[#1b1c1a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {checkoutSuccess ? (
            <div className="p-8 text-center bg-[#efeeea]/80 rounded-2xl border border-[#c4c7c7]/60 space-y-4 my-auto">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-[20px] font-display font-bold text-[#1b1c1a]">
                Order Confirmed!
              </h4>
              <p className="text-[13px] text-[#444748]">
                Thank you for supporting Master Artisan Guilds and archival preservation.
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#c4c7c7]/50 font-mono text-[12px] text-[#94492d] font-bold">
                Reference: {orderNumber}
              </div>
              <p className="text-[11px] text-[#747878]">
                A signed Certificate of Provenance and shipment tracking will be dispatched via email.
              </p>
              <button
                onClick={() => {
                  setCheckoutSuccess(false);
                  onClose();
                }}
                className="w-full py-2.5 bg-[#94492d] text-white rounded-lg font-semibold text-[12px] tracking-wider uppercase"
              >
                Continue Browsing
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-[#747878] space-y-3">
              <Package className="w-12 h-12 mx-auto text-[#c4c7c7]" />
              <p className="text-[15px] font-medium text-[#444748]">Your archival cart is empty.</p>
              <p className="text-[12px]">Explore our certified museum replicas, monograph publications, and master bronze casts.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-[#c4c7c7]/50 shadow-2xs"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg bg-[#efeeea] shrink-0"
                  />
                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-[13px] font-bold text-[#1b1c1a] leading-snug line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-[#747878] hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#747878] truncate">{product.artisanGuild}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#c4c7c7] rounded-md bg-[#faf9f5]">
                        <button
                          onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                          className="px-2 py-0.5 text-[12px] font-bold text-[#444748] hover:bg-[#efeeea] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-[12px] font-semibold">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="px-2 py-0.5 text-[12px] font-bold text-[#444748] hover:bg-[#efeeea] cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[14px] font-display font-bold text-[#94492d]">
                        ${product.price * quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {!checkoutSuccess && items.length > 0 && (
          <div className="p-6 border-t border-[#c4c7c7]/50 bg-[#efeeea] space-y-3">
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between text-[#444748]">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#444748]">
                <span>Archival Crated Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[16px] font-display font-bold text-[#1b1c1a] pt-2 border-t border-[#c4c7c7]/40">
                <span>Total</span>
                <span className="text-[#94492d]">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#444748] bg-white p-2 rounded-lg border border-[#c4c7c7]/40">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Includes Certificate of Authenticity & Master Artisan Seal</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-[#94492d] hover:bg-[#773319] text-white rounded-xl font-semibold text-[13px] tracking-widest uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              Proceed to Archival Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
