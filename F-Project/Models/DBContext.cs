using Microsoft.EntityFrameworkCore;

namespace F_Project.Models
{
    public class DBContext : DbContext
    {
        // Constructor bắt buộc
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }
        // 👇 thêm cái này
        public DBContext()
        {
        }
        // Bảng Customer
        public DbSet<Customer> Customers { get; set; }

        // 🔥 thêm đoạn này
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    "Server=DESKTOP-MV83UQK;Database=FProject;Trusted_Connection=True;TrustServerCertificate=True");
            }
        }
    }
}
