using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers.CPMD_Admin
{
    public class MasterSubmoduleController : Controller
    {
        cpmd_dataDataContext db2_ = new cpmd_dataDataContext();

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
        public ActionResult AjaxGetDDLModule()
        {
            try
            {
                var i_tbl = db2_.TBL_R_MODULE_CLASSes.Where(o => o.IS_ACTIVE == 1).OrderBy(p => p.MODULE_NAME);
                return Json(i_tbl);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", message = "Data Read Failed" + e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxGetAllSubmodules(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_R_SUB_MODULE> i_tbl_ = db2_.VW_R_SUB_MODULEs.Where(o => o.SI_ACTIVE == 1).OrderBy(o => o.MODULE_ID).ThenBy(o => o.STEP);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { remarks = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxInsertUpdate(TBL_R_COMPETENCY obj)
        {
            this.pv_CustLoadSession();
            try
            {

                if (string.IsNullOrEmpty(obj.MODULE_SUB_ID))   //  Insert
                {
                    //  validasi duplicate sub module name
                    TBL_R_COMPETENCY duplicate = db2_.TBL_R_COMPETENCies
                        .Where(o => o.MODULE_SUB_NAME.ToLower() == obj.MODULE_SUB_NAME.ToLower())
                        .FirstOrDefault();

                    if (duplicate != null)
                    {
                        return Json(new { status = true, remarks = "Data sudah ada" });
                    }
                    else
                    {
                        //string MOD_ID = obj.MODULE_ID.Trim();
                        db2_.cusp_Submodule(obj.MODULE_SUB_NAME, obj.MODULE_ID, "INSERT");

                        db2_.SubmitChanges();
                        db2_.Dispose();

                        return Json(new { status = true, remarks = "Data berhasil disimpan" });
                    }
                }
                else    // Update
                {
                    TBL_R_COMPETENCY duplicate = db2_.TBL_R_COMPETENCies
                        .Where(o => o.MODULE_SUB_NAME.ToLower() == obj.MODULE_SUB_NAME.ToLower() &&
                                    o.MODULE_SUB_ID != obj.MODULE_SUB_ID)
                        .FirstOrDefault();

                    if (duplicate != null)
                    {
                        return Json(new { status = true, remarks = "Data sudah ada" });
                    }
                    else
                    {
                        TBL_R_COMPETENCY data = db2_.TBL_R_COMPETENCies
                            .Where(o => o.MODULE_SUB_ID == obj.MODULE_SUB_ID)
                            .FirstOrDefault();

                        data.MODULE_SUB_NAME = obj.MODULE_SUB_NAME;

                        db2_.SubmitChanges();
                        db2_.Dispose();

                        return Json(new { status = true, remarks = "Data berhasil diperbaharui" });
                    }
                }


            }
            catch (Exception e)
            {
                var a = e.Message;
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" });

            }
        }

        [HttpPost]
        public ActionResult AjaxDelete(TBL_R_COMPETENCY obj)
        {
            this.pv_CustLoadSession();
            try
            {

                if (!string.IsNullOrEmpty(obj.MODULE_SUB_ID))
                {
                    TBL_R_COMPETENCY data = db2_.TBL_R_COMPETENCies
                            .Where(o => o.MODULE_SUB_ID == obj.MODULE_SUB_ID)
                            .FirstOrDefault();

                    data.SI_ACTIVE = 0;

                    db2_.SubmitChanges();
                    db2_.Dispose();

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