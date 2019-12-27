using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.Diagnostics;
using System.Configuration;

namespace OPR_OCEL_Enhance.Controllers
{
    public class SesiUjianController : Controller
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
            //Session["PNRP"] = "p61182334";
            //Session["empId"] = "61182334";
            //Session["NRP"] = "61182334";
            //Session["Name"] = "ADI PRANOTO";
            //Session["Nama"] = "Adi Pranoto";
            //Session["Nama_Nrpp"] = "Adi_61182334p";
            //Session["distrik"] = "JIEP";
            bool status = true;

            if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {

                List<int> gp_grant = new List<int>(new[] { 1, 5});
                int gp_now = Convert.ToInt32(Session["GP"].ToString());

                if (gp_grant.Contains(gp_now))
                {
                    status = false;
                }
                
                pv_CustLoadSession();
                ViewBag.GPID = iStrSessGPID;
                ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
                ViewBag.hidebutton = status;
                ViewBag.leftMenu = loadMenu();
                return View();
            }
            
        }


        [HttpPost]
        public JsonResult SesiUjianAction(string TYPE, string TEST_CENTER_ID, string CERTIFICATOR_ID, string DESCRIPTION, string LONG_DESCRIPTION, string MODULE_ID, string MODULE_NAME, string EXAM_START, string EXAM_END, string QUESTION_TYPE, string EVENT_ID, int JENIS_UJIAN_CODE, int EXAM_TARGET_MIN)
        {
            try
            {
                string id = null;
                if (TYPE.Contains("POST"))
                {
                    id = Guid.NewGuid().ToString();
                }else if(TYPE.Contains("PUT") || TYPE.Contains("Off") || TYPE.Contains("Delete"))
                {
                    id = EVENT_ID;
                }

                db_.cusp_SessionManagement(TYPE, TEST_CENTER_ID, CERTIFICATOR_ID, @DESCRIPTION, @LONG_DESCRIPTION, MODULE_ID, MODULE_NAME, EXAM_START, EXAM_END, QUESTION_TYPE, Session["NRP"].ToString(), id, JENIS_UJIAN_CODE, EXAM_TARGET_MIN);

                return this.Json(new { STATUSCODE = 1, MESSAGE_HEADER = "SUKSES", TYPE = "success", MESSAGE_BODY = "Proses " + TYPE.ToString() + " berhasil dilakukan, <b>Jangan Lupa Atur Waktu Ujiannya dan Bobot Penilaian</b><br> Terimakasih."});
            }
            catch (Exception e)
            {
                return this.Json(new { STATUSCODE = 0, MESSAGE_HEADER = "ERROR ON CODE", TYPE = "error", MESSAGE_BODY = e.ToString() , MODULE = MODULE_ID , TIPE = TYPE , CERT_ID = CERTIFICATOR_ID, EVENT_ID = EVENT_ID});
            }
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

        private void pv_CustLoadSession()
        {
            iStrSessNRP = (string)Session["NRP"];
            iStrSessDistrik = (string)Session["distrik"];
            iStrSessGPID = Convert.ToString(Session["gpId"] == null ? "1000" : Session["gpId"]);
            ViewBag.gp = iStrSessGPID;
        }


        [HttpPost]
        public ActionResult readSesiUjian(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                string sess = Session["distrik"].ToString();
                int lc_session_gp = Int32.Parse(Session["GP"].ToString());
                if ((!sess.Equals("JIEP") && !sess.Equals("ALL")))
                {
                    IQueryable<VW_EVENT_UJIAN> i_tbl_ = db_.VW_EVENT_UJIANs.Where(p => p.LOCATION.Equals(sess) && p.IS_ACTIVE.Equals(true));
                    return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                }
                else
                {
                    if (lc_session_gp.Equals(5))
                    {
                        IQueryable<VW_EVENT_UJIAN> i_tbl_ = db_.VW_EVENT_UJIANs.Where(p => p.IS_ACTIVE.Equals(true));
                        return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                    }
                    else
                    {
                        IQueryable<VW_EVENT_UJIAN> i_tbl_ = db_.VW_EVENT_UJIANs;
                        return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                    }
                }
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult populatedropdown()
        {
            string sess = Session["distrik"].ToString();
            var VW_MODULE_POSITION = db_.TBL_R_MODULEs;
            var itbl_tipe_soal  = db_.TBL_R_TYPE_SOALs;
            var i_cert_type = db_.TBL_R_JENIS_UJIANs.Where(a => a.IS_ACTIVE.Equals(1));

            if (sess.Equals("JIEP") || sess.Equals("ALL"))
            {
                var i_tbl = db_.VW_R_CERTIFICATORs.OrderBy(x => x.NAME);
                var i_tbltes = db_.VW_R_TEST_CENTERs.OrderBy(x => x.LOCATION);
                return this.Json(new { Data = i_tbl, Datacenter = i_tbltes, Datamodul = VW_MODULE_POSITION, Datasoal = itbl_tipe_soal, sessdi = sess, jenis_ujn = i_cert_type }, JsonRequestBehavior.AllowGet);
               
            }
            else
            {
                var i_tbl = db_.VW_R_CERTIFICATORs.Where(p => p.DSTRCT_CODE.Equals(sess)).OrderBy(x => x.NAME);
                var i_tbltes = db_.VW_R_TEST_CENTERs.Where(p => p.LOCATION.Equals(sess));
                return this.Json(new { Data = i_tbl, Datacenter = i_tbltes, Datamodul = VW_MODULE_POSITION, Datasoal = itbl_tipe_soal, sessdi = sess, jenis_ujn = i_cert_type }, JsonRequestBehavior.AllowGet);
            }
            
        }

        [HttpPost]
        public JsonResult GetCertificatorByDstric(string DISTRICT)
        {
            try
            {
                var i_tbl = db_.VW_R_CERTIFICATORs.Where(p => p.DSTRCT_CODE.Equals(DISTRICT)).OrderBy(x => x.NAME);
                return this.Json(new { status = true , Certificators = i_tbl }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, error = e.ToString()}, JsonRequestBehavior.AllowGet);
            }
        }


        //edit waktu
        [HttpPost]
        public JsonResult EditWaktu(VW_WAKTU_SESI_DETAIL sVW_WAKTU_SESI_DETAIL)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();

            try
            {
                {

                    var waktu = db_.TBL_T_EVENTS_TIME_DETAILs.Where(P => P.EVENT_ID.Equals(sVW_WAKTU_SESI_DETAIL.EVENT_ID) && P.QUESTION_TYPE.Equals(sVW_WAKTU_SESI_DETAIL.QUESTION_TYPE)).FirstOrDefault();
                    db_.cusp_UpdateSesiDetail(waktu.CODE_ID , sVW_WAKTU_SESI_DETAIL.TIME_EXAM , sVW_WAKTU_SESI_DETAIL.WEIGHT);

                    return this.Json(new { status = true, message = "Data Terupdate!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult TemptEditWaktu(string EVENT_ID , int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<VW_WAKTU_SESI_DETAIL> i_tbl_ = db_.VW_WAKTU_SESI_DETAILs.Where(s => s.EVENT_ID.Equals(EVENT_ID));
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}