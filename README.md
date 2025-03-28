## Live Deployment (Example)


*  ** Live Link (https://supply-chain-dapp-y3if.vercel.app/):**

    ```
    [Live Application](https://supply-chain-dapp-y3if.vercel.app/)  
    ```

# Supply Chain Tracker - Decentralized Application

This project is a decentralized supply chain tracking application built using Next.js for the frontend and Hardhat for smart contract development and deployment.  It leverages blockchain technology to provide transparency and immutability to the supply chain process.

## Project Overview

This application allows authorized parties (e.g., manufacturer, distributor, retailer, consumer) to track the journey of a product through the supply chain.  Each step in the process is recorded on the blockchain, making the information tamper-proof and easily verifiable.

## Technologies Used

*   **Frontend:** Next.js (React Framework)
*   **Smart Contracts:** Solidity
*   **Development Environment:** Hardhat
*   **Blockchain:** Ethereum (or compatible EVM chain - can be configured in Hardhat)

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (Version 16 or later recommended) - [https://nodejs.org/](https://nodejs.org/)
*   **npm or yarn:** (npm comes with Node.js, yarn can be installed globally: `npm install -g yarn`)
*   **Metamask:** (Browser extension for interacting with blockchain) - [https://metamask.io/](https://metamask.io/)
*   **Git:** (For version control) - [https://git-scm.com/](https://git-scm.com/)

## Setup and Installation

1.  **Clone the repository:**

    ```bash
    git clone <https://github.com/gaurisonawane07/Supply_chain_Dapp.git>
    cd <YOUR_REPOSITORY_DIRECTORY>
    ```

2.  **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install  # or yarn install
    cd ..
    ```

3.  **Install smart contract dependencies:**

    ```bash
    npm install # or yarn install
    ```

4.  **Compile Smart Contracts:**

    ```bash
    npx hardhat compile
    ```

5.  **Deploy Smart Contracts:**

    *   **Configure Network:**  Modify the `hardhat.config.js` file to configure the network you want to deploy to (e.g., Ganache, Sepolia, Goerli).
    *   **Run Deployment Script:**

        ```bash
        npx hardhat run scripts/deploy.js --network <NETWORK_NAME>
        ```
        Replace `<NETWORK_NAME>` with the name of the network you configured in `hardhat.config.js` (e.g., `sepolia`, `localhost`).  Note the deployed contract address.  You will need this for the frontend.

6.  **Configure Frontend:**

    *   Open the `frontend/.env.local` file and add the following environment variables:

        ```
        NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_CONTRACT_ADDRESS>  # Replace with the deployed contract address
        NEXT_PUBLIC_NETWORK_ID=<YOUR_NETWORK_ID>          # Replace with the chain ID of the network (e.g., 11155111 for Sepolia)
        ```
        If the file does not exist, create it.

## Running the Application

1.  **Start the Frontend Development Server:**

    ```bash
    cd frontend
    npm run dev  # or yarn dev
    cd ..
    ```

    This will start the Next.js development server, typically at `http://localhost:3000`.

## Usage

1.  **Connect to Metamask:** Open your Metamask extension and connect to the configured network.
2.  **Interact with the Application:** Navigate to `http://localhost:3000` in your browser. You should be able to:
    *   Add new products to the supply chain.
    *   Update the location and status of products.
    *   View the history of a product's journey.
    *   Note: Make sure your Metamask account has enough ETH (or the native token of the network you're using) to pay for transaction fees.



    **Important Note:** To deploy this to a live environment, you'll need to:

    *   Configure your hosting provider (Vercel/Netlify/AWS).
    *   Update the environment variables in your deployed environment with the correct contract address and network ID.
    *   Ensure your Metamask is configured to connect to the correct network.

## Smart Contract Details

The `contracts/SupplyChain.sol` contract handles the core logic for tracking products.  It defines:

*   **Data Structures:**  Structures for storing product information and tracking events.
*   **Functions:** Functions for adding products, updating product status, and retrieving product history.
*   **Access Control:**  Mechanisms to control who can perform certain actions (e.g., only the manufacturer can add a product).

## Potential Improvements

*   **Enhanced Security:** Auditing the smart contract for vulnerabilities.
*   **User Interface Improvements:**  Creating a more user-friendly and intuitive interface.
*   **Integration with IoT Devices:** Connecting the application to IoT devices for real-time tracking.
*   **Scalability Solutions:** Exploring layer-2 scaling solutions to reduce transaction costs.
*   **Role-Based Access Control:** Implementing more granular role-based access control.
*   **Add Tests:** Create thorough tests of the smart contracts.

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

[Specify the License - e.g., MIT License]