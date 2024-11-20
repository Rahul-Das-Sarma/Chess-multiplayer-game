package routes

import (
	"example.com/chess/internal/handlers"
	"github.com/gorilla/mux"
)

func RegisterRoutes(router *mux.Router) {
	router.HandleFunc("/api/generate-link", handlers.GenerateLink).Methods("POST")
}
