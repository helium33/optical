import { useParams } from "react-router-dom";
import UseVoucherStore from "../../../Store/UseVoucherStore";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const VoucherDetailPage = () => {
  const { id } = useParams();
  const { price, name, finalPrice, paymentMethod, discount, userName, userEmail } = UseVoucherStore((state) => state);

  const componentRef = useRef();

  // Print handler with debugging
  const handlePrint = useReactToPrint({
    content: () => {
      console.log("Printing content:", componentRef.current);
      if (!componentRef.current) {
        console.error("No content to print: componentRef is null");
      }
      return componentRef.current;
    },
    documentTitle: `Voucher_${id}`,
    onAfterPrint: () => {
      console.log("Print completed");
      alert("Voucher has been printed or downloaded successfully!");
    },
    onPrintError: (error) => {
      console.error("Print error:", error);
      alert("Failed to print. Check console for details.");
    },
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      @media print {
        body { font-family: Arial, sans-serif; }
        .no-print { display: none; }
      }
    `,
  });

  // Fallback basic print function for testing
  const handleBasicPrint = () => {
    console.log("Attempting basic window.print()");
    window.print();
  };

  const shopDetails = {
    name: "Visionary Optics",
    address: "123 Eye Street, Optic City, OC 45678",
    phone: "(555) 123-4567",
    email: "support@visionaryoptics.com",
  };

  const invoiceNumber = `INV-${id}-${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div
        ref={componentRef}
        className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 border border-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{shopDetails.name}</h1>
            <p className="text-sm text-gray-600">{shopDetails.address}</p>
            <p className="text-sm text-gray-600">Phone: {shopDetails.phone}</p>
            <p className="text-sm text-gray-600">Email: {shopDetails.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold text-indigo-600">Voucher Invoice</h2>
            <p className="text-sm text-gray-600">Invoice #: {invoiceNumber}</p>
            <p className="text-sm text-gray-600">Voucher ID: {id}</p>
            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <p><strong>Name:</strong> {userName || "Not Provided"}</p>
            <p><strong>Email:</strong> {userEmail || "Not Provided"}</p>
          </div>
        </div>

        {/* Purchase Details */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Purchase Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong>Product:</strong> {name || "N/A"}</p>
              <p><strong>Original Price:</strong> ${price ? price.toFixed(2) : "0.00"}</p>
              <p><strong>Discount:</strong> ${discount ? discount.toFixed(2) : "0.00"}</p>
              <p><strong>Final Price:</strong> ${finalPrice ? finalPrice.toFixed(2) : "0.00"}</p>
              <p><strong>Payment Method:</strong> {paymentMethod || "Not Selected"}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-6">
          <div className="bg-indigo-100 p-4 rounded-lg text-right">
            <p className="text-lg font-semibold text-indigo-800">
              Total Amount: <span className="text-2xl">${finalPrice ? finalPrice.toFixed(2) : "0.00"}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center border-t pt-4">
          <h3 className="text-2xl font-bold text-indigo-600">Thank You!</h3>
          <p className="text-sm text-gray-600">We appreciate your business with {shopDetails.name}.</p>
          <p className="text-sm text-gray-600">For any inquiries, contact us at {shopDetails.email}.</p>
        </div>
      </div>

      {/* Print/Download Buttons */}
      <div className="mt-6 text-center no-print flex gap-4">
        <button
          onClick={() => {
            console.log("Print button clicked");
            handlePrint();
          }}
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          Print/Download Voucher (react-to-print)
        </button>
        <button
          onClick={handleBasicPrint}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          Basic Print (window.print)
        </button>
      </div>
    </div>
  );
};

export default VoucherDetailPage;