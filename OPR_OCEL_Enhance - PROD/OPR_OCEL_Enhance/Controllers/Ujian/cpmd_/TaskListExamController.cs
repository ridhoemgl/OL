using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OPR_OCEL_Enhance.Models.viewmodels;
using OPR_OCEL_Enhance.Models.viewmodels.cpmd;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace OPR_OCEL_Enhance.Controllers
{
    public class TaskListExamController : Controller
    {
        private cpmd_dataDataContext cpmd_ = new cpmd_dataDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        public string base_url = ConfigurationManager.AppSettings["urlAppPath"].ToString();

        [Authorize]
        public ActionResult Index()
        {
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                this.pv_CustLoadSession();
                List<vmd_GetTask> TaskArr = GetTaskList(Session["NRP"].ToString());
                var TaskJson = new JavaScriptSerializer().Serialize(TaskArr);

                ViewBag.GPID = iStrSessGPID;
                ViewBag.NRP_EMP = iStrSessNRP;
                ViewBag.leftMenu = loadMenu();
                ViewBag.SetURL = ConfigurationManager.AppSettings["urlAppPath"].ToString();
                ViewBag.TaskJson = TaskJson;
                ViewBag.Isman = Convert.ToInt32(Session["IsManager"].ToString());
                ViewData["TaskList"] = TaskArr;
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
        public ActionResult UpdateRemindingTime(string R_ID, int RemindTime)
        {
            try
            {
                TBL_T_READING_REGISTRATION iTBL_T_READING_REGISTRATION = cpmd_.TBL_T_READING_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(R_ID)).FirstOrDefault();
                float prog = 100 - ((RemindTime * 100) / 60);
                iTBL_T_READING_REGISTRATION.REMINDING_TIME = RemindTime;
                iTBL_T_READING_REGISTRATION.UPDATE_REMINDING_TIME = DateTime.Now;
                iTBL_T_READING_REGISTRATION.PERCENT_COMPLETE = prog;
                iTBL_T_READING_REGISTRATION.EXAM_STATUS = 3;
                cpmd_.SubmitChanges();
                cpmd_.Dispose();

                return Json(new { status = true, progress = prog });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, errr = ex.ToString() });
            }
        }

        [HttpPost]
        [Authorize]
        public ActionResult RegisterExam(string TASK_ID , string NRP_EMP)
        {
            if (TASK_ID == null || NRP_EMP == null)
            {
                Session.Clear();
                FormsAuthentication.SignOut();
                return RedirectToAction("Index", "Login");
            }
            else
            {
                try
                {
                    cpmd_.cusp_generate_soal_acak(TASK_ID, NRP_EMP);

                    var obj_dt_generate = cpmd_.TBL_T_USER_ANSWERs.Where(dt => dt.TASK_ID == TASK_ID && dt.NRP.Equals(NRP_EMP));

                    if (obj_dt_generate == null)
                    {
                        return Json(new { status = false, title = "Registration Exam", content = "Maaf soal terdeteksi gagal tergenerate, laporakan pada support CPMD / IT", icon = "fa fa-check-square", type = "red" });
                    }
                    else
                    {
                        return Json(new { status = true, title = "Registration Exam", content = "Proses pendaftaran dan pengacakan soal berhasil", icon = "fa fa-check-square", type = "green" });
                    }
                }
                catch (Exception ex)
                {
                    return Json(new { status = false, title = "Registration Exam", content = string.Concat("Maaf soal terdeteksi gagal tergenerate, laporakan pada support CPMD / IT",Environment.NewLine,"Error : ",ex.ToString()), icon = "fa fa-check-square", type = "red" });
                }
            }

        }

        [HttpPost]
        public ActionResult updateSelftExamToReady(string RC_ID , string TASK_ID , string COMPETENCY_ID)
        {
            try
            {
                //TBL_T_READING_REGISTRATION iTBL_T_READING_REGISTRATION = cpmd_.TBL_T_READING_REGISTRATIONs.Where(p => p.RECORD_ID.Equals(RC_ID)).FirstOrDefault();
                //iTBL_T_READING_REGISTRATION.STATUS_READY_EXAM = true;
                //iTBL_T_READING_REGISTRATION.EXAM_FINISH_TIME = DateTime.Now;
                //iTBL_T_READING_REGISTRATION.EXAM_STATUS = 5;
                //iTBL_T_READING_REGISTRATION.EXAM_SCORE = 100;
                //cpmd_.SubmitChanges();
                //cpmd_.Dispose();
                var cmpetency = cpmd_.TBL_R_COMPETENCies.Where(s => s.MODULE_SUB_ID.Equals(COMPETENCY_ID)).First();

                cpmd_.cusp_updateReadingExamToReady(RC_ID, TASK_ID, COMPETENCY_ID, Session["NRP"].ToString(), cmpetency.IS_LAST_COMPETENCY);

                return Json(new { status = true, title = "Study For Exam Success", content = "Selamat Setelah ini Anda akan diregistrasikan untuk bab selanjutnya", icon = "fa fa-check-square", type = "green" });
            }
            catch (Exception exc)
            {
                return Json(new { status = false, title = "Study For Exam Success But Contain Error", content = "Ada masalah ketika sistem akan menyimpan data anda ke database, Hubungi petugas IT / Panitia", icon = "fa-exclamation-triangle", type = "red", error = exc.ToString() });
            }
        }

        [HttpPost]
        public ActionResult FinishReadingBook(string RC_ID, string TASK_ID, string COMPETENCY_ID)
        {
           // TBL_T_READING_REGISTRATION iTBL_T_READING_REGISTRATION = cpmd_.TBL_T_READING_REGISTRATIONs.Where(s => s.RECORD_ID.Equals(RECORD_ID)).FirstOrDefault();
            try
            {
                var cmpetency = cpmd_.TBL_R_COMPETENCies.Where(s => s.MODULE_SUB_ID.Equals(COMPETENCY_ID)).First();
                cpmd_.cusp_updateReadingExamToReady(RC_ID, TASK_ID, COMPETENCY_ID, Session["NRP"].ToString(), cmpetency.IS_LAST_COMPETENCY);

                return Json(new { status = true, title = "Sesi Berhasil Dikonfirmasi", content = "Terimakasih Telah membaca materi yang telah diberikan", type = "green", error = "" });
            }
            catch (Exception ex)
            {
                return Json(new { status = false, title = "Pengakhiran Gagal", content = "Terdapat masalah di koneksi jaringan Anda, <br>Detail :", type = "red", error = ex.ToString() });
            }

        }

        [HttpGet]
        [Authorize]
        public JsonResult GetListDetail(string record)
        {
            var data = cpmd_.cufn_get_list_detail(record);
            return Json(new { dt = data }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ReadingExam(string task_id, string record_id , int step)
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                string session_gp = Session["GP"].ToString();

                if (session_gp != "4" && session_gp != "5")
                {
                    Session.Clear();
                    FormsAuthentication.SignOut();
                    return RedirectToAction("Index", "Login");
                }
                
                var files = cpmd_.VW_TASKLIST_DETAILs.Where(data => data.RECORD_ID.Equals(record_id) && data.TASK_ID.Equals(task_id)).FirstOrDefault();
                if (files != null)
                {
                    TBL_T_READING_REGISTRATION iTBL_T_READING_REGISTRATION = cpmd_.TBL_T_READING_REGISTRATIONs.Where(p => p.RECORD_ID.Equals(record_id)).FirstOrDefault();
                    if (iTBL_T_READING_REGISTRATION.RECORD_ID != null)
                    {
                        if (iTBL_T_READING_REGISTRATION.EXAM_STATUS < 3)
                        {
                            iTBL_T_READING_REGISTRATION.EXAM_START_DATE = DateTime.Now.ToString("MM/dd/yyyy H:mm");
                            iTBL_T_READING_REGISTRATION.EXAM_ACTUAL_DATE = DateTime.Now.ToString("MM/dd/yyyy H:mm");
                            iTBL_T_READING_REGISTRATION.EXAM_STATUS = 3;
                        }

                        iTBL_T_READING_REGISTRATION.EXAM_LOGIN_TIME = DateTime.Now;
                        cpmd_.SubmitChanges();
                        cpmd_.Dispose();
                        int Times_ex = Int32.Parse(iTBL_T_READING_REGISTRATION.REMINDING_TIME.ToString());

                        ViewBag.pdfurl = files.SUPPORT_LINK;
                        ViewBag.materi = files.MODULE_SUB_NAME;
                        ViewBag.remainTime = Times_ex;
                        ViewBag.progres_complete = iTBL_T_READING_REGISTRATION.PERCENT_COMPLETE;
                        ViewBag.RECORD_ID = record_id;
                        ViewBag.task_id = task_id;
                        ViewBag.step_code = step;
                        ViewBag.COMPETRNCY_CODE = files.MODULE_SUB_ID;
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

        private List<vmd_GetTask> GetTaskList(string NRP)
        {
            List<vmd_GetTask> m_DATA = new List<vmd_GetTask>();

            var list_task = cpmd_.GetMyTaskList(NRP).OrderBy(x => x.MODULE_ID);
            foreach (var item in list_task)
            {
                List<VW_TASKLIST_DETAIL> myTaskChild = new List<VW_TASKLIST_DETAIL>();
                myTaskChild = cpmd_.VW_TASKLIST_DETAILs.Where(z => z.TASK_ID.Equals(item.TASK_ID) && z.NRP.Equals(item.NRP)).OrderBy(z => z.STEP).ToList();

                m_DATA.Add(new vmd_GetTask()
                {
                    TASK_ID_ = item.TASK_ID,
                    NRP_ = item.NRP,
                    MODULE_NAME_ = item.MODULE_NAME,
                    ASSIGN_DATE_ = item.ASSIGN_DATE,
                    TASK_COUNT_ = Convert.ToInt32(item.TASK_COUNT),
                    J_UNLOCK_ = Convert.ToInt32(item.J_UNLOCK),
                    TASK_STATUS_ = item.TASK_STATUS,
                    BTN_ENABLER_ = item.BTN_ENABLER,
                    ChildData = myTaskChild
                });
            }

            return m_DATA;
        }
	}
}