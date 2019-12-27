using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Master
{
    public class ModuleEgiController : Controller
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

        public JsonResult dropdownEGI()
        {
            var i_VW_EGI = db_.TBL_M_EGIs;
            return this.Json(new { Data = i_VW_EGI, Total = i_VW_EGI.Count() });
        }

        public JsonResult dropdownModul()
        {
            var i_VW_MODUL = db_.TBL_R_MODULEs;
            return this.Json(new { Data = i_VW_MODUL, Total = i_VW_MODUL.Count() });
        }

        [HttpPost]
        public ActionResult readEGI(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<TBL_M_EGI> i_tbl_ = db_.TBL_M_EGIs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult readModuleEgi(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_MODULE_EGI> i_tbl_ = db_.VW_MODULE_EGIs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult createModuleEgi(VW_MODULE_EGI sVW_MODULE_EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_EGI iTBL_R_MODULE_EGI = new TBL_R_MODULE_EGI();
                iTBL_R_MODULE_EGI.PID_EM = Guid.NewGuid().ToString();
                iTBL_R_MODULE_EGI.MODULE_PID = sVW_MODULE_EGI.MODULE_ID;
                iTBL_R_MODULE_EGI.EGI_GENERAL = sVW_MODULE_EGI.EGI_GENERAL;
                iTBL_R_MODULE_EGI.ISACTIVE = sVW_MODULE_EGI.ISACTIVE;
                iTBL_R_MODULE_EGI.CREATE_BY = iStrSessNRP;
                iTBL_R_MODULE_EGI.CREATE_DATE = DateTime.Now;

                db_.TBL_R_MODULE_EGIs.InsertOnSubmit(iTBL_R_MODULE_EGI);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Gagal Menyimpan Data "+e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult createEGI(TBL_M_EGI sTBL_M_EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_M_EGI iTBL_M_EGI = new TBL_M_EGI();
                iTBL_M_EGI.EGI_GENERAL = sTBL_M_EGI.EGI_GENERAL.ToUpper();
                iTBL_M_EGI.GROUP_EQUIP_CLASS = sTBL_M_EGI.GROUP_EQUIP_CLASS.ToUpper();

                db_.TBL_M_EGIs.InsertOnSubmit(iTBL_M_EGI);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Gagal Menyimpan Data!" + e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult updateModuleEgi(VW_MODULE_EGI sVW_MODULE_EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_EGI iTBL_R_MODULE_EGI = db_.TBL_R_MODULE_EGIs.Where(p => p.PID_EM.Equals(sVW_MODULE_EGI.PID_EM)).FirstOrDefault();

                iTBL_R_MODULE_EGI.MODULE_PID = sVW_MODULE_EGI.MODULE_ID;
                iTBL_R_MODULE_EGI.EGI_GENERAL = sVW_MODULE_EGI.EGI_GENERAL;
                iTBL_R_MODULE_EGI.ISACTIVE = sVW_MODULE_EGI.ISACTIVE;
                iTBL_R_MODULE_EGI.MODIF_BY = iStrSessNRP;
                iTBL_R_MODULE_EGI.MODIF_DATE = DateTime.Now;

                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, message = "Update gagal!" + e.ToString() });

            }
        }

         [HttpPost]
        public ActionResult updateEGI(TBL_M_EGI sTBL_M_EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_M_EGI iTBL_M_EGI = db_.TBL_M_EGIs.Where(p => p.EGI_GENERAL.Equals(sTBL_M_EGI.EGI_GENERAL)).FirstOrDefault();

                iTBL_M_EGI.GROUP_EQUIP_CLASS = sTBL_M_EGI.GROUP_EQUIP_CLASS.ToUpper();

                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, message = "Update gagal!" + e.ToString() });

            }
        }

        [HttpPost]
        public ActionResult deleteModuleEgi(VW_MODULE_EGI sVW_MODULE_EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_EGI iTBL_R_MODULE_EGI = db_.TBL_R_MODULE_EGIs.Where(p => p.PID_EM.Equals(sVW_MODULE_EGI.PID_EM)).FirstOrDefault();
                db_.TBL_R_MODULE_EGIs.DeleteOnSubmit(iTBL_R_MODULE_EGI);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" , error = e.ToString() });

            }
        }

        [HttpPost]
        public ActionResult deleteEGI(TBL_M_EGI sTBL_M_EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_M_EGI iTBL_M_EGI = db_.TBL_M_EGIs.Where(p => p.EGI_GENERAL.Equals(sTBL_M_EGI.EGI_GENERAL)).FirstOrDefault();
                db_.TBL_M_EGIs.DeleteOnSubmit(iTBL_M_EGI);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" , error = e.ToString() });

            }
        }

	}
}