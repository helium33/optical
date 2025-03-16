import { create } from "zustand";

const UseVoucherStore = create((set) => ({
  lensData: null,
  productData: null,
  price: 0,
  name: "",
  finalPrice: 0,
  discount: 0,
  paymentMethod: "",
  userName: "",    // Store User Name
  userEmail: "",   // Store User Email

  // Set Lens Data
  setLensData: (data) =>
    set({
      lensData: data,
      price: data.price,
      name: data.name,
      finalPrice: data.price,
    }),

  // Set Product Data
  setProductData: (data) =>
    set({
      productData: data,
      price: data.price,
      name: data.name,
      finalPrice: data.price,
    }),

  // Set Payment Method
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  // Set Discount and Calculate Final Price
  setDiscount: (discount) =>
    set((state) => ({ discount, finalPrice: state.price - discount })),

  // Set User Details (for voucher)
  setUserDetails: (name, email) =>
    set({
      userName: name,
      userEmail: email,
    }),
}));

export default UseVoucherStore;
