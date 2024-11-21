import { apiRequest } from "./apiService";

export const generateGameLink = async (): Promise<{
  game_id: string;
  link: string;
}> => {
  const url = "http://localhost:8080/api/generate-link";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return apiRequest<{ game_id: string; link: string }>(url, options);
};
