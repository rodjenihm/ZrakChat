using Dapper;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Web.Entities;
using Web.Helpers;

namespace Web.Services
{

    public class ContactService : IContactService
    {
        private readonly ConnectionString connectionString;

        public ContactService(ConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public async Task<UserContact> CreateContactAsync(int userId, int contactId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            return (await connection.QueryAsync<UserContact>("uspCreateContact @UserId, @ContactId", new { UserId = userId, ContactId = contactId }))
                .FirstOrDefault();
        }

        public async Task<bool> DeleteContactAsync(int userId, int contactId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            await connection.ExecuteAsync("uspDeleteContact @UserId, @ContactId", new { UserId = userId, ContactId = contactId });
            return true;
        }

        public async Task<IEnumerable<UserContact>> GetContactsByUserIdAsync(int userId)
        {
            using var connection = new SqlConnection(connectionString.Value);
            var userContacts = await connection.QueryAsync<UserContact>
                ("uspGetContactsByUserId @UserId", new { UserId = userId });
            return userContacts;
        }
    }
}
