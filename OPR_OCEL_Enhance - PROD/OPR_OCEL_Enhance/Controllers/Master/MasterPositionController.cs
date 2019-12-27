using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers
{
    public class MasterPositionController : Controller
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
        public ActionResult readPosition(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<TBL_M_POSITION_APP> i_tbl_ = db_.TBL_M_POSITION_APPs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult createPosition(TBL_M_POSITION_APP sTBL_M_POSITION_APP)
        {
            this.pv_CustLoadSession();
            try
            {
                string position_desc = sTBL_M_POSITION_APP.POSITION_DESC;
                bool isactive = (bool)sTBL_M_POSITION_APP.IS_ACTIVE;

                db_.cusp_PositionSet(position_desc, isactive);
                db_.SubmitChanges();
                db_.Dispose();

                
                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" , error = e.ToString()});

            }
        }

        [HttpPost]
        public ActionResult updatePosition(TBL_M_POSITION_APP sTBL_M_POSITION_APP)
        {
            this.pv_CustLoadSession();
            try
            {

                TBL_M_POSITION_APP iTBL_M_POSITION_APP = db_.TBL_M_POSITION_APPs.Where(p => p.POSITION_CODE.Equals(sTBL_M_POSITION_APP.POSITION_CODE)).FirstOrDefault();

                iTBL_M_POSITION_APP.POSITION_DESC = sTBL_M_POSITION_APP.POSITION_DESC;
                iTBL_M_POSITION_APP.IS_ACTIVE = sTBL_M_POSITION_APP.IS_ACTIVE;
               
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

        [HttpPost]
        public ActionResult deletePosition(TBL_M_POSITION_APP sTBL_M_POSITION_APP)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_M_POSITION_APP iTBL_M_POSITION_APP = db_.TBL_M_POSITION_APPs.Where(p => p.POSITION_CODE.Equals(sTBL_M_POSITION_APP.POSITION_CODE)).FirstOrDefault();
                db_.TBL_M_POSITION_APPs.DeleteOnSubmit(iTBL_M_POSITION_APP);
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