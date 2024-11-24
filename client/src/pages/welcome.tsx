import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/modal";
import { generateGameLinkConfig } from "../services/gameService";
import useMutation from "../hooks/useMutation";
import { AiFillCopy } from "react-icons/ai";
type PostResponse = {
  game_id: string;
  link: string;
};

const WelcomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Use the custom mutation hook
  const { data, loading, error, mutate } = useMutation<PostResponse>(
    generateGameLinkConfig
  );

  const openModal = () => {
    setIsModalOpen(true);
    mutate(); // Trigger the API call when opening the modal
  };

  const closeModal = () => setIsModalOpen(false);

  const startGame = () => {
    if (data?.link) {
      closeModal();
      // Navigate to the game page using the generated link
      navigate(`/play/${data.game_id}`);
    } else {
      console.error("Game link not available");
    }
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
        disabled={loading} // Disable button while loading
      >
        {loading ? "Loading..." : "Learn More"}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Welcome to the Chess Game!"
        content={
          <>
            {loading ? (
              <p>Generating game link...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : data ? (
              <>
                <p>
                  Your game link is ready! Share this with your friends to join:
                </p>
                <div className="flex items-center justify-center p-2 bg-slate-100 w-[500px] mt-4">
                  <p className="text-blue-500 mt-2 text-sm">{data.link}</p>
                  <div className="ml-4">
                    <AiFillCopy size={20} />
                  </div>
                </div>
              </>
            ) : (
              <p>
                This is a multiplayer chess game where you can play with your
                friends. You can create an invite link to share with others.
                Have fun!
              </p>
            )}
            <div className="mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={startGame}
                disabled={!data || loading} // Disable button if data is not available
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
