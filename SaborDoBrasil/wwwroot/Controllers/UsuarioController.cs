using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly AppDbContext _context;
    public UsuarioController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("registrar")]
    public async Task<IActionResult> Registrar([FromBody] Usuario usuario)
    {
        // Verifica se já existe usuário com o mesmo e-mail
        if (_context.Usuarios.Any(u => u.Email == usuario.Email))
            return BadRequest("E-mail já cadastrado!");

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return Ok(usuario);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] Usuario usuario)
    {
        var user = _context.Usuarios.FirstOrDefault(u => u.Email == usuario.Email && u.Senha == usuario.Senha);
        if (user == null)
            return Unauthorized("E-mail ou senha inválidos!");
        return Ok(user);
    }
}