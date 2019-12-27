using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using System.Configuration;

namespace OPR_OCEL_Enhance.Controllers.Administration
{
    public class AddUserController : Controller
    {

        //DtClass_AppsDataContext db_ = new DtClass_AppsDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private DtClass_AppsDataContext i_objApps;
        private DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;
        public bool iStrStatus;

        private int[] gp_allow = { 1 , 5 };

        public ActionResult Index()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null || !gp_allow.Contains(Convert.ToInt32(Session["GP"])))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.leftMenu = loadMenu();
                ViewBag.profile = getList("gp");
                ViewBag.ditrik = getList("ditrik");
                return View();
            }
        }


        public ActionResult RegisterNonDomain()
        {
            this.pv_CustLoadSession();
            if (Session["NRP"] == null || !gp_allow.Contains(Convert.ToInt32(Session["GP"])))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.leftMenu = loadMenu();
                ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
                ViewBag.profile = getList("gp");
                ViewBag.ditrik = getList("ditrik");
                return View();
            }
        }

        public ActionResult UserNonDomain()
        {
            this.pv_CustLoadSession();

            if (Session["NRP"] == null || !gp_allow.Contains(Convert.ToInt32(Session["GP"])))
            {
                return RedirectToAction("Index", "Login");
            }
            else
            {
                ViewBag.leftMenu = loadMenu();
                ViewBag.pathParent = ConfigurationManager.AppSettings["urlAppPath"];
                ViewBag.profile = getList("gp");
                ViewBag.ditrik = getList("ditrik");
                return View();
            }
        }

        [HttpPost]
        public JsonResult RegisterUserNonDomain(string nrpid)
        {
            pv_CustLoadSession();
            try
            {
                db_.cusp_register_employye_nondomain(nrpid);
                return this.Json(new { status = true, header = "SUKSES REGISTRASI", body = "Proses Registrasi untuk user tanpa domain berhasil dilakukan", type = "green", Err = "" });
            }
            catch (Exception e)
            {
                return this.Json(new { status = true, header = "GAGAL REGISTRASI", body = string.Concat("Proses Registrasi untuk user tanpa domain gagal dilakukan karena ", e.GetType().ToString()), type = "red", Err = string.Empty});
            }
        }

        [HttpPost]
        public JsonResult AjaxReadUserNoDomain(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw_setWaktu = db_.VW_MOR_OPERATOR_ALLs;
                return Json(vw_setWaktu.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString()
                });
            }
        }

        [HttpPost]
        public JsonResult AjaxReadListUserNoDomain(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw_setWaktu = db_.TBL_DWH_EMPLOYEE_GUESTs;
                return Json(vw_setWaktu.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString()
                });
            }
        }

        [HttpPost]
        public JsonResult DeleteNonDomain(string nrp)
        {
            pv_CustLoadSession();
            try
            {
                TBL_DWH_EMPLOYEE_GUEST iTBL_DWH_EMPLOYEE_GUEST = db_.TBL_DWH_EMPLOYEE_GUESTs.Where(p => p.EMPLOYEE_ID.Equals(nrp)).FirstOrDefault();
                db_.TBL_DWH_EMPLOYEE_GUESTs.DeleteOnSubmit(iTBL_DWH_EMPLOYEE_GUEST);
                db_.SubmitChanges();
                return this.Json(new { status = true, header = "DATA DIHAPUS", body = "Proses hapus untuk user tanpa domain berhasil dilakukan", type = "green", Err = "" });
            }
            catch (Exception e)
            {
                return this.Json(new { status = true, header = "GAGAL DIHAPUS", body = string.Concat("Proses hapus gagal dilakukan karena ", e.GetType().ToString()), type = "red", Err = string.Empty });
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


        public IEnumerable<SelectListItem> getList(string s_type)
        {
            List<itemSelect> ls = new List<itemSelect>();
            IEnumerable<SelectListItem> items;
            if (s_type == "gp")
            {
                i_objApps = new DtClass_AppsDataContext();
                var tbl_profile_ = i_objApps.TBL_Profiles;

                foreach (var item in tbl_profile_)
                {
                    ls.Add(new itemSelect { text = item.Deskripsi, value = item.GP_ID.ToString() });
                }
            }

            if (s_type == "ditrik")
            {
                i_objApps = new DtClass_AppsDataContext();
                var view_distrik_ = i_objApps.View_Districts;

                foreach (var item in view_distrik_)
                {
                    ls.Add(new itemSelect { text = item.DSTRCT_CODE, value = item.DSTRCT_CODE });
                }
            }

            items = ls.Select(c => new SelectListItem
            {
                Value = c.value,
                Text = c.text
            });

            return items;
        }

        public class itemSelect
        {
            public string text { get; set; }
            public string value { get; set; }
        }

        [HttpPost]
        public JsonResult AjaxReadEmployee(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                i_objApps = new DtClass_AppsDataContext();
                var vw_employee_ = i_objApps.vw_Employees.Where(f => f.EMP_STATUS == "A");

                return Json(vw_employee_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public JsonResult AjaxRead(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        //{
        //    try
        //    {
        //        var list_view = db_.View_User_IDs;
        //        return this.Json(list_view.ToDataSourceResult(take, skip, sort, filter));
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

        [HttpPost]
        public JsonResult ajaxInsert(string nrp = "", string gp = "100", string distrik = "")
        {
            if (nrp.Trim() == "")
                return this.Json(new { error = "NRP Belum diisi.. !!", status = false }, JsonRequestBehavior.AllowGet);

            try
            {
                i_objApps = new DtClass_AppsDataContext();
                var iUser_ = i_objApps.TBL_USERs.Where(f => f.NRP.Equals(nrp) && f.GP.Equals(gp) && f.DISTRIK.Equals(distrik));

                if (iUser_.Count() <= 0)
                {
                    TBL_USER iTbl_user = new TBL_USER();
                    iTbl_user.NRP = nrp;
                    iTbl_user.GP = Convert.ToInt32(gp);
                    iTbl_user.DISTRIK = distrik;
                    i_objApps.TBL_USERs.InsertOnSubmit(iTbl_user);
                    i_objApps.SubmitChanges();
                    i_objApps.Dispose();
                }

                return this.Json(new { message = "NRP " + nrp + " saved in database", status = true }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString(), status = false }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult getDistrikDesc(int sProfile = 1000)
        {
            List<itemSelect> ls = new List<itemSelect>();
            i_objApps = new DtClass_AppsDataContext();
            {
                var view_distrik_ = i_objApps.View_Districts;

                foreach (var item in view_distrik_)
                {
                    ls.Add(new itemSelect { text = item.DSTRCT_CODE1, value = item.DSTRCT_CODE });
                }
            }

            return this.Json(new { data = ls }, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        //public ActionResult AjaxUpdate(View_User_ID sView_User_ID)
        //{
        //    this.pv_CustLoadSession();
        //    try
        //    {
        //        TBL_USER i_tbl_user = db_.TBL_USERs.Where(a => a.NRP == sView_User_ID.NRP).FirstOrDefault();
        //        i_tbl_user.NRP = sView_User_ID.NRP;
        //        i_tbl_user.GP = sView_User_ID.GP;
        //        i_tbl_user.DISTRIK = sView_User_ID.DISTRIK;
        //        db_.SubmitChanges();
        //        db_.Dispose();

        //        return Json(new { status = true, remarks = "Data berhasil diupdate" });
        //    }
        //    catch (Exception e)
        //    {
        //        return Json(new { status = false, remarks = "Transaksi gagal!!!" });

        //    }
        //}

        //[HttpPost]
        //public JsonResult AjaxDelete(vw_gpId vw)
        //{
        //    try
        //    {
        //        var tblUser_ = db_.TBL_USERs.Where(f => f.ID == vw.ID).FirstOrDefault();
        //        if (tblUser_ != null)
        //            db_.TBL_USERs.DeleteOnSubmit(tblUser_);
        //        db_.SubmitChanges();
        //        db_.Dispose();
        //        return Json(new { status = true, remarks = "Operation success" }, JsonRequestBehavior.AllowGet);
        //    }
        //    catch (Exception e)
        //    {
        //        return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
        //    }
        //}

    }
}