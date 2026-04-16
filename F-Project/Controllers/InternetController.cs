using F_Project.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace F_Project.Controllers
{
    public class InternetController : Controller
    {
        private readonly ILogger<InternetController> _logger;

        public InternetController(ILogger<InternetController> logger)
        {
            _logger = logger;
        }

        public IActionResult Home()
        {
            return View();
        }

        public IActionResult ComboInternetSky()
        {
            return View();
        }
        public IActionResult ComboInternetMeta()
        {
            return View();
        }
        public IActionResult ComboInternetSkyF1()
        {
            return View();
        }
        public IActionResult ComboInternetSkyF2()
        {
            return View();
        }
        public IActionResult ComboInternetSpeedX2()
        {
            return View();
        }
        public IActionResult ComboInternetSpeedX2Pro()
        {
            return View();
        }
        public IActionResult GoiGiga()
        {
            return View();
        }
        public IActionResult GoiSky()
        {
            return View();
        }
        public IActionResult GoiFGame()
        {
            return View();
        }
        public IActionResult GoiGigaF1()
        {
            return View();
        }
        public IActionResult GoiSkyF1()
        {
            return View();
        }
        public IActionResult GoiSkyF2()
        {
            return View();
        }
        public IActionResult GoiSkyF3()
        {
            return View();
        }
        public IActionResult GoiSpeedX2Pro()
        {
            return View();
        }
        public IActionResult GoiSpeedX10Pro()
        {
            return View();
        }
        public IActionResult GoiSpeedX2ProIQ4S()
        {
            return View();
        }
        public IActionResult GoiSpeedX10ProIQ4S()
        {
            return View();
        }
        public IActionResult GoiSpeedX2IQ4S()
        {
            return View();
        }
        public IActionResult GoiSpeedX10IQ4S()
        {
            return View();
        }
        public IActionResult GoiSpeedX2Eyes3IQ4S()
        {
            return View();
        }
        public IActionResult GoiSpeedX10Eyes3IQ4S()
        {
            return View();
        }
        public IActionResult GoiSpeedX10()
        {
            return View();
        }
        public IActionResult GoiSpeedX2()
        {
            return View();
        }
        public IActionResult Register(string name, int price, string comboname)
        {
            ViewBag.name = name;
            ViewBag.price = price;
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
