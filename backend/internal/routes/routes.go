package routes

import (
	"example.com/chess/internal/handlers"
	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router) {
	// REST API route
	router.HandleFunc("/api/generate-link", handlers.GenerateLink).Methods("POST")

	// WebSocket route
	router.HandleFunc("/ws", handlers.WebSocketHandler)
}
