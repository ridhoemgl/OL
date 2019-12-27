using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models.viewmodels;
using System.IO;
using System.Web;
using System.Threading.Tasks;
using System.Data;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Net;
using System.Diagnostics;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class PesertaUjianOnlineController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        // GET: /UjianOnline/
        public ActionResult Index()
        {
            if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4))
            {
                return RedirectToAction("Index", "Login");
            }

            this.pv_CustLoadSession();
            ViewBag.GPID = iStrSessGPID;
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
        public JsonResult AjaxReadPertanyaan(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                db_ = new DtClass_OcelEnchDataContext();
                var vw_pertanyaan = db_.VW_NEVER_REGISTEREDs.Distinct();
                return Json(vw_pertanyaan.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxReadPertanyaanDetail(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                db_ = new DtClass_OcelEnchDataContext();
                var vw_pertanyaanDetail = db_.TBL_T_REGISTRATIONs.Distinct();
                return Json(vw_pertanyaanDetail.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //delete grid peserta ujian
        [HttpPost]
        public JsonResult DeletePertanyaanDetail(TBL_T_REGISTRATION sTBL_T_REGISTRATION)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();
            try
            {
                {
                    TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(P => P.RECORD_ID.Equals(sTBL_T_REGISTRATION.RECORD_ID)).FirstOrDefault();

                    db_.TBL_T_REGISTRATIONs.DeleteOnSubmit(i_TBL_T_REGISTRATION);
                    var i_TBL_T_ANSWER = db_.TBL_T_ANSWERs.Where(d => d.REGISTRATION_ID.Equals(sTBL_T_REGISTRATION.REGISTRATION_ID));
                    db_.TBL_T_ANSWERs.DeleteAllOnSubmit(i_TBL_T_ANSWER);
                    db_.SubmitChanges();
                    return this.Json(new { type = "SUCCESS", message = "Data Berhasil Dihapus!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult UpateTimes(string RECORD_ID, int REMINDING_TIME)
        {
            try
            {
                TBL_T_REGISTRATION iTBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(x => x.RECORD_ID.Equals(RECORD_ID)).FirstOrDefault();
                iTBL_T_REGISTRATION.REMINDING_TIME = REMINDING_TIME;
                iTBL_T_REGISTRATION.EXAM_STATUS = 3;
                iTBL_T_REGISTRATION.PERCENT_COMPLETE = 50;
                iTBL_T_REGISTRATION.UPDATE_REMINDING_TIME = DateTime.Now;
                db_.SubmitChanges();
                return this.Json(new { status = true});
            }
            catch (Exception ex)
            {
                return this.Json(new { status = false, message = ex.GetType()});
            }
        }
    }
}