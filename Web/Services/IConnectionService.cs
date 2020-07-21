using System.Collections.Generic;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface IConnectionService
    {
        Task CreateConnectionAsync(int userId, string username, string connectionId);
        Task DeleteConnectionAsync(int userId, string username, string connectionId);
        Task<IEnumerable<string>> GetConnectionIdsByUserIdAsync(int userId);
    }
}
