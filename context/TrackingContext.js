// context/TrackingContext.js
"use client";
import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import tracking from "./Tracking.json";

const ContractAddress = "0x3ebf1252304383978299Aa0eef95b3448680fA20";
const ContractABI = tracking.abi;

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cache provider, signer, contract — created ONCE on connect, reused everywhere
  const providerRef = useRef(null);
  const signerRef = useRef(null);
  const contractRef = useRef(null);

  // Build contract once and cache it
  const getContract = async (write = false) => {
    if (contractRef.current && !write) return contractRef.current;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    providerRef.current = provider;
    signerRef.current = signer;
    contractRef.current = new ethers.Contract(ContractAddress, ContractABI, signer);
    return contractRef.current;
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const contract = await getContract();
      const address = await signerRef.current.getAddress();
      setCurrentUser(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      const web3Modal = new Web3Modal();
      if (web3Modal.cachedProvider) {
        await connectWallet();
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const createShipment = async (items) => {
    setIsLoading(true);
    try {
      const contract = await getContract(true);
      const { receiver, pickupTime, distance, price } = items;
      const tx = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.parseEther(price.toString()),
        { value: ethers.parseEther(price.toString()) }
      );
      await tx.wait();
      await fetchShipments();
    } catch (error) {
      console.error("Error creating shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getShipmentsCount = async () => {
    try {
      if (!currentUser) return 0;
      const contract = await getContract();
      const count = await contract.getShipmentsCount(currentUser);
      return Number(count);
    } catch (error) {
      console.error("Error getting shipment count:", error);
      return 0;
    }
  };

  const getAllShipment = async () => {
    setIsLoading(true);
    try {
      if (!currentUser) return [];
      const contract = await getContract();
      const count = await contract.getShipmentsCount(currentUser);
      const total = Number(count);
      if (total === 0) return [];

      // Fetch ALL shipments in PARALLEL instead of one by one
      const promises = Array.from({ length: total }, (_, i) =>
        contract.getShipment(currentUser, i)
      );
      const results = await Promise.all(promises);

      return results.map((shipment) => ({
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: Number(shipment[2]),
        deliveryTime: Number(shipment[3]),
        distance: Number(shipment[4]),
        price: ethers.formatEther(shipment[5]),
        status: Number(shipment[6]),
        isPaid: shipment[7],
      }));
    } catch (error) {
      console.error("Error getting shipments:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShipments = async () => {
    if (currentUser) {
      const fetched = await getAllShipment();
      setShipments(fetched);
    }
  };

  const completeShipment = async ({ receiver, index }) => {
    setIsLoading(true);
    try {
      const contract = await getContract(true);
      const tx = await contract.completeShipment(currentUser, receiver, Number(index), {
        gasLimit: 300000,
      });
      await tx.wait();
      await fetchShipments();
    } catch (error) {
      console.error("Error completing shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getShipment = async (index) => {
    try {
      if (!currentUser) return null;
      const contract = await getContract();
      const shipment = await contract.getShipment(currentUser, index);
      return {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: Number(shipment[2]),
        deliveryTime: Number(shipment[3]),
        distance: Number(shipment[4]),
        price: ethers.formatEther(shipment[5]),
        status: Number(shipment[6]),
        isPaid: shipment[7],
      };
    } catch (error) {
      console.error("Error getting shipment:", error);
      return null;
    }
  };

  const startShipment = async ({ receiver, index }) => {
    setIsLoading(true);
    try {
      const contract = await getContract(true);
      const tx = await contract.startShipment(currentUser, receiver, Number(index));
      await tx.wait();
      await fetchShipments();
    } catch (error) {
      console.error("Error starting shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const listenForShipmentEvents = async () => {
    try {
      const contract = await getContract();
      contract.on("ShipmentInTransit", () => fetchShipments());
      contract.on("ShipmentDelivered", () => fetchShipments());
      contract.on("ShipmentPaid", () => fetchShipments());
    } catch (error) {
      console.error("Error listening for shipment events:", error);
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchShipments();
      listenForShipmentEvents();
    }
  }, [currentUser]);

  return (
    <TrackingContext.Provider
      value={{
        connectWallet,
        currentUser,
        createShipment,
        getAllShipment,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentsCount,
        shipments,
        isLoading,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => useContext(TrackingContext);