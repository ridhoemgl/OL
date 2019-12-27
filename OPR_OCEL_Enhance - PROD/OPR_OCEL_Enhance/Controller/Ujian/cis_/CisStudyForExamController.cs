using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers.Transaksi
{
    public class CisStudyForExamController : Controller
    {

        cis_dataDataContext db_ = new cis_dataDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        // GET: CisStudyForExam
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


        public class ListAttachment
        {
            public string fname { get; set; }
        }
        [HttpPost]

        public JsonResult UploadKendo(string is_old_browser)
        {
            pv_CustLoadSession();
            var fname = "";
            var fname_l = "";

            if (Request.Files.Count > 0)
            {
                List<ListAttachment> LAttachment = new List<ListAttachment>();
                foreach (string upload in Request.Files)
                {
                    HttpFileCollectionBase files = Request.Files;
                    var fileContent = Request.Files[0];
                    fname = Request.Files[upload].FileName;
                    var filesize = fileContent.ContentLength / 1024;

                    if (filesize <= 15000 && fileContent.FileName.Substring(fileContent.FileName.Length - 3).ToLower() == "pdf")
                    {
                        try
                        {

                            for (int i = 0; i < files.Count; i++)
                            {
                                HttpPostedFileBase file = files[i];
                                if (is_old_browser.Equals("True") || is_old_browser.Equals("true"))
                                {
                                    string[] testfiles = file.FileName.Split(new char[] { '\\' });
                                    fname = testfiles[testfiles.Length - 1];
                                }
                                else
                                {
                                    fname = file.FileName;
                                }

                                //fname_l = Path.Combine(Server.MapPath("~" + @"\question_image\cis_doc\"), fname);
                                fname_l =  @"\\jiepfsap401\ocel$\cis_doc\" + fname;
                                file.SaveAs(fname_l);
                                ListAttachment attch = new ListAttachment();
                                attch.fname = fname;

                                LAttachment.Add(attch);


                            }

                            return this.Json(new { message = 1, nama_file_ext = fname, LAttachment = LAttachment }, JsonRequestBehavior.AllowGet);
                        }
                        catch (Exception e)
                        {
                            return this.Json(new { message = 0, nama_file_ext = fname , error = e.ToString() }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {
                        return this.Json(new { message = 0, nama_file_ext = fname }, JsonRequestBehavior.AllowGet);
                    }
                }

                return this.Json(new { message = 1, nama_file_ext = fname }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { message = 0, remarks = "No files selected." }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DeleteKendo()
        {
            //var fname = "";
            //HttpFileCollectionBase files = Request.Files;
            return this.Json(new { status = true, message = 3 });
        }

        public class iCls
        {
         
            public string FILE_NAME { get; set; }
            public bool IsActive { get; set; }
            public string pid_category { get; set; }
        }

        [HttpPost]
        public JsonResult SimpanDocument(iCls iCls, List<ListAttachment> req)
        {
            //string FILE_NAME, bool IsActive, string pid_category, List<ListAttachment> req
            pv_CustLoadSession();
            try
            {
                var pid = Guid.NewGuid().ToString();
                foreach (var item in req)
                {
                    TBL_R_HANDBOOK_CI tbl = new TBL_R_HANDBOOK_CI();
                    tbl.HANDBOOK_PID = Guid.NewGuid().ToString();
                    tbl.PID_CATEGORY = iCls.pid_category;
                    tbl.FILE_PATH = item.fname;
                    tbl.FILE_NAME = iCls.FILE_NAME;
                    tbl.IsActive = iCls.IsActive;
                    tbl.CREATED_BY = iStrSessNRP;
                    tbl.CREATED_DATE = DateTime.Now;
                    tbl.MODIF_BY = null;
                    tbl.MODIF_DATE = null;
                    tbl.GROUP_FLG = pid;

                    db_.TBL_R_HANDBOOK_CIs.InsertOnSubmit(tbl);
                    db_.SubmitChanges();
                   
                }
                
                db_.Dispose();

                return Json(new { status = true });
            }
            catch (Exception ex)
            {

                return Json(new { status = false, remarks = ex.ToString() });
            }
        }

        [HttpPost]
        public JsonResult readExamBook(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {

            try
            {
                var data = db_.VW_LIST_HANDBOOK_CIs.OrderByDescending(f=>f.CREATED_DATE);
                 return Json(data.ToDataSourceResult(take, skip, sort, filter));
               

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public JsonResult readExamBookList(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {

            try
            {
                var data = db_.VW_LIST_HANDBOOK_CIs.Where(f=>f.IsActive == true ).OrderByDescending(f => f.CREATED_DATE);
                return Json(data.ToDataSourceResult(take, skip, sort, filter));


            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult DownloadFile(string filename)
        {
          
            //string path_file = filename.Replace("/Upload/Kontrak/", @"\Upload\Kontrak\");
            string path = @"\\jiepfsap401\ocel$\cis_doc\" + filename;

            if (System.IO.File.Exists(path))
            {
                byte[] fileBytes = System.IO.File.ReadAllBytes(path);
                string fileName = filename;
                return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
            }

            return Content("File Not Found");

        }

        [HttpPost]
        public JsonResult deleteExam(string HANDBOOK_PID, string FILE_NAME, string FILE_PATH)
        {
            try
            {
                bool ret = false;
                
                var data = db_.TBL_R_HANDBOOK_CIs.Where(f => f.HANDBOOK_PID.Equals(HANDBOOK_PID)).FirstOrDefault();
                if (data != null)
                {
                    db_.TBL_R_HANDBOOK_CIs.DeleteOnSubmit(data);
                    db_.SubmitChanges();
                    ret = true;
                }
                db_.Dispose();

                if (ret == true)
                {
                    string fullPath = Request.MapPath("~/question_image/cis_doc/" + FILE_PATH);
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);
                        return Json(new { status = true, remarks = "Data berhasil dihapus beserta dokumennya", type = "success", hearder = "SUKSES" });
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
            catch (Exception ex)
            {

                return Json(new { status = false, remarks = ex.ToString() });
            }
        }


        [HttpPost]
        public JsonResult Edit(string HANDBOOK_PID, string FILE_NAME, string pid_category)
        {
            pv_CustLoadSession();
            try
            {
                var data = db_.TBL_R_HANDBOOK_CIs.Where(f => f.GROUP_FLG.Equals(HANDBOOK_PID)).ToList();
                if (data.Count() != 0)
                {
                    foreach(var item in data)
                    {
                        item.FILE_NAME = FILE_NAME;
                        item.PID_CATEGORY = pid_category;
                        item.MODIF_BY = iStrSessNRP;
                        item.MODIF_DATE = DateTime.Now;
                        db_.SubmitChanges();
                    }
                   
                }
                db_.Dispose();
                return Json(new { status = true });
            }
            catch (Exception ex)
            {

                return Json(new { status = false, remarks = ex.ToString() });
            }
        }


        [HttpPost]
        public JsonResult EditStat(string HANDBOOK_PID, bool IsActive)
        {
            pv_CustLoadSession();
            try
            {
                var data = db_.TBL_R_HANDBOOK_CIs.Where(f => f.HANDBOOK_PID.Equals(HANDBOOK_PID)).FirstOrDefault();
                if(data != null)
                {
                    data.IsActive = IsActive;
                    data.MODIF_BY = iStrSessNRP;
                    data.MODIF_DATE = DateTime.Now;
                    db_.SubmitChanges();
                }
                db_.Dispose();
                return Json(new { status = true });
            }
            catch (Exception ex)
            {

                return Json(new { status = false, remarks = ex.ToString() });
            }
        }

        public JsonResult ListKategori()
        {
            try
            {
                var data = db_.TBL_M_CATEGORY_HANDBOOK_CIs.OrderBy(f => f.NAMA_CATEGORY).ToList();

                return Json(new { status = true, data = data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {

                return Json(new { status = false, remarks = ex.ToString() });
            }
        }


        public ActionResult ExamDocument()
        {
            //this.pv_CustLoadSession();
            //if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4) || Int32.Parse(Session["GP"].ToString()).Equals(2))
            //{
            //    return RedirectToAction("Index", "Login");
            //}

            //ViewBag.leftMenu = loadMenu();
            return View();
        }
    }
}