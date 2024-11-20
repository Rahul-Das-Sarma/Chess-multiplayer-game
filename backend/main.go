package main

import (
	"fmt"
	"net/http"

	"example.com/chess/internal/routes"
	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	// Initialize routes
	routes.RegisterRoutes(router)

	fmt.Println("Server running on http://localhost:8080")
	http.ListenAndServe(":8080", router)
}
