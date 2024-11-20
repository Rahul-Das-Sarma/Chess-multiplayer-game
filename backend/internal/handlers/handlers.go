package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/rs/xid"
)

type GameResponse struct {
	GameID string `json:"game_id"`
	Link   string `json:"link"`
}

func GenerateLink(w http.ResponseWriter, r *http.Request) {
	gameID := xid.New().String()

	// sharable link
	link := fmt.Sprintf("http://localhost:8080/play/%s", gameID)

	response := GameResponse{
		GameID: gameID,
		Link:   link,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
