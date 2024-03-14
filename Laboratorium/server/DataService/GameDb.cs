namespace server.DataService
{
    public class GameDb
    {
        private readonly LinkedList<Game> _games = new LinkedList<Game>();

        public Game AddPlayer(string username)
        {
            if (_games.Count == 0 || _games.First().Username2 != null)
            {
                Game newGame = new Game(username);
                _games.AddFirst(newGame);
                return newGame;
            }
            Game openGame = _games.First();
            openGame.StartGame(username);
            return openGame;
        }

        public Game? GetGameByUsername(string username)
        {
            foreach (var game in _games)
            {
                if (game.Username1 == username || game.Username2 == username)
                {
                    return game;
                }
            }
            return null;
        }
    }
}
