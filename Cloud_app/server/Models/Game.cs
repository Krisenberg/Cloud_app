using Microsoft.Extensions.Primitives;

namespace server.Models
{
    public enum GameState
    {
        Queued = 0,
        Started = 1,
        Finished = 2,
        Aborted = 3,
        Terminated = 4
    }

    public class Game
    {
        public Guid GameID { get; set; }
        public string? Username1 { get; set; }
        public string? Username2 { get; set; }
        public string? Winner { get; set; }
        public Dictionary<int, string?> BoardState { get; set; }
        public GameState GameState { get; set; }

        public Game(string username1)
        {
            GameID = Guid.NewGuid();
            Username1 = username1;
            Username2 = null;
            Winner = null;
            BoardState = new Dictionary<int, string?>();
            for (int i = 0; i < 9; i++)
            {
                BoardState.Add(i, null);
            }
            GameState = GameState.Queued;
        }

        public void StartGame(string username2)
        {
            Username2 = username2;
            GameState = GameState.Started;
        }

        private bool CheckRow(string user, int index)
        {
            int counter = 0;

            while (counter < 3)
            {
                if (BoardState[index + counter] == null || BoardState[index + counter] != user)
                    return false;
                counter++;
            }

            return true;
        }

        private bool CheckColumn(string user, int index)
        {
            int counter = 0;

            while (counter < 3)
            {
                if (BoardState[index + (counter * 3)] == null || BoardState[index + (counter * 3)] != user)
                    return false;
                counter++;
            }

            return true;
        }

        private bool CheckDiagonalLeft(string user, int index)
        {
            int counter = 0;

            while (counter < 3)
            {
                if (BoardState[index + (counter * 4)] == null || BoardState[index + (counter * 4)] != user)
                    return false;
                counter++;
            }

            return true;
        }

        private bool CheckDiagonalRight(string user, int index)
        {
            int counter = 0;

            while (counter < 3)
            {
                if ( BoardState[index + (counter * 2)] == null || BoardState[index + (counter * 2)] != user)
                    return false;
                counter++;
            }

            return true;
        }

        public bool CheckBoardForTheWin(string user)
        {
            for (int i = 0; i < 3; i++)
            {
                int row_index = (i * 3);
                if (CheckRow(user, row_index))
                    return true;
                if (CheckColumn(user, i))
                    return true;
            }
            if (CheckDiagonalLeft(user,0))
                return true;
            if (CheckDiagonalRight(user,2))
                return true;
            return false;
        }

        public bool CheckBoardForDraw()
        {
            foreach (var kvp in BoardState)
            {
                if (kvp.Value == null)
                    return false;
            }
            return true;
        }

        public void SetMark(int movePosition, string user)
        {
            if (GameState == GameState.Started && movePosition >= 0 && movePosition < BoardState.Count)
            {
                if (BoardState[movePosition] == null)
                {
                    BoardState[movePosition] = user;
                    bool winCheckResult = CheckBoardForTheWin(user);
                    if (winCheckResult)
                    {
                        Winner = user;
                        GameState = GameState.Finished;
                    }
                    if (CheckBoardForDraw())
                    {
                        GameState = GameState.Finished;
                    }
                }
            }
            else
            {
                GameState = GameState.Terminated;
            }
        }

        public GameState SetMoveMark(int movePosition, string user)
        {
            SetMark(movePosition, user);
            return GameState;
        }
    }
}
