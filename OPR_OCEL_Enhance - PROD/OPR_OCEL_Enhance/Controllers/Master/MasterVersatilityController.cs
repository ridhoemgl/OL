using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Master
{
    public class MasterVersatilityController : Controller
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
        public ActionResult readVersatility(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<TBL_R_MODULE> i_tbl_ = db_.TBL_R_MODULEs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult createVersatility(TBL_R_MODULE sTBL_R_MODULE)
        {
            this.pv_CustLoadSession();
            try
            {
             
                string Module_desc = sTBL_R_MODULE.MODULE_NAME;

                db_.cusp_VersatilitySet(Module_desc);
                db_.SubmitChanges();
                db_.Dispose();


                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" });

            }
        }

        [HttpPost]
        public ActionResult updateVersatility(TBL_R_MODULE sTBL_R_MODULE)
        {
            this.pv_CustLoadSession();
            try
            {

                TBL_R_MODULE iTBL_R_MODULE = db_.TBL_R_MODULEs.Where(p => p.MODULE_ID.Equals(sTBL_R_MODULE.MODULE_ID)).FirstOrDefault();

                iTBL_R_MODULE.MODULE_NAME = sTBL_R_MODULE.MODULE_NAME;

                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

        [HttpPost]
        public ActionResult deleteVersatility(TBL_R_MODULE sTBL_R_MODULE)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_MODULE iTBL_R_MODULE = db_.TBL_R_MODULEs.Where(p => p.MODULE_ID.Equals(sTBL_R_MODULE.MODULE_ID)).FirstOrDefault();
                db_.TBL_R_MODULEs.DeleteOnSubmit(iTBL_R_MODULE);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" , error = string.Empty});
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" , error = e.ToString() });

            }
        }
	
    }
}