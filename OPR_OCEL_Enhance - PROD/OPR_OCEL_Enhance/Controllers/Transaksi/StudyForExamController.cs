using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.IO;

namespace OPR_OCEL_Enhance.Controllers
{
    public class StudyForExamController : Controller
    {
        //
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        // GET: /StudyForExam/
        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4) || Int32.Parse(Session["GP"].ToString()).Equals(2))
            {
                return RedirectToAction("Index", "Login");
            }

            ViewBag.leftMenu = loadMenu();
            return View();
        }

        public ActionResult ExamDocumentList()
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

        [HttpPost]
        public ActionResult deleteExam(string kode , string path)
        {
            this.pv_CustLoadSession();
            bool ret = false;
            try
            {
                TBL_R_HANDBOOK ITBL_R_HANDBOOK = db_.TBL_R_HANDBOOKs.Where(x => x.HANDBOOK_PID.Equals(kode)).FirstOrDefault();
                db_.TBL_R_HANDBOOKs.DeleteOnSubmit(ITBL_R_HANDBOOK);
                db_.SubmitChanges();
                //return Json(new { status = true, remarks = "Data dihapus" });
                ret = true;
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak bisa dihapus karena terhubung di data lainnya" , type = "error", hearder = "FAILED" , error_message = e.ToString() });
            }

            if (ret == true)
            {
                string fullPath = Request.MapPath("~/question_image/document_examp/" + path);
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                    return Json(new { status = true, remarks = "Data berhasil dihapus beserta dokumennya" , type = "success", hearder = "SUKSES" });
                }
                else
                {
                    return Json(new { status = true, remarks = "Data berhasil dihapus dari database, namun tidak ditemukan dokumen untuk dihapus sistem<br>file sudah dihapus melalui server", type = "question", hearder = "INFORMASI" });
                }
            }
            else
            {
                return Json(new { status = false });
            }
        }

        [HttpPost]
        public ActionResult updatePosition(string HANDBOOK_PID, string FILE_NAME, string EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_HANDBOOK iTBL_R_HANDBOOK = db_.TBL_R_HANDBOOKs.Where(s => s.HANDBOOK_PID.Equals(HANDBOOK_PID)).FirstOrDefault();
                iTBL_R_HANDBOOK.EGI = EGI;
                iTBL_R_HANDBOOK.FILE_NAME = @FILE_NAME;
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil diperbarui", type = "success", messageheader = "Update Successfully" });
            }
            catch (Exception e)
            {
                return Json(new { status = true, remarks = "Data tidak diperbarui, system melakukan rollback", type = "error",error_full = e.ToString(), messageheader = "Update Failed" });
            }
        }

        [HttpPost]
        public ActionResult readExamBook(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<VW_STUDY_FOR_EXAM> i_tbl_ = db_.VW_STUDY_FOR_EXAMs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult dropdownEGI()
        {
            var i_VW_EGI = db_.TBL_M_EGIs;
            return this.Json(new { Data = i_VW_EGI, Total = i_VW_EGI.Count() }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult upload_documentExam(string name)
        {
            int message = 0;
            string file = null;
            foreach (string upload in Request.Files)
            {
                if (Request.Files[upload].FileName != "")
                {
                    //string filename = Path.GetFileName(Request.Files[upload].FileName);
                    FileInfo fi = new FileInfo(Path.GetFileName(Request.Files[upload].FileName));
                    string ext = fi.Extension;
                    file = name+(ext).ToString();
                    Request.Files[upload].SaveAs(@"\\jiepfsap401\ocel$\document_examp\"+file);

                    if (System.IO.File.Exists(@"\\jiepfsap401\ocel$\document_examp\"+file))
                    {
                        message = 1;
                    }
                    else
                    {
                        message = 0;
                    }
                }
            }

            return this.Json(new { message = message , name_file = file}, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult createMateriData(string MODULE_ID, string FILE_NAME, string IsActive , string PATH , string EGI)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_HANDBOOK iTBL_R_HANDBOOK = new TBL_R_HANDBOOK();
                iTBL_R_HANDBOOK.HANDBOOK_PID = Guid.NewGuid().ToString();
                iTBL_R_HANDBOOK.MODULE_ID = MODULE_ID.ToString();
                iTBL_R_HANDBOOK.FILE_NAME = FILE_NAME.ToString();
                iTBL_R_HANDBOOK.FILE_PATH = PATH.ToString();
                iTBL_R_HANDBOOK.IsActive = ToBoolean(IsActive);
                iTBL_R_HANDBOOK.EGI = EGI.ToString();
                iTBL_R_HANDBOOK.CREATED_DATE = DateTime.Now;
                iTBL_R_HANDBOOK.CREATED_BY = Session["NRP"].ToString();

                db_.TBL_R_HANDBOOKs.InsertOnSubmit(iTBL_R_HANDBOOK);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan", type = "success", messageheader = "Data Ditambahkan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Gagal Menyimpan Data " + e.ToString(), MODUL = MODULE_ID, FILE_NAME = FILE_NAME, AKTIF = ToBoolean(IsActive), type = "error", messageheader = "Data Gagal ditambahkan" });
            }
        }

        private static bool ToBoolean(string value)
        {
            switch (value.ToLower())
            {
                case "true":
                    return true;
                case "t":
                    return true;
                case "1":
                    return true;
                case "0":
                    return false;
                case "false":
                    return false;
                case "f":
                    return false;
                default:
                    throw new InvalidCastException("You can't cast that value to a bool!");
            }
        }
	}
}