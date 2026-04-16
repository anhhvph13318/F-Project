using F_Project.Models;
using Microsoft.AspNetCore.Mvc;

namespace F_Project.Controllers
{
    public class AdminController : Controller
    {
        private readonly DBContext _context;

        public AdminController(DBContext context)
        {
            _context = context;
        }
        public IActionResult Index()
        {
            var data = _context.Customers.ToList();
            return View(data);
        }
    }
}
