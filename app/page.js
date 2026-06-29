"use client";
import React, { useState, useEffect, useContext } from "react";
import { ClipLoader } from "react-spinners"; // Import the spinner

// INTERNAL IMPORT
import {
  Table,
  Form,
  Services,
  Profile,
  CompleteShipment,
  GetShipment,
  StartShipment,
  ShipmentCount,
} from "@/components/page";

import { TrackingContext } from "@/context/TrackingContext";

const Page = () => {
  const {
    currentUser,
    createShipment,
    getAllShipment,
    completeShipment,
    getShipment,
    startShipment,
    getShipmentsCount,
  } = useContext(TrackingContext);

  // STATE VARIABLE
  const [createShipmentModel, setCreateShipmentModel] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [completemodal, setCompleteModal] = useState(false);
  const [getModal, setGetModal] = useState(false);

  // DATA STATE VARIABLE
  const [shipmentBuffer, setShipmentBuffer] = useState([]);
  const [loading, setLoading] = useState(true);
  const BUFFER_CAPACITY = 10; 

  const fetchData = async () => {
    setLoading(true);
    try {
      const allData = await getAllShipment();
      // Bug 4 Fix: Replace buffer with fresh data instead of appending (which caused duplicates)
      setShipmentBuffer(allData);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      setShipmentBuffer([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData(); // Re-fetch whenever wallet connects or changes
    }
  }, [currentUser]); // Re-run when wallet connects

  // Function to refetch data after shipment actions
  const handleShipmentAction = async () => {
    await fetchData();
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Center vertically on the whole page
            width: "100vw", // Center horizontally on the whole page
          }}
        >
          <ClipLoader color="#36D7B7" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <Services
            setOpenProfile={setOpenProfile}
            setCompleteModal={setCompleteModal}
            setGetModal={setGetModal}
            setStartModal={setStartModal}
          />
          <Table
            setCreateShipmentModel={setCreateShipmentModel}
            allShipmentsdata={shipmentBuffer} // Use buffer data
          />
          <Form
            createShipmentModel={createShipmentModel}
            createShipment={createShipment}
            setCreateShipmentModel={setCreateShipmentModel}
            onShipmentAction={handleShipmentAction}
          />
          <Profile
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
            currentUser={currentUser}
            getShipmentsCount={getShipmentsCount}
          />
          <CompleteShipment
            completemodal={completemodal}
            setCompleteModal={setCompleteModal}
            completeShipment={completeShipment}
            onShipmentAction={handleShipmentAction}
          />
          <GetShipment
            getModal={getModal}
            getShipment={getShipment}
            getShipmentsCount={getShipmentsCount}
            currentUser={currentUser}
            setGetModal={setGetModal}
          />
          <StartShipment
            startModal={startModal}
            setStartModal={setStartModal}
            startShipment={startShipment}
            onShipmentAction={handleShipmentAction}
          />
          <ShipmentCount shipments={shipmentBuffer} />
        </>
      )}
    </>
  );
};

export default Page;