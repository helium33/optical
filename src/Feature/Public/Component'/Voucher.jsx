import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UseVoucherStore from "../../../Store/UseVoucherStore";

const VoucherForm = () => {
  const navigate = useNavigate();
  const { price, name, finalPrice, paymentMethod, setPaymentMethod, setDiscount, setUserDetails } = UseVoucherStore(
    (state) => state
  );

  const [voucherData, setVoucherData] = useState({
    id: Date.now(),
    name: "", // Customer name
    email: "",
    paymentMethod: paymentMethod || "",
    discount: 0,
    finalPrice: finalPrice || 0,
  });

  React.useEffect(() => {
    setVoucherData((prevData) => ({
      ...prevData,
      finalPrice: finalPrice || price || 0,
    }));
  }, [finalPrice, price]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVoucherData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "discount") {
      const discount = parseFloat(value) || 0;
      setDiscount (discount);
    }

    if (name === "paymentMethod") {
      setPaymentMethod(value);
      setVoucherData((prevData) => ({ ...prevData, paymentMethod: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Voucher Submitted", voucherData);

    // Set customer name and email in UseVoucherStore
    setUserDetails(voucherData.name, voucherData.email);

    navigate(`/voucher/${voucherData.id}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Create Voucher</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={voucherData.name}
          onChange={handleChange}
          placeholder="Customer Name"
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={voucherData.email}
          onChange={handleChange}
          placeholder="Customer Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="productName"
          value={name}
          disabled
          placeholder="Product Name"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="number"
          name="price"
          value={price}
          disabled
          placeholder="Price"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="number"
          name="discount"
          value={voucherData.discount}
          onChange={handleChange}
          placeholder="Discount"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="finalPrice"
          value={voucherData.finalPrice}
          disabled
          placeholder="Final Price"
          className="w-full p-2 border rounded bg-gray-100"
        />
        <select
          name="paymentMethod"
          value={voucherData.paymentMethod}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Payment Method</option>
          <option value="KBZ Pay">KBZ Pay</option>
          <option value="UAB Pay">UAB Pay</option>
          <option value="Aya Pay">Aya Pay</option>
          <option value="CB Pay">CB Pay</option>
          <option value="Yoma Pay">Yoma Pay</option>
          <option value="Cash Only">Cash Only</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Voucher
        </button>
      </form>
    </div>
  );
};

export default VoucherForm;