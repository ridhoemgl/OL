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
using OPR_OCEL_Enhance.Models.dbmodel;
using System.Diagnostics;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class RecordJawabanController : Controller
    {
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        public string base_url = ConfigurationManager.AppSettings["urlAppPath"];
        // GET: /RecordJawaban/
        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4))
            {
                return RedirectToAction("logout", "Login");
            }
            else
            {
                ViewBag.leftMenu = loadMenu();
                ViewBag.pathParent = @base_url;
                return View();
            }
        }

        [HttpPost]
        public JsonResult Getdata()
        {
            var jenis_ujian = db_.TBL_R_JENIS_UJIANs.Where(h => h.IS_ACTIVE.Equals(1));
            var jenis_soal = db_.TBL_R_TYPE_SOALs.Where(h => h.IS_ACTIVE.Equals(1));
            var posisi = db_.TBL_M_POSITION_APPs.Where(h => h.IS_ACTIVE.Equals(1));

            return this.Json(new
            {
                DJ = jenis_ujian,
                JS = jenis_soal,
                PS = posisi
            });
        }

        [HttpPost]
        public JsonResult GetHistoryJawab(string register_id, int jenissoal, string nrp_karyawan)
        {
            try
            {
                if (jenissoal.Equals(1) || jenissoal.Equals(2))
                {
                    var dataku = db_.cufn_get_historical_answer_pilgan(nrp_karyawan,register_id,jenissoal).OrderBy(F => F._NO).ToList();
                    return Json(new { err = false, datax = dataku , QT = "PG" });
                }
                else
                {
                    var dataku = db_.cufn_get_soal_essay_dikoreksi(nrp_karyawan, jenissoal, register_id).OrderBy(F => F._NO).ToList();
                    return Json(new { err = false, datax = dataku , QT = "ES" });
                }
                
            }
            catch (Exception e)
            {
                return this.Json(new { err = true, err_detail = e.GetType().ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult FinishedExamStudent(int question_type, int exam_type, string pos_code, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var data_orang = db_.cufn_t_transaction_w_AppPositioncode(question_type, exam_type, pos_code);
                return Json(data_orang.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString()
                });
            }
        }

        [HttpGet]
        public JsonResult TES()
        {
            var data_orang = db_.cufn_t_transaction_w_AppPositioncode(1,1,"PC0001");
            return this.Json(new
            {
                Data = data_orang
            }, JsonRequestBehavior.AllowGet);
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
	}
}