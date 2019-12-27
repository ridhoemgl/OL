using OPR_OCEL_Enhance.Models;
using OPR_OCEL_Enhance.Models.dbmodel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class CopyToLANController : Controller
    {
        //private Copy_modb_registration copy_db_mob = new Copy_modb_registration();
        private Copy_sqco_registration copy_db_sqco = new Copy_sqco_registration();

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MobileDBDataContext db_mob = new MobileDBDataContext();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        // GET: CopyToLAN
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

        [HttpGet]
        public JsonResult AjaxReadNewRegistration()

        {
            List<vw_finished_exam_to_sqco> list = db_mob.vw_finished_exam_to_sqcos.ToList();

            var result = list.OrderBy(o => o.registration_date);

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authorize]
        public JsonResult Copy(string record_id, string registration_id)
        {
            bool event_in_registration = copy_db_sqco.CopyRegisToLAN(record_id);
            if (event_in_registration)
            {
                bool event_in_answer = copy_db_sqco.CopyAnswerToLAN(registration_id);
                if (event_in_answer)
                {
                    bool event_in_acessor = copy_db_sqco.CopyAcessorToLAN(record_id);
                    if (event_in_acessor)
                    {
                        return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proses duplikasi ke LAN berhasil", type = "green", Err = "" }, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        return this.Json(new { status = true, header = "GAGAL COPY", body = "Proses duplikasi acessor ke LAN gagal", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return this.Json(new { status = true, header = "GAGAL COPY", body = "Proses duplikasi jawaban ke LAN gagal", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return this.Json(new { status = true, header = "GAGAL COPY", body = "Proses duplikasi registrasi ke LAN gagal", type = "orange", Err = "" }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}