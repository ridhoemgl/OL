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
using System.Web.UI.WebControls;
using System.Web.UI;

namespace OPR_OCEL_Enhance.Controllers.Report
{
    public class ResultsExamController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private ClsInputRegistration iClsInputRegistration = new ClsInputRegistration();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;
        public string base_url = ConfigurationManager.AppSettings["urlAppPath"];

        // GET: ResultsExam
        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.pathParent = base_url;
                ViewBag.leftMenu = loadMenu();
                return View();
            }
            
        }

        public ActionResult BelumTerselesaikan()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.pathParent = base_url;
                ViewBag.leftMenu = loadMenu();
                return View();
            }

        }

        public ActionResult graduationRecapitulation()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }

            ViewBag.baseurl = base_url;
            ViewBag.leftMenu = loadMenu();
            return View();
        }

        [HttpPost]
        public bool Running_cusp_repl_dump_VW_NOT_COMPLETE_EXAM()
        {
            db_.cusp_dumping_belum_selesai_ujian();
            return true;
        }

        [HttpPost]
        public bool Running_cusp_repl_dump_VW_RESULT_HASIL_UJIAN()
        {
            db_.cusp_repl_dump_VW_RESULT_HASIL_UJIAN();
            return true;
        }

        [HttpPost]
        public ActionResult getYear()
        {
            try
            {
                var getYearReport = db_.VW_RESULT_HASIL_UJIAN_RESULTs.Select(a => new { a.YEAR_EXAM }).ToList().Distinct().OrderByDescending(a=>a.YEAR_EXAM);
                return Json(new { data = getYearReport, status = true });
            }
            catch (Exception)
            {

                return Json(new {  status = false });
            }
        }

        public ActionResult Report_printer(string MOD , string REG)
        {
            this.pv_CustLoadSession();

            ViewBag.MOD = MOD;
            ViewBag.REG = REG;

            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.pathParent = base_url;
                var data = db_.TBL_T_DUMP_VW_RESULT_HASIL_UJIANs.Where(ob => ob.REGISTRATION_ID.Equals(REG) && ob.MODULE_ID.Equals(MOD));

                try
                {
                    var swich = db_.VW_T_SWICH_ASESORs.Where(d => d.REGISTRATION_ID.Equals(REG)).FirstOrDefault();

                    if (swich.NAMA_ASESOR != null)
                    {
                        foreach (var item in data)
                        {
                            item.CERTIFICATOR_NAME = swich.NAMA_ASESOR;
                            item.CERTIFICATOR_ID = swich.NRP_ASESOR;
                        }
                    }
                }
                catch
                {
                    Console.WriteLine("Asesor tidak diganti");
                }
                

                ViewBag.Resultdata = data;
                var dates = db_.TBL_T_REGISTRATIONs.Where(s => s.REGISTRATION_ID.Equals(REG)).First();

                ViewBag.TanggalUjan_mulai = dates.EXAM_ACTUAL_DATE;
                ViewBag.TanggalUjan_selesai = dates.EXAM_FINISH_TIME;

                ViewBag.Conclution = db_.TBL_T_DUMP_VW_RESULT_HASIL_UJIANs.Where(f => f.REGISTRATION_ID.Equals(REG) && f.MODULE_ID.Equals(MOD)).First().EXAM_STATUS;
                return View();
            }
        }

        [HttpPost]
        public JsonResult GetDataUjian(string REG)
        {
            var RegistrationData = db_.VW_EMPLOYEE_HISTORICAL_EXAMs.Where(n => n.REGISTRATION_ID.Equals(REG)).Distinct().ToList();
           
            return this.Json(new { RegistrationData = RegistrationData , size = RegistrationData.Count});
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

        //[HttpPost]
        //public ActionResult ReadPermintaanUjian(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        //{
        //    this.pv_CustLoadSession();
        //    try
        //    {
        //        string previlege = Session["GP"].ToString();
        //        int parse_prevlege = Int32.Parse(previlege);
        //        string ses_nrp = Session["NRP"].ToString();

        //        string sess = Session["distrik"].ToString();

        //        if (sess.Contains("JIEP") || sess.Contains("ALL"))
        //        {

        //            if (parse_prevlege.Equals(1) || parse_prevlege.Equals(5))
        //            {
        //                IQueryable<VW_RESULT_HASIL_UJIAN> i_ReadPermintaanUjian = db_.VW_RESULT_HASIL_UJIANs;
        //                return Json(i_ReadPermintaanUjian.ToDataSourceResult(take, skip, sort, filter));
        //            }
        //            else
        //            {
        //                IQueryable<VW_RESULT_HASIL_UJIAN> i_ReadPermintaanUjian = db_.VW_RESULT_HASIL_UJIANs.Where(s => s.STUDENT_ID.Equals(ses_nrp));
        //                return Json(i_ReadPermintaanUjian.ToDataSourceResult(take, skip, sort, filter));
        //            }
        //        }
        //        else
        //        {
        //            if (parse_prevlege.Equals(1) || parse_prevlege.Equals(5))
        //            {
        //                IQueryable<VW_RESULT_HASIL_UJIAN> i_ReadPermintaanUjian_o = db_.VW_RESULT_HASIL_UJIANs.Where(s => s.STUDENT_ID.Equals(sess));
        //                return Json(i_ReadPermintaanUjian_o.ToDataSourceResult(take, skip, sort, filter));
        //            }
        //            else
        //            {
        //                IQueryable<VW_RESULT_HASIL_UJIAN> i_ReadPermintaanUjian_o = db_.VW_RESULT_HASIL_UJIANs.Where(s => s.STUDENT_ID.Equals(ses_nrp) && s.TEST_CENTER_ID.Equals(string.Concat(sess,"-OCEL")));
        //                return Json(i_ReadPermintaanUjian_o.ToDataSourceResult(take, skip, sort, filter));
        //            }
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public ActionResult readHasilUjian(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<TBL_T_DUMP_VW_RESULT_HASIL_UJIAN> i_tbl_ = db_.TBL_T_DUMP_VW_RESULT_HASIL_UJIANs.OrderBy(datax => datax.STUDENT_ID).ThenBy(s => s.STARTS_DATE);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult readHasilUjianSearch(string position , string type, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<VW_FINAL_RESULT_UJIAN> i_tbl_ = db_.VW_FINAL_RESULT_UJIANs.Where(obj => obj.POSITION_CODE.Equals(position) && obj.JENIS_UJIAN_DESC.Equals(type)).OrderBy(datax => datax.STUDENT_ID).ThenBy(s => s.STARTS_DATE);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult readHasilUjianNotYet(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<TBL_T_DUMP_NOT_COMPLETE_EXAM> i_tbl_ = db_.TBL_T_DUMP_NOT_COMPLETE_EXAMs.OrderBy(datax => datax.STUDENT_ID).ThenBy(s => s.STARTS_DATE);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ExportToExcelYet(string app_code, string jenis_ujian, bool is_download_all)
        {
            var gv = new GridView();

            if (is_download_all)
            {
                gv.DataSource = db_.TBL_T_DUMP_NOT_COMPLETE_EXAMs
                .Select(x => new
                {
                    NRP = x.STUDENT_ID,
                    NAMA = x.NAME,
                    DISTRIK = x.DSTRCT_CODE,
                    POSISI_APP = x.KODE_POSISI_APP,
                    UJIAN = x.JENIS_UJIAN_DESC,
                    UNIT_KOMPETENSI = x.MODULE_NAME,
                    x.EGI,
                    SESI = x.EVENT_ID,
                    KD_REGISTER = x.REGISTRATION_ID,
                    NRP_SERTIFIKATOR = x.CERTIFICATOR_ID,
                    NAMA_UJIAN =  x.NAMA_UJIAN,
                    TGL_MULAI = x.STARTS_DATE,
                    TGL_SELESAI = x.FINISH_DATE,
                    JENIS_UJIAN = x.JENIS_UJIAN_DESC,
                    TGL_DIREGISTRASIKAN = x.TGL_REGISTRASI,
                    LOKASI_TES = x.TEST_CENTER
                })
                .OrderBy(datax => datax.NRP).ThenBy(s => s.TGL_MULAI);
                gv.DataBind();
            }
            else
            {
                gv.DataSource = db_.TBL_T_DUMP_NOT_COMPLETE_EXAMs
                .Select(x => new
                {
                    NRP = x.STUDENT_ID,
                    NAMA = x.NAME,
                    DISTRIK = x.DSTRCT_CODE,
                    POSISI_APP = x.KODE_POSISI_APP,
                    UJIAN = x.JENIS_UJIAN_DESC,
                    UNIT_KOMPETENSI = x.MODULE_NAME,
                    x.EGI,
                    NRP_SERTIFIKATOR = x.CERTIFICATOR_ID,
                    NAMA_UJIAN = x.NAMA_UJIAN,
                    TGL_MULAI = x.STARTS_DATE,
                    JENIS_UJIAN = x.JENIS_UJIAN_DESC,
                    TGL_DIREGISTRASIKAN = x.TGL_REGISTRASI,
                    LOKASI_TES = x.TEST_CENTER
                })
                .Where(s => s.POSISI_APP.Equals(app_code) && s.JENIS_UJIAN.Equals(jenis_ujian))
                .OrderBy(datax => datax.NRP).ThenBy(s => s.TGL_MULAI);
                gv.DataBind();
            }

            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=Data Peserta Belum Selesai Ujian.xls");
            Response.ContentType = "application/ms-excel";

            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);

            gv.RenderControl(objHtmlTextWriter);

            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();

            return View("Index");
        }

        public ActionResult ExportToExcel(string app_code  , string jenis_ujian , bool is_download_all)
        {
            var gv = new GridView();

            if (is_download_all)
            {
                gv.DataSource = db_.VW_FINAL_RESULT_UJIANs
                .Select(x => new
                {
                    NRP = x.STUDENT_ID,
                    NAMA = x.NAME,
                    DISTRIK = x.DSTRCT_CODE,
                    POSISI_APP = x.POSITION_CODE,
                    UJIAN = x.JENIS_UJIAN_DESC,
                    UNIT_KOMPETENSI = x.UNIT_COMPETENCY,
                    x.EGI,
                    HASIL = x.RESULT_EXAM,
                    SESI = x.EVENT_ID,
                    KD_REGISTER = x.REGISTRATION_ID,
                    NRP_SERTIFIKATOR = x.CERTIFICATOR_ID,
                    NAMA_SERTIFIKATOR = x.CERTIFICATOR_NAME,
                    TGL_MULAI = x.STARTS_DATE,
                    TGL_SELESAI = x.FINISH_DATE,
                    JENIS_UJIAN = x.JENIS_UJIAN_DESC,
                    TGL_DIREGISTRASIKAN = x.CREATE_DATE_TIME
                })
                .OrderBy(datax => datax.NRP).ThenBy(s => s.TGL_MULAI);
            gv.DataBind();
            }
            else
            {
                gv.DataSource = db_.VW_FINAL_RESULT_UJIANs
                .Select(x => new
                {
                    NRP = x.STUDENT_ID,
                    NAMA = x.NAME,
                    DISTRIK = x.DSTRCT_CODE,
                    POSISI_APP = x.POSITION_CODE,
                    UJIAN = x.JENIS_UJIAN_DESC,
                    UNIT_KOMPETENSI = x.UNIT_COMPETENCY,
                    x.EGI,
                    HASIL = x.RESULT_EXAM,
                    SESI = x.EVENT_ID,
                    KD_REGISTER = x.REGISTRATION_ID,
                    NRP_SERTIFIKATOR = x.CERTIFICATOR_ID,
                    NAMA_SERTIFIKATOR = x.CERTIFICATOR_NAME,
                    TGL_MULAI = x.STARTS_DATE,
                    TGL_SELESAI = x.FINISH_DATE,
                    JENIS_UJIAN = x.JENIS_UJIAN_DESC,
                    TGL_DIREGISTRASIKAN = x.CREATE_DATE_TIME
                })
                .Where(s => s.POSISI_APP.Equals(app_code) && s.JENIS_UJIAN.Equals(jenis_ujian))
                .OrderBy(datax => datax.NRP).ThenBy(s => s.TGL_MULAI);
                gv.DataBind();
            }
            
            Response.ClearContent();
            Response.Buffer = true;
            Response.AddHeader("content-disposition", "attachment; filename=Data Peserta Selesai Ujian.xls");
            Response.ContentType = "application/ms-excel";

            Response.Charset = "";
            StringWriter objStringWriter = new StringWriter();
            HtmlTextWriter objHtmlTextWriter = new HtmlTextWriter(objStringWriter);

            gv.RenderControl(objHtmlTextWriter);

            Response.Output.Write(objStringWriter.ToString());
            Response.Flush();
            Response.End();

            return View("Index");
        }



        [HttpPost]
        public ActionResult readBelumSelesaiSearch(string position, string type, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<TBL_T_DUMP_NOT_COMPLETE_EXAM> i_tbl_ = db_.TBL_T_DUMP_NOT_COMPLETE_EXAMs.Where(obj => obj.KODE_POSISI_APP.Equals(position) && obj.JENIS_UJIAN_DESC.Equals(type)).OrderBy(datax => datax.STUDENT_ID).ThenBy(s => s.STARTS_DATE);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}