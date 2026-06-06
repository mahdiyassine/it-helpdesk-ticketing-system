using HelpDesk.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Priority> Priorities { get; set; }
    public DbSet<Status> Statuses { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, RoleName = "Admin" },
            new Role { Id = 2, RoleName = "IT Support Agent" },
            new Role { Id = 3, RoleName = "Employee" },
            new Role { Id = 4, RoleName = "Manager" }
        );

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, CategoryName = "Hardware" },
            new Category { Id = 2, CategoryName = "Software" },
            new Category { Id = 3, CategoryName = "Network" },
            new Category { Id = 4, CategoryName = "Email" },
            new Category { Id = 5, CategoryName = "Access Request" },
            new Category { Id = 6, CategoryName = "Other" }
        );

        modelBuilder.Entity<Priority>().HasData(
            new Priority { Id = 1, PriorityName = "Low" },
            new Priority { Id = 2, PriorityName = "Medium" },
            new Priority { Id = 3, PriorityName = "High" },
            new Priority { Id = 4, PriorityName = "Critical" }
        );

        modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, StatusName = "Open" },
            new Status { Id = 2, StatusName = "In Progress" },
            new Status { Id = 3, StatusName = "Pending" },
            new Status { Id = 4, StatusName = "Resolved" },
            new Status { Id = 5, StatusName = "Closed" }
        );

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Role>()
            .HasIndex(r => r.RoleName)
            .IsUnique();

        modelBuilder.Entity<Category>()
            .HasIndex(c => c.CategoryName)
            .IsUnique();

        modelBuilder.Entity<Priority>()
            .HasIndex(p => p.PriorityName)
            .IsUnique();

        modelBuilder.Entity<Status>()
            .HasIndex(s => s.StatusName)
            .IsUnique();

        modelBuilder.Entity<Ticket>()
            .HasIndex(t => t.TicketReference)
            .IsUnique();

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.CreatedByUser)
            .WithMany()
            .HasForeignKey(t => t.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedToUser)
            .WithMany()
            .HasForeignKey(t => t.AssignedToUserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Tickets)
            .HasForeignKey(t => t.CategoryId);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Priority)
            .WithMany(p => p.Tickets)
            .HasForeignKey(t => t.PriorityId);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Status)
            .WithMany(s => s.Tickets)
            .HasForeignKey(t => t.StatusId);
    }
}