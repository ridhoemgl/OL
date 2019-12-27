using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Master
{
    public class MasterCertificatorController : Controller
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

        [HttpPost]
        public JsonResult AjaxReadEmployee(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {

                var vw_employee_ = db_.VW_EMPLOYEEs;

                return Json(vw_employee_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxReadCertificatorList(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {

                var vw_employee_ = db_.VW_R_CERTIFICATORs;

                return Json(vw_employee_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AjaxReadVendor(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {

                var vendor = db_.TBL_M_EMPLOYEE_OTHERs;

                return Json(vendor.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { error = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult readCertificator(int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_R_CERTIFICATOR> i_tbl_ = db_.VW_R_CERTIFICATORs.OrderByDescending(x => x.DSTRCT_CODE);
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { remarks = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxInsert(string sDate, TBL_R_CERTIFICATOR sTBL_R_CERTIFICATOR)
        {
            this.pv_CustLoadSession();

            TBL_R_CERTIFICATOR iTBL_R_CERTIFICATOR = db_.TBL_R_CERTIFICATORs.Where(p => p.CERTIFICATOR_ID.Equals(sTBL_R_CERTIFICATOR.CERTIFICATOR_ID)).FirstOrDefault();
            if (iTBL_R_CERTIFICATOR != null)
            {
                return Json(new { status = true, remarks = "Data sudah ada!" });
            }
            else
            {
                try
                {
                    string i_ID = sTBL_R_CERTIFICATOR.CERTIFICATOR_ID;
                    string i_nama = sTBL_R_CERTIFICATOR.CERTIFICATOR_NAME;
                    bool isActive = (bool)sTBL_R_CERTIFICATOR.IS_ACTIVE;
                    bool isasesor = (bool)sTBL_R_CERTIFICATOR.IS_ASESOR;
                    string regis_no = sTBL_R_CERTIFICATOR.NO_REG_ASESOR;
                    DateTime DATE_EXPIRED = DateTime.Now;
                    //DateTime DATE_EXPIRED = sTBL_R_CERTIFICATOR.DATE_EXPIRED;

                    db_.cusp_CertificatorSet(i_ID, i_nama, isActive, isasesor, regis_no, DATE_EXPIRED);
                    db_.SubmitChanges();
                    return Json(new { status = true, remarks = "Data berhasil disimpan" });
                }
                catch (Exception e)
                {
                    return Json(new { status = false, remarks = "Gagal menyimpan data!" +e.ToString() });
                }
            }
            
        }

        [HttpPost]
        public ActionResult AjaxUpdate(TBL_R_CERTIFICATOR sTBL_R_CERTIFICATOR)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_R_CERTIFICATOR iTBL_R_CERTIFICATOR = db_.TBL_R_CERTIFICATORs.Where(p => p.CERTIFICATOR_ID.Equals(sTBL_R_CERTIFICATOR.CERTIFICATOR_ID)).FirstOrDefault();

                iTBL_R_CERTIFICATOR.NO_REG_ASESOR = sTBL_R_CERTIFICATOR.NO_REG_ASESOR;
                iTBL_R_CERTIFICATOR.IS_ACTIVE = sTBL_R_CERTIFICATOR.IS_ACTIVE;
                iTBL_R_CERTIFICATOR.IS_ASESOR = sTBL_R_CERTIFICATOR.IS_ASESOR;
                iTBL_R_CERTIFICATOR.DATE_EXPIRED = sTBL_R_CERTIFICATOR.DATE_EXPIRED;

                db_.SubmitChanges();
                db_.Dispose();

                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Update gagal!" +e.ToString()});

            }
        }

        [HttpPost]
        public JsonResult deleteCertificator(VW_R_CERTIFICATOR sVW_R_CERTIFICATOR)
        {
            try
            {
                TBL_R_CERTIFICATOR iTBL_R_CERTIFICATOR = db_.TBL_R_CERTIFICATORs.Where(p => p.CERTIFICATOR_ID.Equals(sVW_R_CERTIFICATOR.NRP)).FirstOrDefault();

                db_.TBL_R_CERTIFICATORs.DeleteOnSubmit(iTBL_R_CERTIFICATOR);
                db_.SubmitChanges();

                return this.Json(new { remarks = "Delete Success", status = true });

            }
            catch (Exception e)
            {
                return this.Json(new { status = false, type = "DANGER", remarks = "Delete Failed " + e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult AjaxCreateVendor(TBL_M_EMPLOYEE_OTHER sTBL_M_EMPLOYEE_OTHER)
        {
            this.pv_CustLoadSession();   
            try
            {
                sTBL_M_EMPLOYEE_OTHER.PID = Guid.NewGuid().ToString();

                db_.TBL_M_EMPLOYEE_OTHERs.InsertOnSubmit(sTBL_M_EMPLOYEE_OTHER);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan" });  
            }
                catch (Exception e)
            {
                return Json(new { status = false, remarks = "Gagal menyimpan data!" + e.ToString() });
            }
        }

        [HttpPost]
        public ActionResult AjaxUpdateVendor(TBL_M_EMPLOYEE_OTHER sTBL_M_EMPLOYEE_OTHER)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_M_EMPLOYEE_OTHER iTBL_M_EMPLOYEE_OTHER = db_.TBL_M_EMPLOYEE_OTHERs.Where(p => p.PID.Equals(sTBL_M_EMPLOYEE_OTHER.PID)).FirstOrDefault();

                iTBL_M_EMPLOYEE_OTHER.NAMA = sTBL_M_EMPLOYEE_OTHER.NAMA;
                iTBL_M_EMPLOYEE_OTHER.POSISI = sTBL_M_EMPLOYEE_OTHER.POSISI;
                iTBL_M_EMPLOYEE_OTHER.PERUSAHAAN = sTBL_M_EMPLOYEE_OTHER.PERUSAHAAN;
                iTBL_M_EMPLOYEE_OTHER.IS_ACTIVE = sTBL_M_EMPLOYEE_OTHER.IS_ACTIVE;

                db_.SubmitChanges();
                db_.Dispose();

                return Json(new { status = true, remarks = "Data berhasil diupdate" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Update gagal!" + e.ToString() });

            }
        }

        [HttpPost]
        public JsonResult AjaxDeleteVendor(TBL_M_EMPLOYEE_OTHER sTBL_M_EMPLOYEE_OTHER)
        {
            try
            {
                TBL_M_EMPLOYEE_OTHER iTBL_M_EMPLOYEE_OTHER = db_.TBL_M_EMPLOYEE_OTHERs.Where(p => p.PID.Equals(sTBL_M_EMPLOYEE_OTHER.PID)).FirstOrDefault();

                db_.TBL_M_EMPLOYEE_OTHERs.DeleteOnSubmit(iTBL_M_EMPLOYEE_OTHER);
                db_.SubmitChanges();

                return this.Json(new { remarks = "Delete Success", status = true });
            }
            catch (Exception e)
            {
                return this.Json(new { status = false, remarks = "Delete Failed " + e.ToString() });
            }
        }

    }
}