using System.Collections.Generic;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public interface IContactService
    {
        Task<UserContact> CreateContactAsync(int userId, int contactId);
        Task<bool> DeleteContactAsync(int userId, int contactId);
        Task<IEnumerable<UserContact>> GetContactsByUserIdAsync(int userId);
    }
}
