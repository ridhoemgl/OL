using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Mapping
{
    public class ModulePosisiController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            ViewBag.leftMenu = loadMenu();

            return View();
        }

        public ActionResult EGI()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            ViewBag.leftMenu = loadMenu();

            return View();
        }


        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
            ViewBag.gp = iStrSessGPID;
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

        public JsonResult dropdownModul()
        {
            var i_VW_MODUL = db_.TBL_R_MODULEs;
            return this.Json(new { Data = i_VW_MODUL, Total = i_VW_MODUL.Count() });
        }

        public JsonResult dropdownPositionApp()
        {
            var i_VW_PositionApp = db_.TBL_M_POSITION_APPs;
            return this.Json(new { Data = i_VW_PositionApp, Total = i_VW_PositionApp.Count() });
        }


        [HttpPost]
        public ActionResult readModulePosisi(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_MODULE_POSITION> i_tbl_ = db_.VW_MODULE_POSITIONs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult createModulePosisi(VW_MODULE_POSITION sVW_MODULE_POSITION)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_POSITION iTBL_R_MODULE_POSITION = new TBL_R_MODULE_POSITION();
                iTBL_R_MODULE_POSITION.PID_PM = Guid.NewGuid().ToString();
                iTBL_R_MODULE_POSITION.MODULE_PID = sVW_MODULE_POSITION.MODULE_PID;
                iTBL_R_MODULE_POSITION.POSITION_CODE = sVW_MODULE_POSITION.POSITION_CODE;
                iTBL_R_MODULE_POSITION.ISACTIVE = sVW_MODULE_POSITION.ISACTIVE;
                iTBL_R_MODULE_POSITION.CREATE_BY = iStrSessNRP;
                iTBL_R_MODULE_POSITION.CREATE_DATE = DateTime.Now;

                db_.TBL_R_MODULE_POSITIONs.InsertOnSubmit(iTBL_R_MODULE_POSITION);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan", error = e.ToString() });

            }
        }



        [HttpPost]
        public ActionResult updateModulePosisi(VW_MODULE_POSITION sVW_MODULE_POSITION)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_POSITION iTBL_R_MODULE_POSITION = db_.TBL_R_MODULE_POSITIONs.Where(p => p.PID_PM.Equals(sVW_MODULE_POSITION.PID_PM)).FirstOrDefault();

                iTBL_R_MODULE_POSITION.MODULE_PID = sVW_MODULE_POSITION.MODULE_PID;
                iTBL_R_MODULE_POSITION.POSITION_CODE = sVW_MODULE_POSITION.POSITION_CODE;
                iTBL_R_MODULE_POSITION.ISACTIVE = sVW_MODULE_POSITION.ISACTIVE;
                iTBL_R_MODULE_POSITION.MODIF_BY = iStrSessNRP;
                iTBL_R_MODULE_POSITION.MODIF_DATE = DateTime.Now;

                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data berhasil diupdate" , error = string.Empty });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" , error = e.ToString() });

            }
        }

  
        [HttpPost]
        public ActionResult deleteModulePosisi(VW_MODULE_POSITION sVW_MODULE_POSITION)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_POSITION iTBL_R_MODULE_POSITION = db_.TBL_R_MODULE_POSITIONs.Where(p => p.PID_PM.Equals(sVW_MODULE_POSITION.PID_PM)).FirstOrDefault();
                db_.TBL_R_MODULE_POSITIONs.DeleteOnSubmit(iTBL_R_MODULE_POSITION);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

	}
}