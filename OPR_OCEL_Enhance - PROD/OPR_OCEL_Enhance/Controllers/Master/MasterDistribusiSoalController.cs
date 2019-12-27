using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Master
{
    public class MasterDistribusiSoalController : Controller
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
            if (Session["NRP"] == null || Int32.Parse(Session["GP"].ToString()).Equals(4))
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
        
        public JsonResult readModule()
        {
            var i_tbl = db_.TBL_R_MODULEs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownPosition()
        {
            var i_tbl = db_.TBL_M_POSITION_APPs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownModul()
        {
            var i_tbl = db_.TBL_R_MODULEs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownModulbyId(string position_code)
        {
            var i_tbl = db_.VW_MODULE_POSITIONs.Where(p => p.POSITION_CODE.Equals(position_code));
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownEGIbyId(string modul_id)
        {
            var i_tbl = db_.VW_MODULE_EGIs.Where(p => p.MODULE_ID.Equals(modul_id));
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownEGI()
        {
            var i_tbl = db_.TBL_M_EGIs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }

        public JsonResult dropdownSubModule()
        {
            var i_tbl = db_.TBL_R_MODULE_SUBs;
            return this.Json(new { Data = i_tbl, Total = i_tbl.Count() });
        }
        
        [HttpPost]
        public ActionResult readDistribusiSoal(string s_moduleId, string s_posisiId, string s_egiID, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            
            try
            {
                //Auto insert untuk data baru
                db_.cusp_InsertCompetencyMatrix(s_posisiId, s_moduleId, s_egiID, iStrSessNRP);

                IQueryable<VW_REKAP_JUMLAH_SOAL> i_tbl_ = db_.VW_REKAP_JUMLAH_SOALs.Where(p => p.MODULE_ID.Equals(s_moduleId) && p.POSITION_CODE.Equals(s_posisiId) && p.EGI.Equals(s_egiID));
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult createcreateDistribusiSoal(VW_T_COMPETENCY_MATRIX sVW_T_COMPETENCY_MATRIX)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_T_COMPETENCY_MATRIX iTBL_T_COMPETENCY_MATRIX = new TBL_T_COMPETENCY_MATRIX();

                iTBL_T_COMPETENCY_MATRIX.PID_CM = Guid.NewGuid().ToString();
                iTBL_T_COMPETENCY_MATRIX.POSITION_CODE = sVW_T_COMPETENCY_MATRIX.POSITION_CODE;
                iTBL_T_COMPETENCY_MATRIX.MODULE_ID = sVW_T_COMPETENCY_MATRIX.MODULE_ID;
                iTBL_T_COMPETENCY_MATRIX.EGI_CODE = sVW_T_COMPETENCY_MATRIX.EGI_CODE;
                iTBL_T_COMPETENCY_MATRIX.MODULE_SUB_ID = sVW_T_COMPETENCY_MATRIX.MODULE_SUB_ID;
                iTBL_T_COMPETENCY_MATRIX._P0 = sVW_T_COMPETENCY_MATRIX._P0;
                iTBL_T_COMPETENCY_MATRIX._P1 = sVW_T_COMPETENCY_MATRIX._P1;
                iTBL_T_COMPETENCY_MATRIX._P2 = sVW_T_COMPETENCY_MATRIX._P2;
                iTBL_T_COMPETENCY_MATRIX._P3 = sVW_T_COMPETENCY_MATRIX._P3;
                iTBL_T_COMPETENCY_MATRIX._P4 = sVW_T_COMPETENCY_MATRIX._P4;
                iTBL_T_COMPETENCY_MATRIX._P5 = sVW_T_COMPETENCY_MATRIX._P5;
                iTBL_T_COMPETENCY_MATRIX._P6 = sVW_T_COMPETENCY_MATRIX._P6;
                iTBL_T_COMPETENCY_MATRIX._P7 = sVW_T_COMPETENCY_MATRIX._P7;
                iTBL_T_COMPETENCY_MATRIX._P8 = sVW_T_COMPETENCY_MATRIX._P8;
                iTBL_T_COMPETENCY_MATRIX._P9 = sVW_T_COMPETENCY_MATRIX._P9;
                iTBL_T_COMPETENCY_MATRIX._3C = sVW_T_COMPETENCY_MATRIX._3C;
                iTBL_T_COMPETENCY_MATRIX._3D = sVW_T_COMPETENCY_MATRIX._3D;
                iTBL_T_COMPETENCY_MATRIX._3E = sVW_T_COMPETENCY_MATRIX._3E;
                iTBL_T_COMPETENCY_MATRIX._3F = sVW_T_COMPETENCY_MATRIX._3F;
                iTBL_T_COMPETENCY_MATRIX._4A = sVW_T_COMPETENCY_MATRIX._4A;
                iTBL_T_COMPETENCY_MATRIX._4B = sVW_T_COMPETENCY_MATRIX._4B;
                iTBL_T_COMPETENCY_MATRIX._4C = sVW_T_COMPETENCY_MATRIX._4C;
                iTBL_T_COMPETENCY_MATRIX._4D = sVW_T_COMPETENCY_MATRIX._4D;
                iTBL_T_COMPETENCY_MATRIX._4E = sVW_T_COMPETENCY_MATRIX._4E;
                iTBL_T_COMPETENCY_MATRIX._4F = sVW_T_COMPETENCY_MATRIX._4F;
                iTBL_T_COMPETENCY_MATRIX.ISACTIVE = sVW_T_COMPETENCY_MATRIX.ISACTIVE;
                iTBL_T_COMPETENCY_MATRIX.CREATE_BY = iStrSessNRP;
                iTBL_T_COMPETENCY_MATRIX.CREATE_DATE = DateTime.Now;

                db_.TBL_T_COMPETENCY_MATRIXes.InsertOnSubmit(iTBL_T_COMPETENCY_MATRIX);
                db_.SubmitChanges();
                db_.Dispose();


                return Json(new { status = true, remarks = "Data berhasil disimpan", error = string.Empty });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" , error = e.ToString()});

            }
        }

        [HttpPost]
        public JsonResult AjaxUpdate(TBL_T_COMPETENCY_MATRIX S_TBL_T_COMPETENCY_MATRIX)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_T_COMPETENCY_MATRIX iTBL_T_COMPETENCY_MATRIX = db_.TBL_T_COMPETENCY_MATRIXes.Where(p => p.PID_CM.Equals(S_TBL_T_COMPETENCY_MATRIX.PID_CM)).FirstOrDefault();

                //iTBL_T_COMPETENCY_MATRIX.POSITION_CODE = S_TBL_T_COMPETENCY_MATRIX.POSITION_CODE;
                //iTBL_T_COMPETENCY_MATRIX.MODULE_ID = S_TBL_T_COMPETENCY_MATRIX.MODULE_ID;
                //iTBL_T_COMPETENCY_MATRIX.EGI_CODE = S_TBL_T_COMPETENCY_MATRIX.EGI_CODE;
                //iTBL_T_COMPETENCY_MATRIX.MODULE_SUB_ID = S_TBL_T_COMPETENCY_MATRIX.MODULE_SUB_ID;
                iTBL_T_COMPETENCY_MATRIX._P0 = S_TBL_T_COMPETENCY_MATRIX._P0;
                iTBL_T_COMPETENCY_MATRIX._P1 = S_TBL_T_COMPETENCY_MATRIX._P1;
                iTBL_T_COMPETENCY_MATRIX._P2 = S_TBL_T_COMPETENCY_MATRIX._P2;
                iTBL_T_COMPETENCY_MATRIX._P3 = S_TBL_T_COMPETENCY_MATRIX._P3;
                iTBL_T_COMPETENCY_MATRIX._P4 = S_TBL_T_COMPETENCY_MATRIX._P4;
                iTBL_T_COMPETENCY_MATRIX._P5 = S_TBL_T_COMPETENCY_MATRIX._P5;
                iTBL_T_COMPETENCY_MATRIX._P6 = S_TBL_T_COMPETENCY_MATRIX._P6;
                iTBL_T_COMPETENCY_MATRIX._P7 = S_TBL_T_COMPETENCY_MATRIX._P7;
                iTBL_T_COMPETENCY_MATRIX._P8 = S_TBL_T_COMPETENCY_MATRIX._P8;
                iTBL_T_COMPETENCY_MATRIX._P9 = S_TBL_T_COMPETENCY_MATRIX._P9;
                iTBL_T_COMPETENCY_MATRIX._3C = S_TBL_T_COMPETENCY_MATRIX._3C;
                iTBL_T_COMPETENCY_MATRIX._3D = S_TBL_T_COMPETENCY_MATRIX._3D;
                iTBL_T_COMPETENCY_MATRIX._3E = S_TBL_T_COMPETENCY_MATRIX._3E;
                iTBL_T_COMPETENCY_MATRIX._3F = S_TBL_T_COMPETENCY_MATRIX._3F;
                iTBL_T_COMPETENCY_MATRIX._4A = S_TBL_T_COMPETENCY_MATRIX._4A;
                iTBL_T_COMPETENCY_MATRIX._4B = S_TBL_T_COMPETENCY_MATRIX._4B;
                iTBL_T_COMPETENCY_MATRIX._4C = S_TBL_T_COMPETENCY_MATRIX._4C;
                iTBL_T_COMPETENCY_MATRIX._4D = S_TBL_T_COMPETENCY_MATRIX._4D;
                iTBL_T_COMPETENCY_MATRIX._4E = S_TBL_T_COMPETENCY_MATRIX._4E;
                iTBL_T_COMPETENCY_MATRIX._4F = S_TBL_T_COMPETENCY_MATRIX._4F;
                iTBL_T_COMPETENCY_MATRIX.ISACTIVE = S_TBL_T_COMPETENCY_MATRIX.ISACTIVE;
                iTBL_T_COMPETENCY_MATRIX.MODIF_BY = iStrSessNRP;
                iTBL_T_COMPETENCY_MATRIX.MODIF_DATE = DateTime.Now;

                db_.SubmitChanges();
                return this.Json(new { remarks = "Update Success", status = true });

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", remarks = "Update Failed " + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult deleteDistribusiSoal(TBL_T_COMPETENCY_MATRIX S_TBL_T_COMPETENCY_MATRIX)
        {
            this.pv_CustLoadSession();

            try
            {
                TBL_T_COMPETENCY_MATRIX i_tbl = db_.TBL_T_COMPETENCY_MATRIXes.Where(p => p.PID_CM.Equals(S_TBL_T_COMPETENCY_MATRIX.PID_CM)).FirstOrDefault();

                db_.TBL_T_COMPETENCY_MATRIXes.DeleteOnSubmit(i_tbl);
                db_.SubmitChanges();

                return this.Json(new { remarks = "Delete Success", status = true });

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", remarks = "Delete Failed " + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
	}
}