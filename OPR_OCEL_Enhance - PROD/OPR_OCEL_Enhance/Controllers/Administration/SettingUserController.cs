using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Administration
{
    public class SettingUserController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        DtClass_AppsDataContext ocel_app = new DtClass_AppsDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        // GET: /SettingUser/
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

        public ActionResult ApplicationUser()
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

        [HttpPost]
        public JsonResult ALlPermissionList(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var i_kelWaktu = db_.VW_PERMISSION_GPs.Where(s => !s.Id.Equals(0)).OrderBy(n => n.GP_ID);
                return Json(i_kelWaktu.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getPM()
        {
            pv_CustLoadSession();
            try
            {
                var dataposisi = ocel_app.TBL_Profiles.Where(data => data.Is_active.Equals(1));
                var datamenu = ocel_app.Menu_Aplikasis;
                var vw_gp_perm = db_.VW_PERMISSION_GPs.Where( a => !a.Id.Equals(null) || !a.Id.Equals(string.Empty));

                return this.Json(new { result = dataposisi, result2 = datamenu, gp = vw_gp_perm, status = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString(), status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxRead(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                ocel_app = new DtClass_AppsDataContext();
                var list_view = ocel_app.TBL_Profiles;
                return this.Json(list_view.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxCreate(TBL_Profile s_profile)
        {
            try
            {
                ocel_app = new DtClass_AppsDataContext();
                //var i_profile = ocel_app.TBL_Profiles.Where(i => i.GP_ID.Equals(s_profile.GP_ID)).FirstOrDefault();
                TBL_Profile i_profile = new TBL_Profile();
                i_profile.GP_ID = Convert.ToInt32(s_profile.GP_ID);
                i_profile.Deskripsi = s_profile.Deskripsi;
                i_profile.Accept_by = iStrSessNRP;
                i_profile.Update_by = iStrSessNRP;
                i_profile.Create_OnDistrict = iStrSessDistrik;
                i_profile.Update_OnDistrict = iStrSessDistrik;
                i_profile.Is_active = s_profile.Is_active;
                i_profile.Create_date = DateTime.Now;
                i_profile.Update_date = DateTime.Now;

                ocel_app.TBL_Profiles.InsertOnSubmit(i_profile);
                ocel_app.SubmitChanges();
                return Json(new { status = true, remarks = "Data Terupdate!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" , error = e.ToString()});

            }
        }

        [HttpPost]
        public JsonResult AjaxUpdate(TBL_Profile s_profile)
        {
            string iStrREmarks = string.Empty;
            this.pv_CustLoadSession();

            try
            {
                ocel_app = new DtClass_AppsDataContext();
                var i_profile = ocel_app.TBL_Profiles.Where(i => i.GP_ID.Equals(s_profile.GP_ID)).FirstOrDefault();
                i_profile.GP_ID = Convert.ToInt32(s_profile.GP_ID);
                i_profile.Deskripsi = s_profile.Deskripsi;
                i_profile.Accept_by = iStrSessNRP;
                i_profile.Update_by = iStrSessNRP;
                i_profile.Create_OnDistrict = iStrSessDistrik;
                i_profile.Update_OnDistrict = iStrSessDistrik;
                i_profile.Is_active = s_profile.Is_active;
                i_profile.Create_date = DateTime.Now;
                i_profile.Update_date = DateTime.Now;

                ocel_app.SubmitChanges();
                return Json(new { status = true, message = "Data Terupdate!" }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return Json(new { status = false, message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxDelete(TBL_Profile profile)
        {
            try
            {
                ocel_app = new DtClass_AppsDataContext();
                var tblProfile_ = ocel_app.TBL_Profiles.Where(f => f.GP_ID == profile.GP_ID).FirstOrDefault();
                if (tblProfile_ != null)
                    ocel_app.TBL_Profiles.DeleteOnSubmit(tblProfile_);
                ocel_app.SubmitChanges();
                ocel_app.Dispose();
                return Json(new { status = true, remarks = "Operation success" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, remarks = e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult AjaxReadProfiles()
        {
            try
            {
                ocel_app = new DtClass_AppsDataContext();
                IQueryable<TBL_Profile> iTBL_Profile = ocel_app.TBL_Profiles;
                return Json(new { Total = iTBL_Profile.Count(), Data = iTBL_Profile });
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public ActionResult AddActionUser(string Primer, long gp_id)
        {
            try
            {
                db_.cups_Insert_access_user(Primer, gp_id);
                return Json(new { status = true, remarks = "Data berhasil dicatat pada database", type = "success", hearder = "SUKSES" });
            }
            catch (Exception e)
            {
                return Json(new { status = true, remarks = "Data gagal dicatat pada database", type = "error", hearder = "Failed Input", errors = e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult DeleteUserAction(string Primer, long gp_id)
        {
            try
            {
                Menu_GP GPi = ocel_app.Menu_GPs.Where(p => p.Primer.Equals(Primer) && p.GP_ID.Equals(gp_id)).FirstOrDefault();
                ocel_app.Menu_GPs.DeleteOnSubmit(GPi);
                ocel_app.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil dihapus pada database", type = "success", hearder = "SUKSES" });
            }
            catch (Exception e)
            {
                return Json(new { status = true, remarks = "Data gagal dicatat pada database", type = "error", hearder = "Failed Input", errors = e.ToString() });
            }
        }
    }
}