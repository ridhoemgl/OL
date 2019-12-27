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

namespace OPR_OCEL_Enhance.Controllers.BankSoal
{
    public class SoalEssayController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        ClsSoalEssay iClsSoalEssay = new ClsSoalEssay();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;

        public bool iStrStatus;

        // GET: SoalEssay
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

        //GAMBAR
        [HttpPost]
        public ActionResult upload_question_image()
        {
            int message = 0;

            foreach (string upload in Request.Files)
            {
                if (Request.Files[upload].FileName != "")
                {
                    string filename = Path.GetFileName(Request.Files[upload].FileName);
                    string path = AppDomain.CurrentDomain.BaseDirectory + "/question_image/";
                    Request.Files[upload].SaveAs(Path.Combine(path, filename));

                    if (System.IO.File.Exists(Path.Combine(path, filename)))
                    {
                        message = 1;
                    }
                    else
                    {
                        message = 0;
                    }
                }
            }

            return this.Json(new { message = message }, JsonRequestBehavior.AllowGet);
        }

        //DD MODUL
        public JsonResult DropdownModul()
        {
            try
            {
                var i_R_MODUL = db_.TBL_R_MODULEs.OrderBy(p => p.MODULE_NAME);
                return this.Json(i_R_MODUL);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //DD SUB MODUL
        public JsonResult DropdownSubModul()
        {
            try
            {
                var i_R_SUBMODUL = db_.TBL_R_MODULE_SUBs.OrderBy(p => p.MODULE_SUB_NAME);
                return this.Json(i_R_SUBMODUL);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //DD EGI
        public JsonResult DropdownEgi()
        {
            try
            {
                var i_R_EGI = db_.TBL_R_MODULE_EGIs.OrderBy(p => p.EGI_GENERAL);
                return this.Json(i_R_EGI);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //DD TIPE
        public JsonResult DropdownTipe()
        {
            try
            {
                var i_R_TIPE = db_.TBL_R_JENIS_UJIANs.OrderBy(p => p.JENIS_UJIAN_CODE);
                return this.Json(i_R_TIPE);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //DD JABATAN
        public JsonResult DropdownJabatan()
        {
            try
            {
                var i_R_JABATAN = db_.TBL_M_POSITION_APPs.OrderBy(p => p.POSITION_CODE);
                return this.Json(i_R_JABATAN);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        ////DD BARU
        //public JsonResult DropdownBaru()
        //{
        //    var i_module = db_.TBL_R_MODULEs;
        //    var i_cert_type = db_.TBL_R_JENIS_UJIANs;
        //    var i_manposition = db_.TBL_M_POSITION_APPs.Where(x => x.IS_ACTIVE.Equals(1));

        //    return this.Json(new { Data = i_module, Data_cert = i_cert_type, Data_manposition = i_manposition, Total = i_module.Count() }, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public ActionResult AjaxReadModul()//DirektoriServer
        {
            return this.Json(new { Total = iClsSoalEssay.GetListDDModul().Count(), Data = iClsSoalEssay.GetListDDModul() });
        }

        [HttpPost]
        public ActionResult AjaxReadSubModul(string smodul)//DirektoriServer
        {
            return this.Json(new { Total = iClsSoalEssay.GetListDDSUbModul(smodul).Count(), Data = iClsSoalEssay.GetListDDSUbModul(smodul) });
        }

        [HttpPost]
        public ActionResult AjaxReadJenisSoal()
        {
            var source = db_.TBL_R_TYPE_SOALs.Where(A => A.TYPE_CODE.Equals(3) || A.TYPE_CODE.Equals(4));
            return this.Json(new { Total = source.Count(), Data = source.ToList() });
        }
        
        [HttpPost]
        public ActionResult AjaxReadEgi(string egi)//DirektoriServer
        {
            return this.Json(new { Total = iClsSoalEssay.GetListDDEgi(egi).Count(), Data = iClsSoalEssay.GetListDDEgi(egi) });
        }

        [HttpPost]
        public ActionResult AjaxReadTipeSoal()//DirektoriServer
        {
            return this.Json(new { Total = iClsSoalEssay.GetListTipeSoal().Count(), Data = iClsSoalEssay.GetListTipeSoal() });
        }

        [HttpPost]
        public ActionResult AjaxReadPosisi()//DirektoriServer
        {
            ClsSoalEssay iClsSoalEssay = new ClsSoalEssay();
            return this.Json(new { Total = iClsSoalEssay.GetListPosisi().Count(), Data = iClsSoalEssay.GetListPosisi() });
        }

        //read grid soal essay
        [HttpPost]
        public ActionResult ReadSoalEssay(string MODULE_ID , string EGI_GENERAL , string EXAM_TYPE, string APP_ELLIPSE_CODE , int QUESTION_TYPE, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();
            try
            {
                IQueryable<TBL_R_QUESTION_ALL> i_ReadSoalEssay = db_.TBL_R_QUESTION_ALLs.Where(x => x.QUESTION_TYPE.Equals(QUESTION_TYPE) && x.EGI_GENERAL.Equals(EGI_GENERAL) && x.CERT_FOR.Equals(EXAM_TYPE) && x.MODULE_ID.Equals(MODULE_ID) && x.DESTINATION_POSITION.Contains(APP_ELLIPSE_CODE));
                return Json(i_ReadSoalEssay.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult ReadCountSummary(string MODULE_ID, string EGI_GENERAL, string EXAM_TYPE, string APP_ELLIPSE_CODE, int QUESTION_TYPE , int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();
            try
            {
                var i_VW_KELOMPOK_SOAL = db_.VW_KELOMPOK_SOALs.Select( o => new
                {
                    PID = o.PID,
                    MODULE_ID = o.MODULE_ID,
                    JENIS_UJIAN_CODE = o.JENIS_UJIAN_CODE,
                    EGI_CODE = o.EGI_CODE,
                    TYPE_CODE = o.TYPE_CODE,
                    POSITION_CODE = o.POSITION_CODE,
                    JENIS_UJIAN_DESC = o.JENIS_UJIAN_DESC,
                    MODULE_SUB_NAME = o.MODULE_SUB_NAME,
                    J_ACTUAL = o.J_ACTUAL,
                    QUESTION_TYPE = o.TYPE_CODE
                }).Where(
                    x => x.TYPE_CODE.Equals(3) &&
                    x.JENIS_UJIAN_CODE.Equals(EXAM_TYPE) && 
                    x.MODULE_ID.Equals(MODULE_ID) && 
                    x.EGI_CODE.Equals(EGI_GENERAL) &&
                    x.POSITION_CODE.Contains(APP_ELLIPSE_CODE) &&
                    x.QUESTION_TYPE.Equals(QUESTION_TYPE));

                return Json(i_VW_KELOMPOK_SOAL.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString()});
            }
        }

        //add grid soal essay
        [HttpPost]
        public JsonResult AddSoalEssay(TBL_R_QUESTION_ALL s_TBL_R_QUESTION_ALL)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();
            try
            {
                {
                    TBL_R_QUESTION_ALL i_CHECK_T_ITID = db_.TBL_R_QUESTION_ALLs.Where(p => p.MODULE_ID == s_TBL_R_QUESTION_ALL.MODULE_ID && p.MODULE_SUB_ID == s_TBL_R_QUESTION_ALL.MODULE_SUB_ID).FirstOrDefault();

                    if (s_TBL_R_QUESTION_ALL.MODULE_ID == null)
                    {
                        return this.Json(new { type = "WARNING", message = "Module ID harus diisi!" }, JsonRequestBehavior.AllowGet);
                    }
                    else if (s_TBL_R_QUESTION_ALL.MODULE_SUB_ID == null)
                    {
                        return this.Json(new { type = "WARNING", message = "Module Sub ID harus diisi!" }, JsonRequestBehavior.AllowGet);
                    }

                    else
                    {
                        db_.cusp_QuestionEssaySet(Guid.NewGuid().ToString(), s_TBL_R_QUESTION_ALL.MODULE_ID, s_TBL_R_QUESTION_ALL.MODULE_SUB_ID,
                           s_TBL_R_QUESTION_ALL.QUESTION_MAX_TIME, s_TBL_R_QUESTION_ALL.QUESTION_CONTENT, s_TBL_R_QUESTION_ALL.ANSWER_1, s_TBL_R_QUESTION_ALL.IMAGE_PATH, Session["NRP"].ToString(), s_TBL_R_QUESTION_ALL.CERT_FOR, s_TBL_R_QUESTION_ALL.DESTINATION_POSITION, s_TBL_R_QUESTION_ALL.EGI_GENERAL);

                        return this.Json(new { type = "SUCCESS", message = "Data Tersimpan!" }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //edit grid soal essay
        [HttpPost]
        public JsonResult EditSoalEssay(string QUESTION_ID, string MODULE_ID, string MODULE_SUB_ID, string EGI_GENERAL, string CERT_FOR, string DESTINATION_POSITION, string QUESTION_CONTENT, string ANSWER_1, int QUESTION_MAX_TIME, string IMAGE_PATH)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();

            try
            {
                {

                    var question = db_.TBL_R_QUESTION_ALLs.Where(P => P.QUESTION_ID.Equals(QUESTION_ID)).FirstOrDefault();
                    question.QUESTION_ID = QUESTION_ID;
                    question.MODULE_ID = MODULE_ID;
                    question.MODULE_SUB_ID = MODULE_SUB_ID;
                    question.MODIFICATION_DATE = DateTime.Now;
                    question.CERT_FOR = CERT_FOR;
                    question.DESTINATION_POSITION = DESTINATION_POSITION;
                    question.ANSWER_1 = ANSWER_1;
                    question.QUESTION_CONTENT = QUESTION_CONTENT;
                    question.QUESTION_MAX_TIME = QUESTION_MAX_TIME;
                    question.IMAGE_PATH = IMAGE_PATH;
                    question.EGI_GENERAL = EGI_GENERAL;
                    db_.SubmitChanges();

                    return this.Json(new { type = "SUCCESS", message = "Data Terupdate!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public ActionResult EditSoalEssay(TBL_R_QUESTION_ALL sTBL_R_QUESTION_ALL)
        //{
        //    this.pv_CustLoadSession();
        //    try
        //    {

        //        TBL_R_QUESTION_ALL iTBL_R_QUESTION_ALL = db_.TBL_R_QUESTION_ALLs.Where(p => p.QUESTION_ID.Equals(sTBL_R_QUESTION_ALL.QUESTION_ID)).FirstOrDefault();

        //        iTBL_R_QUESTION_ALL.MODULE_ID = sTBL_R_QUESTION_ALL.MODULE_ID;
        //        iTBL_R_QUESTION_ALL.MODULE_SUB_ID = sTBL_R_QUESTION_ALL.MODULE_SUB_ID;
        //        iTBL_R_QUESTION_ALL.MODIFICATION_DATE = sTBL_R_QUESTION_ALL.MODIFICATION_DATE;
        //        iTBL_R_QUESTION_ALL.CERT_FOR = sTBL_R_QUESTION_ALL.CERT_FOR;
        //        iTBL_R_QUESTION_ALL.DESTINATION_POSITION = sTBL_R_QUESTION_ALL.DESTINATION_POSITION;
        //        iTBL_R_QUESTION_ALL.ANSWER_1 = sTBL_R_QUESTION_ALL.ANSWER_1;
        //        iTBL_R_QUESTION_ALL.QUESTION_CONTENT = sTBL_R_QUESTION_ALL.QUESTION_CONTENT;
        //        iTBL_R_QUESTION_ALL.QUESTION_MAX_TIME = sTBL_R_QUESTION_ALL.QUESTION_MAX_TIME;
        //        iTBL_R_QUESTION_ALL.IMAGE_PATH = sTBL_R_QUESTION_ALL.IMAGE_PATH;
        //        iTBL_R_QUESTION_ALL.EGI_GENERAL = sTBL_R_QUESTION_ALL.EGI_GENERAL;

        //        //db_.TBL_R_TEST_CENTERs.InsertOnSubmit(iTBL_R_TEST_CENTER);
        //        db_.SubmitChanges();
        //        return Json(new { status = true, remarks = "Data berhasil diupdate" });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { status = false, remarks = "Transaksi gagal!!!" });

        //    }
        //}

        //destroy grid soal essay
        [HttpPost]
        public JsonResult DestroySoalEssay(TBL_R_QUESTION_ALL s_TBL_R_QUESTION_ALL)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();
            try
            {
                {
                    TBL_R_QUESTION_ALL i_TBL_R_QUESTION_ALL = db_.TBL_R_QUESTION_ALLs.Where(P => P.QUESTION_ID.Equals(s_TBL_R_QUESTION_ALL.QUESTION_ID)).FirstOrDefault();

                    db_.TBL_R_QUESTION_ALLs.DeleteOnSubmit(i_TBL_R_QUESTION_ALL);
                    db_.SubmitChanges();
                    return this.Json(new { type = "SUCCESS", message = "Data Berhasil Dihapus!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //destroy selected grid soal essay
        [HttpPost]
        public JsonResult DestroySelectedSoalEssay(List<TBL_R_QUESTION_ALL> s_TBL_R_QUESTION_ALL)
        {
            try
            {
                {
                    foreach (var item in s_TBL_R_QUESTION_ALL)
                    {
                        TBL_R_QUESTION_ALL i_TBL_R_QUESTION_ALL = db_.TBL_R_QUESTION_ALLs.Where(P => P.QUESTION_ID.Equals(item.QUESTION_ID.ToString())).FirstOrDefault();
                        db_.TBL_R_QUESTION_ALLs.DeleteOnSubmit(i_TBL_R_QUESTION_ALL);
                        db_.SubmitChanges();
                    }
                    return this.Json(new { type = "SUCCESS", message = "Data Berhasil dihapus!" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new { type = "ERROR", message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public async Task<JsonResult> Upload(string sSession, string sMODULE_ID, string sMODULE_SUB_ID, string sEGI_GENERAL, string sSOALTIPE, string sPOSISI , int sQType)
        {
            this.pv_CustLoadSession();
            var iStrRemark = string.Empty;

            try
            {
                object[,] obj = null;
                int noOfCol = 0;
                int noOfRow = 0;
                HttpFileCollectionBase file = Request.Files;
                if ((file != null) && (file.Count > 0))
                {
                    //string fileName = file.FileName;
                    //string fileContentType = file.ContentType;
                    byte[] fileBytes = new byte[Request.ContentLength];
                    var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));
                    using (var package = new ExcelPackage(Request.InputStream))
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        noOfCol = workSheet.Dimension.End.Column;
                        noOfRow = workSheet.Dimension.End.Row;
                        obj = new object[noOfRow, noOfCol];
                        obj = (object[,])workSheet.Cells.Value;
                    }
                }
                //Debug.WriteLine(noOfRow - 5);
                string[,] source = ExcelToArray(obj, 17, (noOfRow - 5), noOfCol);

                bool insert = iClsSoalEssay.ExcelArrayDB((noOfRow - 5), source, sMODULE_ID, sMODULE_SUB_ID, sEGI_GENERAL, sSession, sSOALTIPE, sPOSISI , sQType);
                db_.CariJawabanSoal();
                iStrRemark = "Upload Success";
                return this.Json(new
                {
                    status = insert,
                    remarks = iStrRemark
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new
                {
                    status = false,
                    remarks = e.ToString() + "Upload Failed !"
                }, JsonRequestBehavior.AllowGet);
            }
        }


        private string[,] ExcelToArray(object[,] obj, int start, int rows, int cols)
        {
            int jumlahrow = obj.Length / cols;
            string[,] result = new string[(jumlahrow), (cols)];

            int z = 0;
            int actual = 0;
            int sindex = 0;

            foreach (object element in obj)
            {
                if (z >= start)
                {
                    if (z == (start + cols))
                    {
                        actual++;
                        start += cols;
                        sindex = 0;
                    }

                    if (element != null)
                    {
                        result[actual, sindex] = element.ToString();
                    }
                    sindex++;
                }
                z++;
            }

            return result;
        }

        [HttpPost]
        public ActionResult AJaxReadUpload(string sSession, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var iTbl = db_.TBL_TMP_QUESTION_ALLs.Where(f => f.SESSION == sSession);
                return this.Json(iTbl.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(e.ToString());
            }
        }

        [HttpPost]
        public ActionResult AJaxSaveUpload(string SESS_ID)
        {
            var iStrDataUploadSucses = string.Empty;

            try
            {
                db_.cusp_insert_QuestionEssay(SESS_ID);
                db_.CariJawabanSoal();
                return Json(new { status = true, remarks = "Insert Success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AJaxCancelUpload(string SESS_ID)
        {
            var iStrDataUploadSucses = string.Empty;

            try
            {
                db_.cusp_cancel_InputQuestionEssay(SESS_ID);
                return Json(new { status = true, remarks = "Insert Batal" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}