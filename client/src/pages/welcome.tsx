import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Modal from "../components/modal"; // Adjust the import path as necessary

const WelcomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const startGame = () => {
    closeModal();
    navigate("/game"); // Navigate to the game page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-transparent">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Chess Game!</h1>
      <p className="mb-6">
        Invite your friends to play and enjoy a game of chess together!
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={openModal}
      >
        Learn More
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Welcome to the Chess Game!"
        content={
          <>
            This is a multiplayer chess game where you can play with your
            friends. You can create an invite link to share with others. Have
            fun!
            <div className="mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={startGame}
              >
                Start Game
              </button>
            </div>
          </>
        }
      />
    </div>
  );
};

export default WelcomePage;
