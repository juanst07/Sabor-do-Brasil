using Microsoft.EntityFrameworkCore;
using Sabor_Do_Brasil.Models;

namespace Sabor_Do_Brasil
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Defina suas tabelas como DbSets
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurações adicionais do modelo podem ser feitas aqui
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Nickname).IsRequired().HasMaxLength(50);
                entity.HasIndex(e => e.Nickname).IsUnique();
                entity.Property(e => e.Senha).IsRequired().HasMaxLength(255);
            });
        }
    }
}