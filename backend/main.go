package main

import (
	"fmt"
	"net/http"

	"example.com/chess/internal/routes"
	"github.com/gorilla/mux"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	router := mux.NewRouter()

	// Apply CORS middleware
	router.Use(corsMiddleware)

	// Initialize routes
	routes.RegisterRoutes(router)

	fmt.Println("Server running on http://localhost:8080")
	http.ListenAndServe(":8080", router)
}
