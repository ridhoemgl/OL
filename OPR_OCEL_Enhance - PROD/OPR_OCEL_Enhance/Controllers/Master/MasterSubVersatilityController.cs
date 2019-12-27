using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Master
{
    public class MasterSubVersatilityController : Controller
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
            if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4))
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

        [HttpPost]
        public ActionResult AjaxReadModule()
        {
            try
            {
                var i_tbl = db_.TBL_R_MODULEs.OrderBy(p => p.MODULE_ID);
                return Json(i_tbl);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", message = "Data Read Failed" + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult readSubVersatility(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<VW_MODULE_SUB> i_tbl_ = db_.VW_MODULE_SUBs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult dropdownModul()
        {
            var i_VW_MODUL = db_.TBL_R_MODULEs;
            return this.Json(new { Data = i_VW_MODUL, Total = i_VW_MODUL.Count() });
        }

        [HttpPost]
        public ActionResult AjaxInsert(TBL_R_MODULE_SUB sTBL_R_MODULE_SUB)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_SUB iTBL_R_MODULE_SUB = db_.TBL_R_MODULE_SUBs
                    .Where(p => p.MODULE_SUB_NAME.Equals(sTBL_R_MODULE_SUB.MODULE_SUB_NAME)
                    && p.MODULE_ID.Equals(sTBL_R_MODULE_SUB.MODULE_ID)).FirstOrDefault();

                if (iTBL_R_MODULE_SUB != null)
                {
                    return Json(new { status = true, remarks = "Data sudah ada" });
                }
                else
                {
                    string module_sub_desc = sTBL_R_MODULE_SUB.MODULE_SUB_NAME;
                    string module_id = sTBL_R_MODULE_SUB.MODULE_ID;

                    db_.cusp_SubVersatilityset(module_sub_desc, module_id);
                    db_.SubmitChanges();
                    db_.Dispose();

                    return Json(new { status = true, remarks = "Data berhasil disimpan" });
                }
  
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" });

            }
        }

        [HttpPost]
        public ActionResult AjaxUpdate(TBL_R_MODULE_SUB sTBL_R_MODULE_SUB)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_SUB iTBL_R_MODULE_SUB = db_.TBL_R_MODULE_SUBs.Where(p => p.MODULE_SUB_ID.Equals(sTBL_R_MODULE_SUB.MODULE_SUB_ID) && p.MODULE_ID.Equals(sTBL_R_MODULE_SUB.MODULE_ID)).FirstOrDefault();

                if (iTBL_R_MODULE_SUB != null ) {
                    return Json(new { status = true, remarks = "Data sudah ada" });
                }
                else
                {
                    TBL_R_MODULE_SUB i_TBL_R_MODULE_SUB = db_.TBL_R_MODULE_SUBs.Where(p => p.PID.Equals(sTBL_R_MODULE_SUB.PID)).FirstOrDefault();

                    i_TBL_R_MODULE_SUB.MODULE_SUB_NAME = sTBL_R_MODULE_SUB.MODULE_SUB_NAME;
                    i_TBL_R_MODULE_SUB.MODULE_ID = sTBL_R_MODULE_SUB.MODULE_ID;

                    db_.SubmitChanges();
                    return Json(new { status = true, remarks = "Data berhasil diupdate" });
                }

            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!! " +e.StackTrace});
            }
        }

        [HttpPost]
        public ActionResult deleteSubVersatility(TBL_R_MODULE_SUB sTBL_R_MODULE_SUB)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE_SUB iTBL_R_MODULE_SUB = db_.TBL_R_MODULE_SUBs.Where(p => p.MODULE_SUB_ID.Equals(sTBL_R_MODULE_SUB.MODULE_SUB_ID) && p.MODULE_ID.Equals(sTBL_R_MODULE_SUB.MODULE_ID)).FirstOrDefault();
                db_.TBL_R_MODULE_SUBs.DeleteOnSubmit(iTBL_R_MODULE_SUB);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

        public JsonResult AjaxreadSubModulDistinct()
        {
            var i_VW_SUB_MODUL = db_.VW_SUB_MODUL_DISTs;
            return this.Json(i_VW_SUB_MODUL);
        }
	}
}