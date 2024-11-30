package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/rs/xid"
)

type Room struct {
	Players []*websocket.Conn
	Mutex   sync.Mutex
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type GameResponse struct {
	GameID string `json:"game_id"`
	Link   string `json:"link"`
}

func GenerateLink(w http.ResponseWriter, r *http.Request) {
	gameID := xid.New().String()

	link := fmt.Sprintf("http://localhost:8080/play/%s", gameID)

	response := GameResponse{
		GameID: gameID,
		Link:   link,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

var rooms = make(map[string]*Room)

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not upgrade to WebSocket", http.StatusBadRequest)
		return
	}

	// Retrieve the room ID from the query parameters
	roomID := r.URL.Query().Get("room")
	if roomID == "" {
		conn.WriteMessage(websocket.TextMessage, []byte("Room ID is required"))
		conn.Close()
		return
	}

	// Find or create the room
	room, exists := rooms[roomID]
	if !exists {
		room = &Room{Players: []*websocket.Conn{}, Mutex: sync.Mutex{}}
		rooms[roomID] = room
	}

	// Add the player to the room
	room.Mutex.Lock()
	if len(room.Players) >= 2 {
		room.Mutex.Unlock()
		conn.WriteMessage(websocket.TextMessage, []byte("Room is full"))
		conn.Close()
		return
	}
	room.Players = append(room.Players, conn)
	room.Mutex.Unlock()

	// Notify players in the room
	for _, player := range room.Players {
		player.WriteMessage(websocket.TextMessage, []byte(fmt.Sprintf("Player joined the room: %d/2 players connected", len(room.Players))))
	}

	// Handle incoming messages
	go func() {
		defer func() {
			room.Mutex.Lock()
			for i, player := range room.Players {
				if player == conn {
					room.Players = append(room.Players[:i], room.Players[i+1:]...)
					break
				}
			}
			room.Mutex.Unlock()
			conn.Close()
		}()

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("Error reading message:", err)
				break
			}

			// Broadcast the message to the other player
			room.Mutex.Lock()
			for _, player := range room.Players {
				if player != conn {
					player.WriteMessage(websocket.TextMessage, message)
				}
			}
			room.Mutex.Unlock()
		}
	}()
}
