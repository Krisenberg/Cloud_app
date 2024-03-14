namespace server.Models
{
    public class UserConnection
    {
        public string Username {  get; set; }
        public Guid GameID { get; set; }

        public UserConnection(string username)
        {
            Username = username;
            GameID = Guid.NewGuid();
        }
    }
}
