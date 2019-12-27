using OPR_OCEL_Enhance.Models;
using OPR_OCEL_Enhance.Models.dbmodel;
using OPR_OCEL_Enhance.Models.viewmodels;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.IO;
using System.Web;
using System.Threading.Tasks;
using System.Data;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Net;
using OfficeOpenXml;
using System.Diagnostics;
using System;
using System.Collections.Generic;
namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class CopyToMobileController : Controller
    {
        private Copy_modb_registration copy_db_mob = new Copy_modb_registration();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MobileDBDataContext db_mob = new MobileDBDataContext();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            List<int> ExceptionProfile = new List<int>(new[] { 2 , 4 , 8 , 9 , 6 });
            int CurrProfile = Int32.Parse(Session["GP"].ToString());

            if (Session["NRP"] == null || ExceptionProfile.Contains(CurrProfile))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.leftMenu = loadMenu();
                ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];

                return View();
            }
        }

        [HttpGet]
        public JsonResult AjaxReadNewRegistration()

        {
            List<VW_PARTICIPANT_NEWREGISTRATION> listA = db_.VW_PARTICIPANT_NEWREGISTRATIONs.ToList();
            List<tbl_t_registration> listB = db_mob.tbl_t_registrations.ToList();

            var result = listA.Where(p => !listB.Any(x => x.record_id == p.RECORD_ID)).OrderBy(z => z.REGISTRATION_DATE);

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
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
        [Authorize]
        public JsonResult MoveLanTomodb(string record_id, string event_id, string registration_id)
        {
            bool even_in_mobile = copy_db_mob.InsertEVentToMobile(event_id);

            if (even_in_mobile)
            {
                List<TBL_T_REGISTRATION> REGIS = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(record_id)).ToList();
                bool InsertRegis_MOdb = copy_db_mob.Insert_Question_Answer_TOmOdb(REGIS);
                if (InsertRegis_MOdb)
                {
                    List<TBL_T_ANSWER> JAWABAN = db_.TBL_T_ANSWERs.Where(d => d.NRP.Equals(REGIS.First().STUDENT_ID) && d.REGISTRATION_ID.Equals(REGIS.First().REGISTRATION_ID)).ToList();
                    bool duplicate_answer = copy_db_mob.InserAnswer_MoDB(JAWABAN);
                    if (duplicate_answer)
                    {
                        return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Peserta dapat melakukan ujian di <b>1Pama</b>", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return this.Json(new { status = true, header = "GAGAL COPY", body = "Duplikasi soal ke mobile gagal", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return this.Json(new { status = true, header = "GAGAL INSERT", body = "Proses duplikasi registrasi ke mobile gagal", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return this.Json(new { status = true, header = "GAGAL PENGECEKAN", body = "Pengecekan sesi di mobile tidak berhasil dilakukan", type = "red", Err = "" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}