using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.Diagnostics;
using System.Web.Security;
using System.Net.NetworkInformation;
using System.Configuration;

namespace OPR_OCEL_Enhance.Controllers.Ujian
{
    public class ExamController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        public string base_url = ConfigurationManager.AppSettings["urlAppPath"];
        // GET: Exam
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            this.pv_CustLoadSession();
            ViewBag.GPID = iStrSessGPID;
            ViewBag.leftMenu = loadMenu();
            ViewBag.SetURL = base_url;
            return View();
        }

        private string loadMenu()
        {
            this.pv_CustLoadSession();
            if (Session["leftMenu"] == null)
            {
                Session["leftMenu"] = menuLeftClass.recursiveMenu(0, Convert.ToInt32(iStrSessGPID));
            }
            return (string)Session["leftMenu"];
        }

        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
            ViewBag.gp = iStrSessGPID;
        }


    }
}