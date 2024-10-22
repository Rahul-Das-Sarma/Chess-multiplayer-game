import ChessBoard from "./pages/multiplayer-chess";

function App() {
  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-r from-slate-500 to-slate-800">
      <ChessBoard
      // position={game.fen()} onPieceDrop={onDrop}
      />
    </div>
  );
}

export default App;
