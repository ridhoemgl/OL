using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.BankSoal
{
    public class KelompokSoalController : Controller
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
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
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

        public JsonResult dropdownPosition()
        {
            var i_tbl = db_.TBL_M_POSITION_APPs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownJenisUjian()
        {
            var i_tbl = db_.TBL_R_JENIS_UJIANs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownTypeSoal()
        {
            var i_tbl = db_.TBL_R_TYPE_SOALs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownModule(string position_code)
        {
            

            VW_MODULE_POSITION obj = new VW_MODULE_POSITION();
            obj.PID_PM = Guid.NewGuid().ToString();
            obj.MODULE_PID = "00";
            obj.MODULE_NAME = "Pilih Module";
            obj.POSITION_CODE = "PC0000";
            obj.POSITION_DESC = "Pilih posisi";
            obj.ISACTIVE = true;

            List<VW_MODULE_POSITION> i_tbl = db_.VW_MODULE_POSITIONs.Where(p => p.POSITION_CODE.Equals(position_code)).ToList();

            i_tbl.Add(obj);

            return this.Json(new { Data = i_tbl.OrderByDescending(s => s.POSITION_DESC), Total = i_tbl.Count() });
        }

        public JsonResult dropdownEgi(string modul_id)
        {
            var i_tbl = db_.VW_MODULE_EGIs.Where(p => p.MODULE_ID.Equals(modul_id));
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }
        
        [HttpPost]
        public JsonResult AjaxReadKelompokSoal(string s_position_code, string s_module, string s_Egi, string s_type_soal, string s_ujian_code, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {

                db_.cusp_kelompokSoalCreate(s_position_code, s_module, s_Egi, s_type_soal, s_ujian_code, iStrSessNRP);

                //var i_kelWaktu = db_.cufn_getKelompokSoal(s_position_code, s_module, s_Egi, s_type_soal, s_ujian_code);
                var i_DataQuestion = db_.VW_KELOMPOK_SOALs.Where(p => p.POSITION_CODE.Equals(s_position_code)
                                                                    && p.MODULE_ID.Equals(s_module)
                                                                    && p.EGI_CODE.Equals(s_Egi)
                                                                    && p.TYPE_CODE.Equals(s_type_soal)
                                                                    && p.JENIS_UJIAN_CODE.Equals(s_ujian_code));

                return Json(i_DataQuestion.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetData_ToChart(string s_position_code, string s_module, string s_Egi, string s_type_soal, string s_ujian_code)
        {
            var i_DataQuestion = db_.VW_KELOMPOK_SOALs.Where(p => p.POSITION_CODE.Equals(s_position_code)
                                                                    && p.MODULE_ID.Equals(s_module)
                                                                    && p.EGI_CODE.Equals(s_Egi)
                                                                    && p.TYPE_CODE.Equals(s_type_soal)
                                                                    && p.JENIS_UJIAN_CODE.Equals(s_ujian_code));

            return Json(i_DataQuestion);
        }

        [HttpPost]
        public bool cancelsubmit(string SESS_CODE)
        {
             pv_CustLoadSession();
             try
             {
                 db_.cusp_cancel_InputMapping(SESS_CODE);
                 return true;
             }
             catch (Exception)
             {
                 return false;
             }
        }

        [HttpPost]
        public JsonResult AjaxUpdateKelompoktSoal(TBL_M_KELOMPOK_SOAL sTBL_M_KELOMPOK_SOAL)
        {
            pv_CustLoadSession();
            
            try
            {
                TBL_M_KELOMPOK_SOAL i_TBL_M_KELOMPOK_SOAL = db_.TBL_M_KELOMPOK_SOALs.Where(p => p.PID.Equals(sTBL_M_KELOMPOK_SOAL.PID)).FirstOrDefault();

                i_TBL_M_KELOMPOK_SOAL._P0 = sTBL_M_KELOMPOK_SOAL._P0;
                i_TBL_M_KELOMPOK_SOAL._P1 = sTBL_M_KELOMPOK_SOAL._P1;
                i_TBL_M_KELOMPOK_SOAL._P2 = sTBL_M_KELOMPOK_SOAL._P2;
                i_TBL_M_KELOMPOK_SOAL._P3 = sTBL_M_KELOMPOK_SOAL._P3;
                i_TBL_M_KELOMPOK_SOAL._P4 = sTBL_M_KELOMPOK_SOAL._P4;
                i_TBL_M_KELOMPOK_SOAL._P5 = sTBL_M_KELOMPOK_SOAL._P5;
                i_TBL_M_KELOMPOK_SOAL._P6 = sTBL_M_KELOMPOK_SOAL._P6;
                i_TBL_M_KELOMPOK_SOAL._P7 = sTBL_M_KELOMPOK_SOAL._P7;
                i_TBL_M_KELOMPOK_SOAL._P8 = sTBL_M_KELOMPOK_SOAL._P8;
                i_TBL_M_KELOMPOK_SOAL._P9 = sTBL_M_KELOMPOK_SOAL._P9;
                i_TBL_M_KELOMPOK_SOAL._2C = sTBL_M_KELOMPOK_SOAL._2C;
                i_TBL_M_KELOMPOK_SOAL._2D = sTBL_M_KELOMPOK_SOAL._2D;
                i_TBL_M_KELOMPOK_SOAL._2E = sTBL_M_KELOMPOK_SOAL._2E;
                i_TBL_M_KELOMPOK_SOAL._2F = sTBL_M_KELOMPOK_SOAL._2F;
                i_TBL_M_KELOMPOK_SOAL._3A = sTBL_M_KELOMPOK_SOAL._3A;
                i_TBL_M_KELOMPOK_SOAL._3B = sTBL_M_KELOMPOK_SOAL._3B;
                i_TBL_M_KELOMPOK_SOAL._3C = sTBL_M_KELOMPOK_SOAL._3C;
                i_TBL_M_KELOMPOK_SOAL._3D = sTBL_M_KELOMPOK_SOAL._3D;
                i_TBL_M_KELOMPOK_SOAL._3E = sTBL_M_KELOMPOK_SOAL._3E;
                i_TBL_M_KELOMPOK_SOAL._3F = sTBL_M_KELOMPOK_SOAL._3F;
                i_TBL_M_KELOMPOK_SOAL._4A = sTBL_M_KELOMPOK_SOAL._4A;
                i_TBL_M_KELOMPOK_SOAL._4B = sTBL_M_KELOMPOK_SOAL._4B;
                i_TBL_M_KELOMPOK_SOAL._4C = sTBL_M_KELOMPOK_SOAL._4C;
                i_TBL_M_KELOMPOK_SOAL._4D = sTBL_M_KELOMPOK_SOAL._4D;
                i_TBL_M_KELOMPOK_SOAL._4E = sTBL_M_KELOMPOK_SOAL._4E;
                i_TBL_M_KELOMPOK_SOAL._4F = sTBL_M_KELOMPOK_SOAL._4F;
                i_TBL_M_KELOMPOK_SOAL.IsActive = sTBL_M_KELOMPOK_SOAL.IsActive;

                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Update gagal!" + e.ToString() });
            }
        }

	
        
	}
}