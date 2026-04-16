using F_Project.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace F_Project.Controllers
{
    public class FPTPlayController : Controller
    {
        private readonly ILogger<FPTPlayController> _logger;

        public FPTPlayController(ILogger<FPTPlayController> logger)
        {
            _logger = logger;
        }

        public IActionResult GoiVVip1()
        {
            return View();
        }
        public IActionResult GoiVVip2()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
