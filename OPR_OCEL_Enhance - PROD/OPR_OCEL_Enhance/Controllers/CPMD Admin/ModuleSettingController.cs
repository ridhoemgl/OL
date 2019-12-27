using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers.CPMD_Admin
{
    public class ModuleSettingController : Controller
    {
        cpmd_dataDataContext db_ = new cpmd_dataDataContext();
        DtClass_OcelEnchDataContext db2_ = new DtClass_OcelEnchDataContext();

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

        [HttpPost]
        public ActionResult AjaxGetDDLModule(string param)
        {
            try
            {
                var i_tbl = db_.TBL_R_MODULE_CLASSes;
                return Json(i_tbl);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", message = "Data Read Failed" + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxGetDDLQuestionType(string param)
        {
            try
            {
                var i_tbl = db2_.TBL_R_TYPE_SOALs;
                return Json(i_tbl);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", message = "Data Read Failed" + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxGetDDLSubModule(string modul_id)
        {
            try
            {
                var i_tbl = db_.TBL_R_COMPETENCies.Where(o => o.MODULE_ID == modul_id).OrderBy(o => o.MODULE_SUB_NAME);
                return Json(i_tbl);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", message = "Data Read Failed" + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxGetAllModuleSetting(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_T_MODULE_SET> i_tbl_ = db_.VW_T_MODULE_SETs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { remarks = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxInsertUpdate(TBL_MODULE_SET obj)
         {
            this.pv_CustLoadSession();
            try
            {

                if (string.IsNullOrEmpty(obj.T_PID))   //  Insert
                {
                    #region Validasi
                    //  validasi module id yang sama
                    TBL_MODULE_SET duplicate_module_id = db_.TBL_MODULE_SETs
                        .Where(o => o.MODULE_ID == obj.MODULE_ID)
                        .FirstOrDefault();

                    if (duplicate_module_id != null)
                    {
                        return Json(new { status = false, remarks = "Modul sudah ada" });
                    }
                    if (String.IsNullOrEmpty(obj.MODULE_ID))
                    {
                        return Json(new { status = false, remarks = "Modul tidak boleh kosong" });
                    }

                    //  validasi question type
                    if (string.IsNullOrEmpty(obj.QUESTION_TYPE.ToString().Trim()) || obj.QUESTION_TYPE == 0)
                    {
                        return Json(new { status = false, remarks = "Tipe pertanyaan tidak boleh kosong" });
                    }
                    
                    //  validasi total question
                    if (obj.QUESTION_EACH_COMPETENCY < 0)
                    {
                        return Json(new { status = false, remarks = "Total pertanyaan kurang dari batas minimum" });
                    }
                    if (obj.QUESTION_EACH_COMPETENCY > 15)
                    {
                        return Json(new { status = false, remarks = "Total pertanyaan lebih dari batas maksimum" });
                    }

                    //  validasi passing grade
                    if(obj.PASSING_GRADE < 75)
                    {
                        return Json(new { status = false, remarks = "Passing grade kurang dari batas minimum" });
                    }
                    if(obj.PASSING_GRADE > 100)
                    {
                        return Json(new { status = false, remarks = "Passing grade lebih dari batas maksimum" });
                    }
                    #endregion

                    db2_.cusp_ModuleSetting(obj.MODULE_ID, obj.QUESTION_TYPE, obj.PRIORITY, obj.QUESTION_EACH_COMPETENCY, 
                        obj.PASSING_GRADE, "INSERT");

                    db2_.SubmitChanges();
                    db2_.Dispose();

                    return Json(new { status = true, remarks = "Data berhasil disimpan" });
                }
                else
                {
                    #region Validasi
                    //  validasi total question
                    if (obj.QUESTION_EACH_COMPETENCY < 0)
                    {
                        return Json(new { status = false, remarks = "Total pertanyaan kurang dari batas minimum" });
                    }
                    if (obj.QUESTION_EACH_COMPETENCY > 100)
                    {
                        return Json(new { status = false, remarks = "Total pertanyaan lebih dari batas maksimum" });
                    }

                    //  validasi passing grade
                    if (obj.PASSING_GRADE < 75)
                    {
                        return Json(new { status = false, remarks = "Passing grade kurang dari batas minimum" });
                    }
                    if (obj.PASSING_GRADE > 100)
                    {
                        return Json(new { status = false, remarks = "Passing grade lebih dari batas maksimum" });
                    }
                    #endregion

                    TBL_MODULE_SET data = db_.TBL_MODULE_SETs
                        .Where(o => o.T_PID == obj.T_PID)
                        .FirstOrDefault();

                    data.QUESTION_EACH_COMPETENCY = obj.QUESTION_EACH_COMPETENCY;
                    data.PASSING_GRADE = obj.PASSING_GRADE;

                    db_.SubmitChanges();
                    db_.Dispose();

                    return Json(new { status = true, remarks = "Data berhasil disimpan" });
                }
            }
            catch (Exception e)
            {
                var a = e.Message;
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" });

            }
        }

        [HttpPost]
public ActionResult AjaxDelete(TBL_R_MODULE_CLASS obj)
{
    this.pv_CustLoadSession();
    try
    {

        if (!string.IsNullOrEmpty(obj.MODULE_ID))
        {
            TBL_R_MODULE_CLASS data = db_.TBL_R_MODULE_CLASSes
                    .Where(o => o.MODULE_ID == obj.MODULE_ID)
                    .FirstOrDefault();

            data.IS_ACTIVE = 0;

            db_.SubmitChanges();
            db_.Dispose();

            return Json(new { status = true, remarks = "Data berhasil dihapus" });
        }

        return Json(new { status = false, remarks = "Data tidak berhasil disimpan" });

    }
    catch (Exception e)
    {
        return Json(new { status = false, remarks = "Data tidak berhasil disimpan" });

    }
}
    }
}