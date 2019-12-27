using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Administration
{
    public class MappingUserController : Controller
    {

        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private DtClass_AppsDataContext i_objApps;

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;

        public ActionResult Index()
        {
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
        }

        [HttpPost]
        public JsonResult AjaxRead(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                i_objApps = new DtClass_AppsDataContext();
                var list_view = i_objApps.View_User_IDs;
                return this.Json(list_view.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxDelete(View_User_ID vw)
        {
            try
            {
                i_objApps = new DtClass_AppsDataContext();
                var tblUser_ = i_objApps.TBL_USERs.Where(f => f.ID == vw.ID).FirstOrDefault();
                if (tblUser_ != null)
                    i_objApps.TBL_USERs.DeleteOnSubmit(tblUser_);
                i_objApps.SubmitChanges();
                i_objApps.Dispose();
                return Json(new { status = true, remarks = "Operation success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, remarks = e.ToString() });
            }
        }

        [HttpPost]
        public JsonResult AjaxUpdate(View_User_ID s_user)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();

            try
            {
                i_objApps = new DtClass_AppsDataContext();
                var i_user = i_objApps.TBL_USERs.Where(i => i.ID.Equals(s_user.ID)).FirstOrDefault();
                i_user.GP = Convert.ToInt32(s_user.Deskripsi);

                i_objApps.SubmitChanges();
                return Json(new { status = true, message = "Data Terupdate!" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return Json(new { status = false, message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public ActionResult AjaxUpdate(View_User_ID sView_User_ID)
        //{
        //    this.pv_CustLoadSession();
        //    try
        //    {
        //        i_objApps = new DtClass_AppsDataContext();
        //        TBL_USER i_tbl_user = i_objApps.TBL_USERs.Where(a => a.NRP == sView_User_ID.NRP).FirstOrDefault();
        //        i_tbl_user.GP = sView_User_ID.GP;
        //        i_tbl_user.DISTRIK = sView_User_ID.DISTRIK; 
        //        i_objApps.SubmitChanges();
        //        i_objApps.Dispose();

        //        return Json(new { status = true, remarks = "Data berhasil diupdate" });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { status = false, remarks = "Transaksi gagal!!!" });

        //    }
        //}

        [HttpPost]
        public ActionResult AjaxReadDistrik()
        {
            try
            {
                i_objApps = new DtClass_AppsDataContext();
                IQueryable<View_District> ivw_distrik = i_objApps.View_Districts;
                return Json(new { Total = ivw_distrik.Count(), Data = ivw_distrik });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public ActionResult AjaxReadProfiles()
        //{
        //    try
        //    {
        //        i_objApps = new DtClass_AppsDataContext();
        //        IQueryable<TBL_Profile> iTBL_Profile = i_objApps.TBL_Profiles;
        //        return Json(new { Total = iTBL_Profile.Count(), Data = iTBL_Profile });
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public ActionResult AjaxReadProfiles()
        {
            try
            {
                i_objApps = new DtClass_AppsDataContext();
                IQueryable<TBL_Profile> iTBL_Profile = i_objApps.TBL_Profiles;
                return Json(new { Total = iTBL_Profile.Count(), Data = iTBL_Profile });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public JsonResult getDistrikDesc()
        //{

        //    i_objApps = new DtClass_AppsDataContext();
        //    var view_distrik_ = i_objApps.View_Districts;
        //    return this.Json(new { data = view_distrik_ });
        //}

        //[HttpPost]
        //public JsonResult getGPDesc()
        //{

        //    i_objApps = new DtClass_AppsDataContext();
        //    var tbl_profiles = i_objApps.TBL_Profiles;
        //    return this.Json(new { data = tbl_profiles });
        //}
    }
}