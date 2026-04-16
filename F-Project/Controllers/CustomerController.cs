using F_Project.Models;
using Microsoft.AspNetCore.Mvc;

namespace F_Project.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : Controller
    {
        private readonly DBContext _context;

        public CustomerController(DBContext context)
        {
            _context = context;
        }

        [HttpPost("Create")]
        public IActionResult Create([FromBody] Customer model)
        {
            model.Datetime = DateTime.Now;
            _context.Customers.Add(model);
            _context.SaveChanges();
            return Ok(new { success = true });
        }
        [HttpPost("Delete")]
        public IActionResult Delete([FromBody] Customer model)
        {
            Customer remove = new Customer();
            remove = _context.Customers.Where(c => c.Id == model.Id).FirstOrDefault();
            _context.Customers.Remove(remove);
            _context.SaveChanges();
            return Ok(new { success = true });
        }
    }
}