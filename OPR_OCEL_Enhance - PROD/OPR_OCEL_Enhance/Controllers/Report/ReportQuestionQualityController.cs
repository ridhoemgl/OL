using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers
{
    public class ReportQuestionQualityController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        DtClass_AppsDataContext ocel_app = new DtClass_AppsDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        private string base_url = ConfigurationManager.AppSettings["urlAppPath"];
        public bool iStrStatus;

        // GET: /SettingUser/
        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");

            }
            else
            {
                var ft = db_.VW_AnalisaSoal_1s.ToList();

                foreach (var item in ft)
                {
                    item.ACH_TRUE = Convert.ToDouble(String.Format("{0:0.##}", item.ACH_TRUE));
                    item.ACH_FALSE = Convert.ToDouble(String.Format("{0:0.##}", item.ACH_FALSE));
                }

                ViewBag.dataumum = ft;
                ViewBag.baseurl = base_url;
                ViewBag.leftMenu = loadMenu();

                return View();
            }
           
        }

        [HttpPost]
        public JsonResult GetExamType()
        {
            var result = db_.TBL_R_JENIS_UJIANs;
            return this.Json(new
            {
                result
            });
        }

        public ActionResult ByModuleOrCompetency()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null)
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.baseurl = base_url;
                ViewBag.leftMenu = loadMenu();

                return View();
            }
        }

        [HttpPost]
        public JsonResult GetAnalize(string module_id)
        {
            if (module_id == "0")
            {
                var result = db_.VW_AnalisaSoal_byModules.ToList();
                return this.Json(new
                {
                    data = result
                });
            }
            else
            {
                var result = db_.VW_AnalisaSoal_byCompetency(module_id).ToList();
                return this.Json(new
                {
                    data = result
                });
            }
        }

        [HttpPost]
        public JsonResult DropdownModul()
        {
            var i_module = db_.TBL_R_MODULEs;

            return this.Json(new
            {
                Data = i_module,
                Total = i_module.Count()
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult Read(string s_modulid , int s_type)
        {
            var data = db_.cufn_question_analyze(s_modulid, s_type);

            return this.Json(new
            {
                data = data
            });
        }

        [HttpPost]
        public JsonResult ReadAnalyze(string s_modulid, int s_type , string s_sub_module_id)
        {
            if (s_type < 0)
            {
                var data = db_.VW_ANALYZE_SOALs.Where(s => s_modulid.Equals(s_modulid));
                return this.Json(new
                {
                    data
                });
            }
            else
            {
                if (s_sub_module_id.Equals("0"))
                {
                    var data = db_.cufn_question_analyze(s_modulid, s_type);
                    return this.Json(new
                    {
                        data
                    });
                }
                else
                {
                    var data = db_.cufn_question_analyze(s_modulid, s_type).Where(U => U.MODULE_SUB_ID.Equals(s_sub_module_id));
                    return this.Json(new
                    {
                        data
                    });
                }
                
            }
        }

        [HttpPost]
        public JsonResult AjaxReadQuality(string s_modulid, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw_setWaktu = db_.VW_ANALYZE_SOALs.Where(s => s.MODULE_ID.Equals(s_modulid));
                return Json(vw_setWaktu.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString()
                }, JsonRequestBehavior.AllowGet);
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
        public JsonResult getDataRecapitulation(string bulan, string tahun, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                IQueryable<VW_RESULT_HASIL_UJIAN_RESULT> i_tbl_ = db_.VW_RESULT_HASIL_UJIAN_RESULTs.Where(f => f.MONTH_EXAM.Equals(bulan) && f.YEAR_EXAM.Equals(tahun));
                
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}