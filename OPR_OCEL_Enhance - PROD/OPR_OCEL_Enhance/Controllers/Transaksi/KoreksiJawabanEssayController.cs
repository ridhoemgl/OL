using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models.viewmodels;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using System.Diagnostics;
using System.IO;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class KoreksiJawabanEssayController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private ErrorSaveClass ES = new ErrorSaveClass();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        public string base_url = ConfigurationManager.AppSettings["urlAppPath"];
        //
        // GET: /LatihanUjian/
        [Authorize]
        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            List<int> ExceptionProfile = new List<int>(new[] { 4, 8, 9 });

            int CurrProfile = Int32.Parse(Session["GP"].ToString());

            if (Session["NRP"] == null || ExceptionProfile.Contains(CurrProfile))
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

        [Authorize]
        public ActionResult PerubahanAsesor()
        {
            int[] exception = new int[] { 4 , 3 , 6 , 8, 9};

            if (Session["NRP"] == null || exception.Contains(Int32.Parse(Session["GP"].ToString())))
            {
                return RedirectToAction("logout", "Login");
            }
            else
            {
                this.pv_CustLoadSession();
                ViewBag.GPID = iStrSessGPID;
                ViewBag.pathParent = @base_url;
                ViewBag.leftMenu = loadMenu();
                return View();
            }
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
        public JsonResult Push_Correct_details(List<vmd_corrections> CorrecttionList)
        {
            List<TBL_T_DETAIL_CORRECTION> fadd = new List<TBL_T_DETAIL_CORRECTION>();
            string coor_pid = null;
            int jumlah_data = CorrecttionList.Count;
            try
            {
                for (int i = 0; i < jumlah_data; i++)
                {
                    string id = Guid.NewGuid().ToString();
                    TBL_T_DETAIL_CORRECTION iTBL_T_DETAIL_CORRECTION = new TBL_T_DETAIL_CORRECTION();
                    iTBL_T_DETAIL_CORRECTION.CORRECTION_DETAIL_PID = id;
                    iTBL_T_DETAIL_CORRECTION.CORRECTION_PID = CorrecttionList[i].CORRECTION_PID;
                    iTBL_T_DETAIL_CORRECTION.QA_ID = CorrecttionList[i].QA_ID;
                    iTBL_T_DETAIL_CORRECTION.NILAI = CorrecttionList[i].NILAI;
                    coor_pid = CorrecttionList[0].CORRECTION_PID.ToString();
	                
                    fadd.Add(iTBL_T_DETAIL_CORRECTION);
                }

                db_.TBL_T_DETAIL_CORRECTIONs.InsertAllOnSubmit(fadd);
                db_.SubmitChanges();

                return this.Json(new { status = true, header = "DATA SUDAH MASUK", body = "Data Koreksi Anda Telah Dicatat Oleh Sistem<br>Terimakasih Telah Melakukan Koreksi. <b>SEMANGAT PAGI</b>", type = "green", Err = string.Empty });
            }
            catch (Exception EX)
            {
                db_.UpdateCorrection_onfailed(coor_pid);
                string @jsonSave = JsonConvert.SerializeObject(new { status = false, korektor = Session["Nama_Nrpp"].ToString(), correction_data = CorrecttionList, cause = string.Concat("Maaf Data Koreksi Anda Gagal dimasukkan karena ", Environment.NewLine, EX.ToString()), ErrorDatabase = EX.ToString() });
                bool SAVE = ES.SaveError("FailCorretionData", "KOREKSI", Session["NRP"].ToString(),@jsonSave);

                if (SAVE)
                {
                    return this.Json(new { status = false, header = "PROSES GAGAL", body = string.Concat("Maaf Data Koreksi Anda Gagal dimasukkan :(", Environment.NewLine, "error sudah disimpan untuk di tracking"), type = "red", Err = string.Empty });
                }
                else
                {
                    return this.Json(new { status = false, header = "PROSES GAGAL", body = string.Concat("Maaf Data Koreksi Anda Gagal dimasukkan :(", Environment.NewLine, "error tidak disimpan di direktori server"), type = "red", Err = string.Empty });
                }
            }
        }

        [HttpPost]
        public ActionResult readRequest(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();
            string previlege = Session["GP"].ToString();
            int parse_prevlege = Int32.Parse(previlege);

            string sess = Session["distrik"].ToString();

            if (sess.Contains("JIEP") || sess.Contains("ALL"))
            {

                if (parse_prevlege.Equals(1) || parse_prevlege.Equals(5))
                {
                    IQueryable<VW_CORRECTION_REQUEST_MASTER> i_tbl_ = db_.VW_CORRECTION_REQUEST_MASTERs.Where(param => param.STATUS_CORRECTION.Equals(0));
                    return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                }
                else
                {
                    IQueryable<VW_CORRECTION_REQUEST_MASTER> i_tbl_ = db_.VW_CORRECTION_REQUEST_MASTERs.Where(param => param.STATUS_CORRECTION.Equals(0) && param.NRP_ACESSOR.Equals(Session["NRP"].ToString()));
                    return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                }
            }
            else
            {
                if (parse_prevlege.Equals(1) || parse_prevlege.Equals(5))
                {
                    IQueryable<VW_CORRECTION_REQUEST_MASTER> i_tbl_ = db_.VW_CORRECTION_REQUEST_MASTERs.Where(param => param.STATUS_CORRECTION.Equals(0) && param.DSTRCT_CODE.Equals(sess));
                    return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                }
                else
                {
                    IQueryable<VW_CORRECTION_REQUEST_MASTER> i_tbl_ = db_.VW_CORRECTION_REQUEST_MASTERs.Where(param => param.STATUS_CORRECTION.Equals(0) && param.NRP_ACESSOR.Equals(Session["NRP"].ToString()));
                    return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
                }
            }
        }

        [HttpPost]
        public JsonResult RequestSoal(string RECORD_ID , VW_QUESTION_ON_EXAMPROC sVW_QUESTION_ON_EXAMPROC)
        {
            var registration = db_.TBL_T_REGISTRATIONs.Where(g => g.RECORD_ID.Equals(RECORD_ID)).First();
            var data = db_.VW_QUESTION_ON_EXAMPROCs.Where(f => f.REGISTRATION_ID.Equals(sVW_QUESTION_ON_EXAMPROC.REGISTRATION_ID) && f.JENIS_SOAL.Equals(sVW_QUESTION_ON_EXAMPROC.JENIS_SOAL)).OrderBy( s =>s._NO);
            int max_value_corr = db_.TBL_R_TYPE_SOALs.Where(h => h.TYPE_CODE.Equals(registration.QUESTION_TYPE)).Single().MAX_MULTIPLY;

            return this.Json(new { Question = data , ScoreNow = registration.EXAM_SCORE , max_val = max_value_corr});
        }

        [HttpPost]
        public JsonResult UpdatingAcessor(string @participants_nrp , string @record_id_list, string @list_cor_pid, string @acessor_nrp)
        {
            try
            {
                db_.cusp_updating_correction_pic(participants_nrp.Trim(), acessor_nrp);
                db_.cusp_save_log_swich_asesor(@acessor_nrp, @participants_nrp.Trim(), record_id_list.Trim(), list_cor_pid.Trim(), Session["NRP"].ToString());
                return this.Json(new { status = true, MESSAGE_HEADER = "SUKSES", TYPE = "green", MESSAGE_BODY = "Proses perubahan asesor berhasil dilakukan" });
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, MESSAGE_HEADER = "KONEKSI ERROR", TYPE = "red", MESSAGE_BODY = "Periksa Koneksi Anda <br>" + e.ToString() });
            }
        }

        [HttpPost]
        public JsonResult ConfirmationSoal(string RECORD_ID, string CORRECTION_PID, double SCORE)
        {
            try
            {
                string iStrREmarks = string.Empty;
                pv_CustLoadSession();
                var A = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(RECORD_ID)).FirstOrDefault();
                int QTYPE = Convert.ToInt32(A.QUESTION_TYPE);
                string EVENT_ID = A.EVENT_ID;
                var B = db_.TBL_T_EVENTS_TIME_DETAILs.Where(z => z.QUESTION_TYPE.Equals(QTYPE) && z.EVENT_ID.Equals(EVENT_ID)).FirstOrDefault();
                double BOBOT = Convert.ToDouble(B.WEIGHT);

                double hasil = (SCORE * BOBOT) / 100;

                //var register_data = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(RECORD_ID)).First();

                //bool Is_gl_studycase = (register_data.POSITION_DESC.Contains("GL") && register_data.QUESTION_TYPE.Equals(4)) ? true : false;

                //if ((Is_gl_studycase && register_data.EXAM_TYPE.Equals(1)))
                //{
                //    hasil = hasil + 10;
                //}

                db_.cusp_AlreadyCorrected(RECORD_ID, CORRECTION_PID, Math.Round(hasil , 2));

                return this.Json(new { status = true, MESSAGE_HEADER = "SUKSES", TYPE = "green", MESSAGE_BODY = "Proses Koreksi berhasil dilakukan" });
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, MESSAGE_HEADER = "KONEKSI ERROR", TYPE = "red", MESSAGE_BODY = "Periksa Koneksi Anda <br>" + e.ToString() });
            }
        }
    }
}