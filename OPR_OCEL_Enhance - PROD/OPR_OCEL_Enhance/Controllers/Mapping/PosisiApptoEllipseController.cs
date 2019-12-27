using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Kendo.DynamicLinq;

namespace OPR_OCEL_Enhance.Controllers.Mapping
{
    public class PosisiApptoEllipseController : Controller
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
        public ActionResult readApptoEllipse(string s_session , int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {

                IQueryable<VW_POSISI_APP_TO_ELLIPSE> i_tbl_ = db_.VW_POSISI_APP_TO_ELLIPSEs;
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));

            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult dropdownDistrik()
        {
            var i_VW_DISTRIK = db_.VW_DISTRIKs;
            return this.Json(new { Data = i_VW_DISTRIK, Total = i_VW_DISTRIK.Count() });
        }

        [HttpPost]
        public bool insertAllTempt(string SESS_CODE)
        {
            try
            {
                db_.cusp_insert_AllAppToEllipse(SESS_CODE);
                db_.cusp_dumping_ellipse_to_apps();
                return true;
            }
            catch
            {
                return false;
            }
        }


        [HttpGet]
        public JsonResult cusdropdownDistrik()
        {
            var i_VW_DISTRIK = db_.VW_DISTRIKs;
            return this.Json(new { Data = i_VW_DISTRIK, Total = i_VW_DISTRIK.Count() }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult dropdownPositionApp()
        {
            var i_VW_PositionApp = db_.TBL_M_POSITION_APPs;
            return this.Json(new { Data = i_VW_PositionApp, Total = i_VW_PositionApp.Count() });
        }

        public JsonResult dropdownPositionEllipse()
        {
            var i_VW_PositionEll = db_.VW_POSISI_GROUP_TO_ELLIPSEs;
            return this.Json(new { Data = i_VW_PositionEll, Total = i_VW_PositionEll.Count() });
        }

        [HttpGet]
        public JsonResult dropdownAppTmp()
        {
            var i_VW_PositionApp = db_.TBL_M_POSITION_APPs;
            var i_VW_PositionEll = db_.VW_POSITION2s;
            return this.Json(new { APP = i_VW_PositionApp, ELIP = i_VW_PositionEll }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult PosisitionDropdown(string ID_POSITION)
        {
            var i_VW_POSITION_ELLIPSE = db_.VW_POSISI_GROUP_TO_ELLIPSEs.Where(param => param.DSTRCT_CODE.Equals(ID_POSITION));
            return this.Json(new { ELIP = i_VW_POSITION_ELLIPSE, Total = i_VW_POSITION_ELLIPSE.Count() }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult insertToTMPdata(string DSTRCT_CODE, string SESS_CODE,string POSITION_ELLIPSE, string POSITION_ELLIPSE_DESC, string POSITION_CODE)
        {
            try
            {
                db_.cups_Insert_mapping_AppToEllipse(DSTRCT_CODE, SESS_CODE, POSITION_ELLIPSE, POSITION_ELLIPSE_DESC, POSITION_CODE, (string)Session["NRP"]);
                return this.Json(new { message = "Oke" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult createApptoEllipse(VW_POSISI_APP_TO_ELLIPSE sVW_POSISI_APP_TO_ELLIPSE)
        {
            this.pv_CustLoadSession();
            try
            {
                VW_POSITION iVW_POSITION = db_.VW_POSITIONs.Where(p => p.POSITION_ID.Equals(sVW_POSISI_APP_TO_ELLIPSE.POSITION_ELLIPSE)).FirstOrDefault();
                TBL_M_POSITION_APP_ELLIPSE iTBL_M_POSITION_APP_ELLIPSE = new TBL_M_POSITION_APP_ELLIPSE();

                iTBL_M_POSITION_APP_ELLIPSE.PID_PE = Guid.NewGuid().ToString();
                iTBL_M_POSITION_APP_ELLIPSE.DSTRCT_CODE = sVW_POSISI_APP_TO_ELLIPSE.DSTRCT_CODE;
                iTBL_M_POSITION_APP_ELLIPSE.POSITION_ELLIPSE = sVW_POSISI_APP_TO_ELLIPSE.POSITION_ELLIPSE;
                iTBL_M_POSITION_APP_ELLIPSE.POSITION_ELLIPSE_DESC = iVW_POSITION.POS_TITLE;
                iTBL_M_POSITION_APP_ELLIPSE.POSITION_CODE = sVW_POSISI_APP_TO_ELLIPSE.POSITION_CODE;
                iTBL_M_POSITION_APP_ELLIPSE.CREATE_BY = iStrSessNRP;
                iTBL_M_POSITION_APP_ELLIPSE.CREATE_DATE = DateTime.Now;

                db_.TBL_M_POSITION_APP_ELLIPSEs.InsertOnSubmit(iTBL_M_POSITION_APP_ELLIPSE);
                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil disimpan" });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Data tidak berhasil disimpan" , erorr = e.ToString() });

            }
        }

        [HttpPost]
        public ActionResult updateApptoEllipse(VW_POSISI_APP_TO_ELLIPSE sVW_POSISI_APP_TO_ELLIPSE)
        {
            this.pv_CustLoadSession();
            try
            {
                VW_POSITION iVW_POSITION = db_.VW_POSITIONs.Where(p => p.POSITION_ID.Equals(sVW_POSISI_APP_TO_ELLIPSE.POSITION_ELLIPSE)).FirstOrDefault();
                TBL_M_POSITION_APP_ELLIPSE iTBL_M_POSITION_APP_ELLIPSE = db_.TBL_M_POSITION_APP_ELLIPSEs.Where(p => p.PID_PE.Equals(sVW_POSISI_APP_TO_ELLIPSE.PID_PE)).FirstOrDefault();

                iTBL_M_POSITION_APP_ELLIPSE.DSTRCT_CODE = sVW_POSISI_APP_TO_ELLIPSE.DSTRCT_CODE;
                iTBL_M_POSITION_APP_ELLIPSE.POSITION_ELLIPSE = sVW_POSISI_APP_TO_ELLIPSE.POSITION_ELLIPSE;
                iTBL_M_POSITION_APP_ELLIPSE.POSITION_ELLIPSE_DESC = iVW_POSITION.POS_TITLE;
                iTBL_M_POSITION_APP_ELLIPSE.POSITION_CODE = sVW_POSISI_APP_TO_ELLIPSE.POSITION_CODE;
                iTBL_M_POSITION_APP_ELLIPSE.MODIF_BY = iStrSessNRP;
                iTBL_M_POSITION_APP_ELLIPSE.MODIF_DATE = DateTime.Now;

                db_.SubmitChanges();
                return Json(new { status = true, remarks = "Data berhasil diupdate", error = string.Empty });
            }
            catch (Exception e)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" , error = e.ToString() });

            }
        }

        [HttpPost]
        public bool cancelSubmit(string SESS_CODE)
        {
            try
            {
                db_.cusp_cancel_InputMapping(SESS_CODE);
                return true;
            }
            catch
            {
                return false;
            }
        }

        [HttpPost]
        public ActionResult deleteApptoEllipse(VW_POSISI_APP_TO_ELLIPSE sVW_POSISI_APP_TO_ELLIPSE)
        {
            this.pv_CustLoadSession();
            try
            {
                TBL_M_POSITION_APP_ELLIPSE iTBL_M_POSITION_APP_ELLIPSE = db_.TBL_M_POSITION_APP_ELLIPSEs.Where(p => p.PID_PE.Equals(sVW_POSISI_APP_TO_ELLIPSE.PID_PE)).FirstOrDefault();

                db_.TBL_M_POSITION_APP_ELLIPSEs.DeleteOnSubmit(iTBL_M_POSITION_APP_ELLIPSE);
                db_.SubmitChanges();

                return Json(new { status = true, remarks = "Data dihapus" });
            }
            catch (Exception)
            {
                return Json(new { status = false, remarks = "Transaksi gagal!!!" });

            }
        }

        [HttpPost]
        public ActionResult TemptreadApptoEllipse(string s_session , int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            this.pv_CustLoadSession();

            try
            {
                IQueryable<VW_TMP_MAPPING_POSISITOELLIPSE> i_tbl_ = db_.VW_TMP_MAPPING_POSISITOELLIPSEs.Where(x => x.SESS_CODE.Equals(s_session));
                return Json(i_tbl_.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult deletetempt(string SESS_CODE , string POSITION_ELLIPSE_DESC)
        {
            this.pv_CustLoadSession();
            try
            {
                db_.cups_DeleteMappingTempt(SESS_CODE, POSITION_ELLIPSE_DESC);
                return this.Json(new { message = "Oke" , code = 1 }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return this.Json(new { message = e.ToString() , code = 0 }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}