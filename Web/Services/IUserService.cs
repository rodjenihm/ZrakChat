using System.Threading.Tasks;
using Web.Entities;

namespace Web.Services
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(User user);
        Task<bool> IsUsernameAvailableAsync(string username);
        Task<User> GetUserByUsernameAsync(string username);
    }
}
