// context/TrackingContext.js
"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import tracking from "./Tracking.json";

const ContractAddress = "0x3ebf1252304383978299Aa0eef95b3448680fA20";
const ContractABI = tracking.abi;

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
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
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      const { receiver, pickupTime, distance, price } = items;
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.parseEther(price.toString()),
        { value: ethers.parseEther(price.toString()) }
      );
      await createItem.wait();
      fetchShipments();
    } catch (error) {
      console.error("Error creating shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getShipmentsCount = async () => {
    try {
      if (!currentUser) {
        console.warn("currentUser is null in getShipmentsCount");
        return 0;
      }
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);
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
      if (!currentUser) {
        console.warn("currentUser is null in getAllShipment");
        return [];
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // DEBUG: log chain + addresses to verify correct network
      const network = await provider.getNetwork();
      const signerAddr = await signer.getAddress();
      console.log("=== DEBUG ===");
      console.log("Chain ID:", network.chainId.toString());  // Sepolia = 11155111
      console.log("Signer Address:", signerAddr);
      console.log("Contract Address:", ContractAddress);
      console.log("currentUser:", currentUser);
      console.log("=============");

      const count = await contract.getShipmentsCount(currentUser);

      const fetchedShipments = [];

      if (Number(count) > 0) {
        for (let i = 0; i < Number(count); i++) {
          const shipment = await contract.getShipment(currentUser, i);
          fetchedShipments.push({
            sender: shipment[0],
            receiver: shipment[1],
            pickupTime: Number(shipment[2]),
            deliveryTime: Number(shipment[3]),
            distance: Number(shipment[4]),
            price: ethers.formatEther(shipment[5]),
            status: Number(shipment[6]),
            isPaid: shipment[7],
          });
        }
      }

      return fetchedShipments;
    } catch (error) {
      console.error("Error getting shipments:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShipments = async () => {
    if (currentUser) {
      const fetchedShipments = await getAllShipment();
      setShipments(fetchedShipments);
    }
  };

  const completeShipment = async ({ receiver, index }) => {
    setIsLoading(true);
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Bug 2 Fix: await tx.wait() so the block is mined before fetching updated state
      const tx = await contract.completeShipment(currentUser, receiver, Number(index), {
        gasLimit: 300000,
      });
      await tx.wait();
      fetchShipments();
    } catch (error) {
      console.error("Error completing shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getShipment = async (index) => {
    try {
      if (!currentUser) {
        console.warn("currentUser is null in getShipment");
        return null;
      }
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

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
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Bug 1 Fix: await tx.wait() so the block is mined before fetching updated status
      const tx = await contract.startShipment(currentUser, receiver, Number(index));
      await tx.wait();
      fetchShipments();
    } catch (error) {
      console.error("Error starting shipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const listenForShipmentEvents = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      const contract = fetchContract(signer);

      // Bug 9 Fix: Also listen for ShipmentInTransit event for real-time UI updates
      contract.on("ShipmentInTransit", (sender, receiver, pickupTime, status, event) => {
        console.log("ShipmentInTransit event received:", { sender, receiver, pickupTime, status });
        fetchShipments();
      });

      contract.on("ShipmentDelivered", (sender, receiver, deliveryTime, status, event) => {
        console.log("ShipmentDelivered event received:", { sender, receiver, deliveryTime, status });
        fetchShipments();
      });

      contract.on("ShipmentPaid", (sender, receiver, amount, event) => {
        console.log("ShipmentPaid event received:", { sender, receiver, amount });
        fetchShipments();
      });
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