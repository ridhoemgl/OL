using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OPR_OCEL_Enhance.Models;
using Kendo.DynamicLinq;
using System.Diagnostics;

namespace OPR_OCEL_Enhance.Controllers
{
    
    public class HomeController : Controller
    {
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;

        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            this.pv_CustLoadSession();
            ViewBag.GPID = iStrSessGPID;
            ViewBag.leftMenu = loadMenu();
            return View();
        }

        private string loadMenu()
        {
            this.pv_CustLoadSession();
            if (Session["leftMenu"] == null)
            {
                //left menu sesuai id
                Session["leftMenu"] = menuLeftClass.recursiveMenu(0, Convert.ToInt32(iStrSessGPID));
            }
            return (string)Session["leftMenu"];
        }

        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
        }
    }
}