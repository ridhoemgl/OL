using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace OPR_OCEL_Enhance.Controllers.CPMD_Admin
{
    public class MasterModuleController : Controller
    {
        cpmd_dataDataContext db_ = new cpmd_dataDataContext();

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
        public ActionResult AjaxGetAllModules(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_R_MODULE> i_tbl_ = db_.VW_R_MODULEs.Where(o => o.IS_ACTIVE == 1).OrderBy(o => o.MODULE_ID);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { remarks = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxInsertUpdate(TBL_R_MODULE_CLASS obj)
        {
            this.pv_CustLoadSession();
            try
            {

                if (string.IsNullOrEmpty(obj.MODULE_ID))   //  Insert
                {
                    //  validasi duplicate module name
                    TBL_R_MODULE_CLASS duplicate = db_.TBL_R_MODULE_CLASSes
                        .Where(o => o.MODULE_NAME.ToLower() == obj.MODULE_NAME.ToLower())
                        .FirstOrDefault();

                    if (duplicate != null)
                    {
                        return Json(new { status = true, remarks = "Data sudah ada" });
                    }
                    else
                    {
                        db_.cusp_Module(obj.MODULE_NAME, "INSERT");

                        db_.SubmitChanges();
                        db_.Dispose();

                        return Json(new { status = true, remarks = "Data berhasil disimpan" });
                    }
                }
                else    // Update
                {
                    TBL_R_MODULE_CLASS duplicate = db_.TBL_R_MODULE_CLASSes
                        .Where(o => o.MODULE_NAME.ToLower() == obj.MODULE_NAME.ToLower() &&
                                    o.MODULE_ID != obj.MODULE_ID)
                        .FirstOrDefault();

                    if (duplicate != null)
                    {
                        return Json(new { status = true, remarks = "Data sudah ada" });
                    }
                    else
                    {
                        TBL_R_MODULE_CLASS data = db_.TBL_R_MODULE_CLASSes
                            .Where(o => o.MODULE_ID == obj.MODULE_ID)
                            .FirstOrDefault();

                        data.MODULE_NAME = obj.MODULE_NAME;

                        db_.SubmitChanges();
                        db_.Dispose();

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