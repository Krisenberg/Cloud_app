using Microsoft.AspNetCore.SignalR;
using server.DataService;
using server.Models;

namespace server.Hubs
{
    public class GameHub : Hub
    {
        private readonly GameDb _gameDb;

        public GameHub(GameDb gameDb) => _gameDb = gameDb;

        public async Task JoinGame(string username)
        {
            Game joinedGame = _gameDb.AddPlayer(username);
            await Groups.AddToGroupAsync(Context.ConnectionId, joinedGame.GameID.ToString());

            if (joinedGame != null && joinedGame.GameState == GameState.Started)
            {
                await Clients.Group(joinedGame.GameID.ToString()).SendAsync("JoinGame", true, joinedGame.Username1, joinedGame.Username2, $"{username} has joined [{joinedGame.GameID.ToString()}]. Game - {joinedGame.Username1} vs {joinedGame.Username2}");
            }
            else
            {
                await Clients.Group(joinedGame.GameID.ToString()).SendAsync("JoinGame", false, joinedGame.Username1, joinedGame.Username2, $"{username} has joined [{joinedGame.GameID.ToString()}]. Game - {joinedGame.Username1} vs {joinedGame.Username2}");
            }
        }

        public async Task SetMove(int movePosition, string username)
        {
            Game? userGame = _gameDb.GetGameByUsername(username);
            if (userGame != null)
            {
                GameState updatedGameState = userGame!.SetMoveMark(movePosition, username);
                if (updatedGameState == GameState.Started)
                {
                    await Clients.Group(userGame.GameID.ToString()).SendAsync("SetMove", movePosition);
                }
                if (updatedGameState == GameState.Finished)
                {
                    await Clients.Group(userGame.GameID.ToString()).SendAsync("FinishGame", userGame!.Winner);
                }
            }
        }
    }
}
