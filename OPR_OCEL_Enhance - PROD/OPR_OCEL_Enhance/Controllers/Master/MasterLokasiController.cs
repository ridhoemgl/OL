using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Master
{
    public class MasterLokasiController : Controller
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
        public ActionResult readLokasi(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_R_TEST_CENTER> i_tbl_ = db_.VW_R_TEST_CENTERs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult createLokasi(TBL_R_TEST_CENTER sVW_R_TEST_CENTER)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_TEST_CENTER iTBL_R_TEST_CENTER = new TBL_R_TEST_CENTER();
                iTBL_R_TEST_CENTER.TEST_CENTER_ID = sVW_R_TEST_CENTER.LOCATION + "-OCEL";
                iTBL_R_TEST_CENTER.TEST_CENTER_NAME = sVW_R_TEST_CENTER.TEST_CENTER_NAME;
                iTBL_R_TEST_CENTER.LOCATION = sVW_R_TEST_CENTER.LOCATION;
                iTBL_R_TEST_CENTER.FACILITY_DESC = sVW_R_TEST_CENTER.FACILITY_DESC;
                iTBL_R_TEST_CENTER.CAPACITY = sVW_R_TEST_CENTER.CAPACITY;
                iTBL_R_TEST_CENTER.CHECK_CAPACITY = sVW_R_TEST_CENTER.CHECK_CAPACITY;
                iTBL_R_TEST_CENTER.APP_ID = "1ABE7850-D1D4-4D63-A3DC-83E34E930605";

                db_.TBL_R_TEST_CENTERs.InsertOnSubmit(iTBL_R_TEST_CENTER);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" , error = e.ToString() });

            }
        }

        [HttpPost]
        public ActionResult updateLokasi(VW_R_TEST_CENTER sVW_R_TEST_CENTER)
        {
            this.pv_CustLoadSession();
            try
            {

                TBL_R_TEST_CENTER iTBL_R_TEST_CENTER = db_.TBL_R_TEST_CENTERs.Where(p => p.TEST_CENTER_ID.Equals(sVW_R_TEST_CENTER.PID)).FirstOrDefault();

                //iTBL_R_TEST_CENTER.TEST_CENTER_ID = sVW_R_TEST_CENTER.PID;
                iTBL_R_TEST_CENTER.TEST_CENTER_NAME = sVW_R_TEST_CENTER.TEST_CENTER_NAME;
                iTBL_R_TEST_CENTER.LOCATION = sVW_R_TEST_CENTER.LOCATION;
                iTBL_R_TEST_CENTER.FACILITY_DESC = sVW_R_TEST_CENTER.FACILITY_DESC;
                iTBL_R_TEST_CENTER.CAPACITY = sVW_R_TEST_CENTER.CAPACITY;
                iTBL_R_TEST_CENTER.CHECK_CAPACITY = sVW_R_TEST_CENTER.CHECK_CAPACITY;
                iTBL_R_TEST_CENTER.APP_ID = sVW_R_TEST_CENTER.APP_ID;

                //db_.TBL_R_TEST_CENTERs.InsertOnSubmit(iTBL_R_TEST_CENTER);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

        [HttpPost]
        public ActionResult deleteLokasi(VW_R_TEST_CENTER sVW_R_TEST_CENTER)
        {
            this.pv_CustLoadSession();
            try
            {

                TBL_R_TEST_CENTER iTBL_R_TEST_CENTER = db_.TBL_R_TEST_CENTERs.Where(p => p.TEST_CENTER_ID.Equals(sVW_R_TEST_CENTER.PID)).FirstOrDefault();
                db_.TBL_R_TEST_CENTERs.DeleteOnSubmit(iTBL_R_TEST_CENTER);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

        [HttpPost]
        public ActionResult AjaxGetListLoc()
        {
            IQueryable<VW_DISTRIK> i_tbl_ = db_.VW_DISTRIKs;
            return Json(new { Total = i_tbl_.Count(), Data = i_tbl_ });
        }

    }
}