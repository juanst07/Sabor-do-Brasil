using System.ComponentModel.DataAnnotations;

namespace Sabor_Do_Brasil.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        
        [Required]
        public string Nome { get; set; }
        
        [Required, EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Nickname { get; set; }
        
        [Required]
        public string Senha { get; set; }
    }
}