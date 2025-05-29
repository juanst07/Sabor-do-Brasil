using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Adicione seus DbSets aqui, por exemplo:
    // public DbSet<Usuario> Usuarios { get; set; }
}