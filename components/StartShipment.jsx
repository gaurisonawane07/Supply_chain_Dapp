"use client";
import { useState } from "react";
import { Str1 } from "./page";

export default ({ startModal, setStartModal, startShipment, onShipmentAction }) => {
  const [shipmentData, setShipmentData] = useState({
    receiver: "",
    index: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStartShipment = async () => {
    if (!shipmentData.receiver || !shipmentData.index) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await startShipment(shipmentData); 
      setStartModal(false);
      setShipmentData({ receiver: "", index: "" });
      onShipmentAction(); 
    } catch (err) {
      console.error("Shipment failed:", err);
      setError("Failed to start shipment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return startModal ? (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-40"
        onClick={() => setStartModal(false)}
      ></div>
      <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
          <div className="flex justify-end">
            <button
              className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
              onClick={() => setStartModal(false)}
            >
              <Str1 />
            </button>
          </div>
          <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
            <h4 className="text-lg font-medium text-gray-800">
              Start The Shipping
            </h4>

            {error && <p className="text-red-500">{error}</p>}

            <form>
              <div className="relative mt-3">
                <input
                  type="text"
                  name="receiver"
                  placeholder="Receiver"
                  value={shipmentData.receiver}
                  onChange={handleInputChange}
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  aria-label="Receiver"
                />
              </div>
              <div className="relative mt-3">
                <input
                  type="text"
                  name="index"
                  placeholder="Index"
                  value={shipmentData.index}
                  onChange={handleInputChange}
                  className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-500 shadow-sm rounded-lg"
                  aria-label="Index"
                />
              </div>

              <button
                type="button" // Important: prevent form submission
                onClick={handleStartShipment}
                disabled={isLoading}
                className={`block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Loading..." : "Start Shipment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};