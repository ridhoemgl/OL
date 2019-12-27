using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models;
using OPR_OCEL_Enhance.Models.viewmodels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers
{
    public class HistoricalExamDetailsController : Controller
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

            ViewBag.leftMenu = loadMenu();

            return View();
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
        public JsonResult GetAnalizeOn_Participan(int Q_TYPE , string NRP , string MODULE_id,string SESI , string REG_ID)
        {
            if (Q_TYPE.Equals(1) || Q_TYPE.Equals(2))
            {
                var data = db_.Analyze_UserAnswer_MultipleChoise(Q_TYPE,NRP,MODULE_id,SESI, REG_ID).OrderBy(n => n.IS_COUNT_BY_SYS).ThenBy(n => n.MODULE_SUB_ID).ToList();
                int Should_be_onAfter = Convert.ToInt32(data.AsEnumerable().Where(s => s.IS_COUNT_BY_SYS.Equals(1)).Sum(x => x.AFTER_WEIGHTING).GetValueOrDefault());
                int Should_be_onBefore = Convert.ToInt32(data.AsEnumerable().Where(s => s.IS_COUNT_BY_SYS.Equals(1)).Sum(x => x.TOT_VALUE).GetValueOrDefault());

                try
                {
                    return this.Json(new { error = false, data = data  , Val_be_onAfter = Should_be_onAfter , Val_be_onBefore = Should_be_onBefore , MULTIPLECHOISE = true });
                }
                catch (Exception ex)
                {
                    return Json(new { error = true, remarks = "Sepertinya ada masalah pada komputer Anda, sistem gagal terkoneksi ke server", type = "red", hearder = "FAILED", error_type = ex.GetType().Name, error_message = ex.Message });
                }
            }
            else if (Q_TYPE.Equals(3) || Q_TYPE.Equals(4))
            {
                var data = db_.Analyze_UserAnswer_EssayType(Q_TYPE, NRP, MODULE_id, SESI, REG_ID).Where(souruces => souruces.JENIS_SOAL.Equals(Q_TYPE)).OrderBy(n => n.IS_COUNT_BY_SYS).ThenBy(n => n.MODULE_SUB_ID).Distinct().ToList();
                int Jm_Soal = data.AsEnumerable().Where(s => s.JENIS_SOAL.Equals(Q_TYPE)).Sum(x => x.COUNT_QUESTION).GetValueOrDefault();
                int Should_be_onAfter = Convert.ToInt32(data.AsEnumerable().Where(s => s.IS_COUNT_BY_SYS.Equals(1)).Sum(x => x.AFTER_WEIGHTING).GetValueOrDefault());
                int Should_be_onBefore = Convert.ToInt32(data.AsEnumerable().Where(s => s.IS_COUNT_BY_SYS.Equals(1)).Sum(x => x.TOT_VALUE).GetValueOrDefault());
                int MaxMultiply = db_.TBL_R_TYPE_SOALs.Where(s => s.TYPE_CODE.Equals(Q_TYPE)).First().MAX_MULTIPLY;

                //var list_QTYPE = data.Select(a => new { a.JENIS_SOAL }).Distinct().ToList();
                //decimal j_data_ontype = Math.Ceiling(Convert.ToDecimal(data.Count()) / Convert.ToDecimal(list_QTYPE.Count()));
                //vmd_essay_split_results_byQTYPE[,] splits_data = new vmd_essay_split_results_byQTYPE[list_QTYPE.Count() , 10]; // diasumsikan setiap peserta mendapatkan maksimal 10 submodul
                //int h_idex = 0;
                //foreach (var item in list_QTYPE)
                //{
                //    var by_qtype_data = data.Where(g => g.JENIS_SOAL.Equals(Convert.ToInt32(item.JENIS_SOAL)));
                //    int z_index = 0;
                //    foreach (var r_data in by_qtype_data)
                //    {
                //        splits_data[h_idex, z_index] = new vmd_essay_split_results_byQTYPE();
                //        splits_data[h_idex, z_index].MODULE_SUB_ID = r_data.MODULE_SUB_ID;
                //        splits_data[h_idex, z_index].MODULE_SUB_NAME = r_data.MODULE_SUB_NAME;
                //        splits_data[h_idex, z_index].JENIS_SOAL = Convert.ToInt32 (r_data.JENIS_SOAL);
                //        splits_data[h_idex, z_index].IS_COUNT_BY_SYS = Convert.ToInt32 (r_data.IS_COUNT_BY_SYS);
                //        splits_data[h_idex, z_index].COUNT_QUESTION = Convert.ToInt32 (r_data.COUNT_QUESTION);
                //        splits_data[h_idex, z_index].TOT_VALUE = Convert.ToInt32 (r_data.TOT_VALUE);
                //        splits_data[h_idex, z_index].WEIGHT = Convert.ToInt32 (r_data.WEIGHT);
                //        splits_data[h_idex, z_index].AFTER_WEIGHTING = Convert.ToInt32 (r_data.AFTER_WEIGHTING);
                //        z_index++;
                //    }
                //    h_idex++;
                //}

                return this.Json(new { error = false, data = data, Jumlah_Soal = Jm_Soal , Val_be_onAfter = Should_be_onAfter , Should_be_onBefore = Should_be_onBefore , MaxMultiply = MaxMultiply, MULTIPLECHOISE = false});
            }
            else
            {
                return Json(new { error = true, remarks = "Maaf Formula Belum Tersedia Oleh Pengembang", type = "red", hearder = "FAILED", error_type = "NULL FORMULA", error_message = string.Empty });
            }
        }

        [HttpPost]
        public JsonResult AjaxGetHistory(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                string sess = Session["distrik"].ToString();

                if ((sess.Equals("JIEP") || sess.Equals("ALL")))
                {
                    var i_Data_history = db_.VW_EMPLOYEE_HISTORICAL_EXAMs.Where(s => s.EXAM_STATUS.Equals(5)).Distinct();
                    return Json(i_Data_history.ToDataSourceResult(take, skip, sort, filter));
                }
                else
                {
                    var i_Data_history = db_.VW_EMPLOYEE_HISTORICAL_EXAMs
                        .Where(s => s.EXAM_LOCATIONS.Equals(sess) && s.EXAM_STATUS.Equals(5))
                        .OrderBy(oj => oj.DSTRCT_CODE).ThenByDescending(data => data.REGISTRATION_DATE).Distinct();
                    return Json(i_Data_history.ToDataSourceResult(take, skip, sort, filter));
                }
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}