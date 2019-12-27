using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.Diagnostics;
using System.Web.Security;
using System.Net.NetworkInformation;
using System.Configuration;
using System.Net;
using System.Web.Helpers;

namespace OPR_OCEL_Enhance.Controllers
{
    public class EmployeeExamController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        public string base_url_2 = Convert.ToInt32(ConfigurationManager.AppSettings["IsOnServer"]).Equals(1) ? string.Concat(ConfigurationManager.AppSettings["urlAppPath"], ConfigurationManager.AppSettings["urlAppSecond"]) : ConfigurationManager.AppSettings["urlAppPath"];
        public string base_url = ConfigurationManager.AppSettings["urlAppPath"];

        // GET: EmployeeExam
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            this.pv_CustLoadSession();
            ViewBag.GPID = iStrSessGPID;
            ViewBag.leftMenu = loadMenu();
            ViewBag.SetURL = base_url;
            return View();
        }

        public ActionResult ExamProcess(string token)
        {
            IList<string> param_ = token.Split(new string[] { "?", " " }, StringSplitOptions.RemoveEmptyEntries);

            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                var check =  db_.TBL_T_REGISTRATIONs.Where(data => data.RECORD_ID.Equals(param_[0])).FirstOrDefault();
                if (check != null)
                {
                    if (check.EXAM_STATUS >= 4)
                    {
                        return RedirectToAction("index", "EmployeeExam");
                    }
                    else
                    {
                        var EventCheck = db_.VW_EVENT_UJIANs.Where(param => param.EVENT_ID.Equals(param_[1].Substring(4))).FirstOrDefault();

                        if (EventCheck != null)
                        {
                            this.pv_CustLoadSession();

                            TBL_T_REGISTRATION iTBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(n => n.RECORD_ID.Equals(check.RECORD_ID)).Single();
                            iTBL_T_REGISTRATION.EXAM_LOGIN_TIME = DateTime.Now;
                            iTBL_T_REGISTRATION.PERCENT_COMPLETE = 2;
                            iTBL_T_REGISTRATION.EXAM_COMP_ID = "OCELWEB";
                            db_.SubmitChanges();

                            ViewBag.GPID = iStrSessGPID;
                            ViewBag.NRP = iStrSessNRP;
                            ViewBag.DSTRTC = iStrSessDistrik;
                            ViewBag.RECORD_ID = check.RECORD_ID;
                            ViewBag.leftMenu = loadMenu();
                            ViewBag.SoalType = check.QUESTION_TYPE;
                            ViewBag.Time = check.REMINDING_TIME;
                            ViewBag.TimeNormal = check.DURATION_MINUTE;
                            ViewBag.TimerOnSecond = (check.DURATION_MINUTE * 60);
                            ViewBag.Complete = check.PERCENT_COMPLETE;
                            ViewBag.REGISTERID = check.REGISTRATION_ID;
                            ViewBag.JENIS_UJIAN = EventCheck.JENIS_UJIAN_CODE;
                            ViewBag.SetURL = base_url;
                            ViewBag.EVENT_ID = EventCheck.EVENT_ID;

                            return View();
                        }
                        else
                        {
                            Session.Clear();
                            FormsAuthentication.SignOut();
                            return RedirectToAction("index", "login");
                        }
                    }
                   
                }
                else
                {
                    Session.Clear();
                    FormsAuthentication.SignOut();
                    return RedirectToAction("index", "login");
                    
                }
                
            }
        }

        public ActionResult ExamEssayProcess(string token)
        {
            IList<string> param_ = token.Split(new string[] { "?", " " }, StringSplitOptions.RemoveEmptyEntries);

            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                var check = db_.TBL_T_REGISTRATIONs.Where(data => data.RECORD_ID.Equals(param_[0])).FirstOrDefault();
                if (check != null)
                {
                    string events = @param_[1].Substring(4).ToString();
                    var EventCheck = db_.VW_EVENT_UJIANs.Where(param => param.EVENT_ID.Equals(events)).FirstOrDefault();
                    if (EventCheck != null)
                    {
                        if (!check.QUESTION_TYPE.Equals(3) && !check.QUESTION_TYPE.Equals(4))
                        {
                            Session.Clear();
                            FormsAuthentication.SignOut();
                            return RedirectToAction("index", "login");
                        }
                        else
                        {
                            if (check.EXAM_STATUS >= 4)
                            {
                                return RedirectToAction("index", "EmployeeExam");
                            }
                            else
                            {
                                this.pv_CustLoadSession();

                                TBL_T_REGISTRATION iTBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(n => n.RECORD_ID.Equals(check.RECORD_ID)).Single();
                                iTBL_T_REGISTRATION.EXAM_LOGIN_TIME = DateTime.Now;
                                iTBL_T_REGISTRATION.PERCENT_COMPLETE = 2;
                                iTBL_T_REGISTRATION.EXAM_COMP_ID = "OCELWEB";
                                db_.SubmitChanges();

                                ViewBag.GPID = iStrSessGPID;
                                ViewBag.RECORD_ID = check.RECORD_ID;
                                ViewBag.NRP = iStrSessNRP;
                                ViewBag.DSTRTC = iStrSessDistrik;
                                ViewBag.leftMenu = loadMenu();
                                ViewBag.SoalType = check.QUESTION_TYPE;
                                ViewBag.Time = check.REMINDING_TIME;
                                ViewBag.TimeNormal = check.DURATION_MINUTE;
                                ViewBag.TimerOnSecond = (check.DURATION_MINUTE * 60);
                                ViewBag.Complete = check.PERCENT_COMPLETE;
                                ViewBag.REGISTERID = check.REGISTRATION_ID;
                                ViewBag.JENIS_UJIAN = EventCheck.JENIS_UJIAN_CODE;
                                ViewBag.EVENT_ID = EventCheck.EVENT_ID;
                                ViewBag.SetURL = base_url;
                                Debug.WriteLine("Jenis Soal : " + EventCheck.QUESTION_TYPE);
                                return View();
                            }
                        }
                    }
                    else
                    {
                        Session.Clear();
                        FormsAuthentication.SignOut();
                        return RedirectToAction("index", "login");
                    }
                }
                else
                {
                    Session.Clear();
                    FormsAuthentication.SignOut();
                    return RedirectToAction("index", "login");

                }

            }
        }

        [HttpPost]
        public JsonResult UpdateExamAnswer(string QA_ID , string ANSWER , string REGISTRATION_ID, int JENIS_SOAL, int PERCENT_COMPLETE, string RECORD_ID , string nrp , string dstrct)
        {
            if (Session["NRP"] == null)
            {
                var data = db_.VW_EMPLOYEEs.Where(s => s.NRP.Equals(nrp)).First();
                Session["NRP"] = nrp;
                Session["PNRP"] = string.Concat("P",nrp);
                Session["empId"] = data.NRP;
                Session["Name"] = data.NAME;
                Session["Nama"] = data.NAME;
                Session["GP"] = 4;
                Session["distrik"] = data.DSTRCT_CODE;

                return Json(new { session = true, status = false});
            }
            else
            {
                VW_JAWABANSOAL iVW_JAWABANSOAL = db_.VW_JAWABANSOALs.Where(s => s.QA_ID.Equals(QA_ID)).FirstOrDefault();
                TBL_T_ANSWER iTBL_T_ANSWER = db_.TBL_T_ANSWERs.Where(dbs => dbs.QA_ID.Equals(QA_ID)).FirstOrDefault();
                try
                {
                    if (!iVW_JAWABANSOAL.KEYS.Equals(null) || !iVW_JAWABANSOAL.KEYS.Equals(string.Empty))
                    {
                        if (iVW_JAWABANSOAL.KEYS.Equals(ANSWER))
                        {
                            iTBL_T_ANSWER.STATUS = true;
                            iTBL_T_ANSWER.SCORE = 10;
                        }
                        else
                        {
                            iTBL_T_ANSWER.STATUS = false;
                            iTBL_T_ANSWER.SCORE = 0;
                        }
                    }
                    else
                    {
                        iTBL_T_ANSWER.STATUS = true;
                        iTBL_T_ANSWER.SCORE = 10;
                    }


                    iTBL_T_ANSWER.ANSWER_USER = ANSWER;
                    db_.SubmitChanges();
                    db_.cusp_update_percentage(RECORD_ID, PERCENT_COMPLETE);

                    var datasource = db_.VW_QUESTION_ON_EXAMPROCs.Where(f => f.REGISTRATION_ID.Equals(REGISTRATION_ID) && f.JENIS_SOAL.Equals(JENIS_SOAL)).OrderBy(x => x._NO);
                    return Json(new { session = true, status = true, Question = datasource });
                }
                catch (Exception ex)
                {
                    if (ex.GetType().ToString().Contains("NullReferenceException"))
                    {
                        iTBL_T_ANSWER.ANSWER_USER = ANSWER;
                        iTBL_T_ANSWER.STATUS = true;
                        iTBL_T_ANSWER.SCORE = 10;
                        db_.SubmitChanges();
                        var datasource = db_.VW_QUESTION_ON_EXAMPROCs.Where(f => f.REGISTRATION_ID.Equals(REGISTRATION_ID) && f.JENIS_SOAL.Equals(JENIS_SOAL)).OrderBy(x => x._NO);
                        return Json(new { session = true, status = true, Question = datasource });
                    }
                    else
                    {
                        return Json(new {session = true, status = false, remarks = "Sepertinya ada masalah pada komputer Anda, sistem gagal terkoneksi ke server", type = "red", hearder = "FAILED", error_type = ex.GetType().Name, error_message = ex.Message });
                    }
                }
            }
        }

        [HttpPost]
        public ActionResult CountResult_AndUpdate(string EVENT_ID , string RECORD_ID, string REGISTRATION_ID, int QUESTION_TYPE_ID, float PROGRESS)
        {
            try
            {
                var data = db_.VW_QUESTION_ON_EXAMPROCs.Where(f => f.REGISTRATION_ID.Equals(REGISTRATION_ID) && f.JENIS_SOAL.Equals(QUESTION_TYPE_ID)).OrderBy(x => x._NO);
                double Bobot = Convert.ToDouble(db_.TBL_T_EVENTS_TIME_DETAILs.Where(z => z.QUESTION_TYPE.Equals(QUESTION_TYPE_ID) && z.EVENT_ID.Equals(EVENT_ID)).SingleOrDefault().WEIGHT);

                TBL_T_REGISTRATION iTBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(h => h.RECORD_ID.Equals(RECORD_ID)).FirstOrDefault();
                int CountNilai = Convert.ToInt32(data.Sum(d => d.SCORE));
                int jum_soal = data.Count();

                double keseluruhan = (double)(jum_soal * 10);
                double hasil = ((double) (CountNilai / keseluruhan) * 100) * (Bobot/100);
                string By = "red";
                string Stats = null;
                if (hasil < (iTBL_T_REGISTRATION.PASSING_GRADE_PERCENT))
                {
                    By = "red";
                    Stats = "Gagal";
                }
                else
                {
                    By = "green";
                    Stats = "Lulus";
                }

                string MydnsCOmputer = Dns.GetHostName();

                iTBL_T_REGISTRATION.EXAM_FINISH_TIME = DateTime.Now;
                iTBL_T_REGISTRATION.REMINDING_TIME = 0;
                iTBL_T_REGISTRATION.EXAM_STATUS = 5;
                iTBL_T_REGISTRATION.EXAM_COMP_ID = Dns.GetHostEntry(Dns.GetHostName()).ToString();
                iTBL_T_REGISTRATION.EXAM_SCORE = hasil;
                iTBL_T_REGISTRATION.PERCENT_COMPLETE = 100;

                db_.SubmitChanges();
                return Json(new { status = false, title = "Konfirmasi Sukses", content = string.Concat("Nilai Anda adalah : ", hasil, "<br> Anda ",Stats," belum melampaui nilai minimal yang ditentukan. Terimakasih sudah mengikuti ujian ini"), type = By, error ="" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, title = "Konfirmasi Gagal", content = "Submit Ujian Gagal karena masalah koneksi, Tenang Anda sudah disimpan. Hubungi panitia atau IT",type = "red", error = e.ToString() });
            }
            
        }

        [HttpPost]
        public JsonResult RequestSoal (string REGISTER_ID , int QUESTION_TYPE_ID)
        {
            var data = db_.VW_QUESTION_ON_EXAMPROCs.Where(f => f.REGISTRATION_ID.Equals(REGISTER_ID) && f.JENIS_SOAL.Equals(QUESTION_TYPE_ID)).OrderBy(x => x._NO);
            return this.Json(new { Question = data });
        }

        [HttpGet]
        public ActionResult GetExamList()
        {
            this.pv_CustLoadSession();
            try
            {
                IQueryable<VW_EXAM_MASTER_DETAIL> dataExam = db_.VW_EXAM_MASTER_DETAILs.Where(h => h.STUDENT_ID.Equals(Session["NRP"]));
                return Json(new { data = dataExam }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
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


        public ActionResult SelftExam(string enc)
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                IList<string> param_ = enc.Split(new string[] { "?", " " }, StringSplitOptions.RemoveEmptyEntries);

                var files = db_.TBL_R_HANDBOOKs.Where(data => data.HANDBOOK_PID.Equals(param_[0])).FirstOrDefault();
                if (files != null)
                {
                    TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(p => p.RECORD_ID.Equals((param_[1]).Substring(4))).FirstOrDefault();
                    if (i_TBL_T_REGISTRATION.RECORD_ID != null)
                    {
                        if (i_TBL_T_REGISTRATION.EXAM_STATUS < 3)
                        {
                            i_TBL_T_REGISTRATION.EXAM_START_DATE = DateTime.Now.ToString("MM/dd/yyyy H:mm");
                            i_TBL_T_REGISTRATION.EXAM_ACTUAL_DATE = DateTime.Now.ToString("MM/dd/yyyy H:mm");
                            i_TBL_T_REGISTRATION.EXAM_STATUS = 3;
                            db_.SubmitChanges();
                        }

                        i_TBL_T_REGISTRATION.EXAM_LOGIN_TIME = DateTime.Now;
                        db_.SubmitChanges();

                        int Times_ex = Int32.Parse(i_TBL_T_REGISTRATION.REMINDING_TIME.ToString());

                        ViewBag.pdfurl = files.FILE_PATH;
                        ViewBag.materi = files.FILE_NAME;
                        ViewBag.remainTime = Times_ex;
                        ViewBag.progres_complete = i_TBL_T_REGISTRATION.PERCENT_COMPLETE;
                        ViewBag.RECORD_ID = (param_[1]).Substring(4);
                        ViewBag.SetURL = base_url;
                        return View();
                    }
                    else
                    {
                        Session.Clear();
                        FormsAuthentication.SignOut();
                        return RedirectToAction("index", "login");
                    }
                }
                else
                {
                    Session.Clear();
                    FormsAuthentication.SignOut();
                    return RedirectToAction("index", "login");
                }
            }
        }

        [HttpPost]
        public ActionResult updateSelftExamToReady(string RC_ID)
        {
            string MAC = null;
            MAC = GetIpAddressComp();
            try
            {
                TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(p => p.RECORD_ID.Equals(RC_ID)).FirstOrDefault();
                i_TBL_T_REGISTRATION.STATUS_READY_EXAM = true;
                i_TBL_T_REGISTRATION.RELEASE_BY = "SYSTEM";
                i_TBL_T_REGISTRATION.RELEASE_DATE = DateTime.Now;
                i_TBL_T_REGISTRATION.EXAM_COMP_ID = MAC;
                i_TBL_T_REGISTRATION.EXAM_FINISH_TIME = DateTime.Now;
                i_TBL_T_REGISTRATION.EXAM_STATUS = 5;
                i_TBL_T_REGISTRATION.EXAM_SCORE = 100;
                db_.SubmitChanges();
                return Json(new { status = true, title = "Study For Exam Success", content = "Selamat Setelah ini Anda akan diregistrasikan untuk sesi ujian lanjutan",icon = "fa fa-check-square" , type = "green" });
            }
            catch (Exception exc)
            {
                return Json(new { status = false, title = "Study For Exam Success But Contain Error", content = "Ada masalah ketika sistem akan menyimpan data anda ke database, Hubungi petugas IT / Panitia", icon = "fa-exclamation-triangle", type = "red", error = exc.ToString()});
            }
        }

        [HttpPost]
        public ActionResult UpdateRemindingTime(string R_ID , int RemindTime)
        {
            try
            {
                TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(R_ID)).FirstOrDefault();
                float prog = 100 - ((RemindTime * 100)/60);
                i_TBL_T_REGISTRATION.REMINDING_TIME = RemindTime;
                i_TBL_T_REGISTRATION.UPDATE_REMINDING_TIME = DateTime.Now;
                i_TBL_T_REGISTRATION.PERCENT_COMPLETE = prog;
                
                db_.SubmitChanges();
                return Json(new { status = true , progress = prog });
            }
            catch (Exception ex)
            {
                return Json(new { status = false , errr = ex.ToString()});
            }
        }

        [HttpPost]
        public ActionResult FinishReadingBook(string RECORD_ID)
        {
            TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(RECORD_ID)).FirstOrDefault();
            try {
                i_TBL_T_REGISTRATION.EXAM_STATUS = 5;
                i_TBL_T_REGISTRATION.PERCENT_COMPLETE = 100;
                i_TBL_T_REGISTRATION.EXAM_FINISH_TIME = DateTime.Now;
                i_TBL_T_REGISTRATION.EXAM_COMP_ID = GetIpAddressComp().ToString();
                i_TBL_T_REGISTRATION.REMINDING_TIME = 0;
                db_.SubmitChanges();
                return Json(new { status = true, title = "Sesi Berhasil Dikonfirmasi", content = "Terimakasih Telah membaca materi yang telah diberikan", type = "green", error = "" });
            }
            catch (Exception ex)
            {
                return Json(new {status = false, title = "Pengakhiran Gagal", content = "Terdapat masalah di koneksi jaringan Anda, <br>Detail :", type = "red", error = ex.ToString() });
            }
            
        }

        [HttpPost]
        public ActionResult UpdateExamRemindingTime(string R_ID, int RemindTime)
        {
            try
            {
                TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(R_ID)).FirstOrDefault();

                var data_Answer = db_.TBL_T_ANSWERs.Where(s => s.REGISTRATION_ID.Equals(R_ID) && s.JENIS_SOAL.Equals(i_TBL_T_REGISTRATION.QUESTION_TYPE));
                int lc_true = 0;
                foreach (var item in data_Answer)
                {
                    if (!String.IsNullOrEmpty(item.ANSWER_USER))
                    {
                        lc_true++;
                    }
                }

                double progress = 0;
                if (data_Answer.Count() != 0)
                {
                    progress = (lc_true / (data_Answer.Count())) * 100;
                }

                //Debug.WriteLine("Dijawab : " + lc_true);
                //Debug.WriteLine("Progress : " + progress);

                i_TBL_T_REGISTRATION.REMINDING_TIME = RemindTime;
                i_TBL_T_REGISTRATION.PERCENT_COMPLETE = progress;
                i_TBL_T_REGISTRATION.UPDATE_REMINDING_TIME = DateTime.Now;

                db_.SubmitChanges();
                return Json(new { status = true, progress = progress });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, errr = ex.ToString() });
            }

        }

        public ActionResult UpdateExamRemindingTimeEssay(string R_ID, int RemindTime, int Progress)
        {
            try
            {
                TBL_T_REGISTRATION i_TBL_T_REGISTRATION = db_.TBL_T_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(R_ID)).FirstOrDefault();

                i_TBL_T_REGISTRATION.REMINDING_TIME = RemindTime;
                i_TBL_T_REGISTRATION.PERCENT_COMPLETE = Progress;
                i_TBL_T_REGISTRATION.UPDATE_REMINDING_TIME = DateTime.Now;

                db_.SubmitChanges();
                return Json(new { status = true});
            }
            catch (Exception ex)
            {
                return Json(new { status = false, errr = ex.ToString() });
            }

        }

        private string GetIpAddressComp()
        {
            string macAddresses = string.Empty;

            string hostName = Dns.GetHostEntry(Dns.GetHostName())
                               .AddressList
                               .First(x => x.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                               .ToString();

            return macAddresses;
        }
		
		[HttpPost]
        public JsonResult ConfirmationSoal(VW_QUESTION_ON_EXAMPROC sVW_QUESTION_ON_EXAMPROC, string in_nrp, string in_dstrct)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                var data = db_.VW_EMPLOYEEs.Where(s => s.NRP.Equals(in_nrp)).First();
                Session["NRP"] = in_nrp;
                Session["PNRP"] = string.Concat("P", in_nrp);
                Session["empId"] = data.NRP;
                Session["Name"] = data.NAME;
                Session["Nama"] = data.NAME;
                Session["GP"] = 4;
                Session["distrik"] = data.DSTRCT_CODE;

                return Json(new { session = true, status = false});
            }

            try
            {
                {
                    var question = db_.TBL_T_ANSWERs.Where(P => P.QA_ID.Equals(sVW_QUESTION_ON_EXAMPROC.QA_ID)).FirstOrDefault();
                    question.ANSWER_USER = sVW_QUESTION_ON_EXAMPROC.ANSWER_USER;
                    question.SCORE = 0;
                    db_.SubmitChanges();

                    return this.Json(new { type = "SUCCESS", message = "Data Terupdate!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SubmitEssay(string @RECORD_ID, string @EVENT_ID, int Progress)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();

            try
            {
                {
                    db_.cusp_UpdateEssayStatus_AndRequestCorrection(@RECORD_ID, @Session["NRP"].ToString(), @EVENT_ID, 1, "OCELWEB");

                    return Json(new { status = true, title = "Konfirmasi Berhasil", content = "Submit Ujian Berhasil, Terimakasih telah mengikuti ujian ini, Status Anda sekarang menunggu koreksi dari Assesor", type = "green", error = "" });
                }
            }
            catch (Exception e)
            {
                return Json(new { status = false, title = "Konfirmasi Gagal", content = "Submit Ujian Gagal karena masalah koneksi, Tenang Anda sudah disimpan. Hubungi panitia atau IT", type = "red", error = e.ToString() });
            }
        }
    }
}