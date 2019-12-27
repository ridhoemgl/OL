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
using OfficeOpenXml;
using System.Diagnostics;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class PermintaanUjianController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        // GET: PermintaanUjian
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
            ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
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

        //read grid permintaan ujian
        [HttpPost]
        public ActionResult ReadPermintaanUjian(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();
            try
            {
                string previlege = Session["GP"].ToString();
                int parse_prevlege = Int32.Parse(previlege);
                string ses_nrp = Session["NRP"].ToString();

                string sess = Session["distrik"].ToString();

                Debug.WriteLine("DISTRIK : " + sess);
                Debug.WriteLine("GP : " + previlege);
                Debug.WriteLine("NRP : " + ses_nrp);

                if (sess.Contains("JIEP") || sess.Contains("ALL"))
                {
                    
                    if (parse_prevlege.Equals(1) || parse_prevlege.Equals(5))
                    {
                        IQueryable<VW_REQUEST_UJIAN> i_ReadPermintaanUjian = db_.VW_REQUEST_UJIANs;
                        return Json(i_ReadPermintaanUjian.ToDataSourceResult(take, skip, sort, filter));
                    }else
                    {
                        IQueryable<VW_REQUEST_UJIAN> i_ReadPermintaanUjian = db_.VW_REQUEST_UJIANs.Where(s => s.CERTIFICATOR_NRP.Equals(ses_nrp));
                        return Json(i_ReadPermintaanUjian.ToDataSourceResult(take, skip, sort, filter));
                    }
                }
                else
                {
                    if (parse_prevlege.Equals(1) || parse_prevlege.Equals(5))
                    {
                        IQueryable<VW_REQUEST_UJIAN> i_ReadPermintaanUjian_o = db_.VW_REQUEST_UJIANs.Where(s => s.DSTRCT_CODE.Equals(sess));
                        return Json(i_ReadPermintaanUjian_o.ToDataSourceResult(take, skip, sort, filter));
                    }
                    else
                    {
                        IQueryable<VW_REQUEST_UJIAN> i_ReadPermintaanUjian_o = db_.VW_REQUEST_UJIANs.Where(s => s.CERTIFICATOR_NRP.Equals(ses_nrp) && s.DSTRCT_CODE.Equals(sess));
                        return Json(i_ReadPermintaanUjian_o.ToDataSourceResult(take, skip, sort, filter));
                    }
                }
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //add grid permintaan ujian
        [HttpPost]
        public JsonResult AddPermintaanUjian(TBL_T_REGISTRATION sTBL_T_REGISTRATION)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();
            try
            {
                        db_.cusp_Update_STATUSExamNonSelftAssesmen(null, sTBL_T_REGISTRATION.RECORD_ID, sTBL_T_REGISTRATION.EXAM_TYPE);
                        return this.Json(new { type = "SUCCESS", message = "Data Tersimpan!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}