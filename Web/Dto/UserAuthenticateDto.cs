using System.ComponentModel.DataAnnotations;

namespace Web.Dto
{
    public class UserAuthenticateDto
    {
        [Required]
        [MinLength(5)]
        [MaxLength(30)]
        [Display(Name = "Username")]
        public string Username { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(255)]
        [Display(Name = "Password")]
        public string Password { get; set; }
    }
}
