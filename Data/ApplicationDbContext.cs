using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<User>? User { get; set; }

        public DbSet<Goal>? Goal { get; set; }

        public DbSet<Expense>? Expense { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Create Indexes
            modelBuilder.Entity<User>().Property(f => f.id)
                .ValueGeneratedOnAdd();
            modelBuilder.Entity<User>().HasIndex(
                user => new { user.gid }).IsUnique(true);

            modelBuilder.Entity<Goal>().Property(g => g.id)
                            .ValueGeneratedOnAdd();
            modelBuilder.Entity<Goal>().HasIndex(
                g => new { g.uid, g.date }).IsUnique(true);

            modelBuilder.Entity<Expense>().Property(e => e.id)
            .ValueGeneratedOnAdd();
            modelBuilder.Entity<Expense>().HasIndex(
                e => new { e.uid, e.date }).IsUnique(false);
        }
    }
}