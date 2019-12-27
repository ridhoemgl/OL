using OPR_OCEL_Enhance.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Kendo.DynamicLinq;
using OPR_OCEL_Enhance.Models.viewmodels;
using System.IO;
using System.Web;
using System.Threading.Tasks;
using System.Data;
using System.Text.RegularExpressions;
using System.Configuration;
using System.Net;
using OfficeOpenXml;
using OPR_OCEL_Enhance.Models.dbmodel;
using System.Diagnostics;


namespace OPR_OCEL_Enhance.Controllers.BankSoal
{
    public class PilihanGandaController : Controller
    {
        DtClass_OcelEnchDataContext db_ = new DtClass_OcelEnchDataContext();
        private MenuLeftClass menuLeftClass = new MenuLeftClass();
        private Crud_Pilgan pilgan_ = new Crud_Pilgan();

        private string iStrSessNRP = string.Empty;
        private string iStrSessDistrik = string.Empty;
        private string iStrSessGPID = string.Empty;
        private string sStrRemarks = string.Empty;

        public bool iStrStatus;
        //
        // GET: /PilihanGanda/
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

        [HttpPost]
        public ActionResult upload_question_image(string name)
        {
            int message = 0;
            foreach (string upload in Request.Files)
            {
                if (Request.Files[upload].FileName != "")
                {
                    //string filename = Path.GetFileName(Request.Files[upload].FileName);
                    FileInfo fi = new FileInfo(Path.GetFileName(Request.Files[upload].FileName));
                    string ext = fi.Extension;
                    string file = name + (ext).ToString();
                    Request.Files[upload].SaveAs(@"\\jiepfsap401\ocel$\" + file);

                    if (System.IO.File.Exists(@"\\jiepfsap401\ocel$\"+file))
                    {
                        message = 1;
                    }
                    else
                    {
                        message = 0;
                    }
                }
            }

            return this.Json(new
            {
                message = message
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult AjaxPostAnswerList(vmd_post_PilGan PilGan_data)
        {
            try
            {
                if (pilgan_.updatePilgan(PilGan_data, (string)Session["NRP"]) == true)
                {
                    return this.Json(new
                    {
                        status = "ok",
                        sts_code = 1,
                        code_file = PilGan_data.question_id
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return this.Json(new
                    {
                        status = "Faled",
                        sts_code = 0
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString(),
                    sts_code = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult AjaxCreteAnswerList(vmd_post_PilGan PilGan_data)
        {
            TBL_R_QUESTION_ALL i_tbl_r_question = new TBL_R_QUESTION_ALL();

            try
            {

                string quest_id = Guid.NewGuid().ToString();
                if (pilgan_.addDataPilihanGAnda(quest_id, PilGan_data, (string)Session["NRP"]) == true)
                {
                    return this.Json(new
                    {
                        status = "OK",
                        sts_code = 1,
                        code_file = quest_id,
                        report = PilGan_data
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return this.Json(new
                    {
                        status = "Failed",
                        sts_code = 0
                    }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    status = false,
                    error = e.ToString(),
                    data = i_tbl_r_question
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
        public JsonResult deletePilihanGanda(string question_id)
        {

            try
            {
                TBL_R_QUESTION_ALL itbl_question = db_.TBL_R_QUESTION_ALLs.Where(p => p.QUESTION_ID.Equals(question_id)).FirstOrDefault();
                db_.TBL_R_QUESTION_ALLs.DeleteOnSubmit(itbl_question);
                db_.SubmitChanges();
                if (!string.IsNullOrEmpty(itbl_question.IMAGE_PATH) && !itbl_question.IMAGE_PATH.Contains("no_image.jpg"))
                {
                    string fullPath = Request.MapPath("~/question_image/" + itbl_question.IMAGE_PATH);
                    if (System.IO.File.Exists(fullPath))
                    {
                        System.IO.File.Delete(fullPath);
                        return Json(new
                        {
                            status = true,
                            remarks = "Data berhasil dihapus beserta gambarnya",
                            type = "success",
                            hearder = "SUKSES"
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            status = true,
                            remarks = "Data berhasil dihapus dari database, namun tidak ditemukan gambar untuk dihapus sistem<br>file sudah dihapus melalui server",
                            type = "question",
                            hearder = "INFORMASI"
                        });
                    }
                }

                return Json(new
                {
                    status = true,
                    remarks = "Data berhasil dihapus tanpa menghapus gambar",
                    type = "success",
                    hearder = "SUKSES"
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    status = false,
                    status_code = 0,
                    remarks = "Data pertanyaan gagal dihapus",
                    error = e.ToString()
                });

            }
        }

        [HttpPost]
        public JsonResult AjaxReadPilgan(string s_modulid, string s_submodulid, string s_type, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            pv_CustLoadSession();
            try
            {
                var vw_setWaktu = db_.VW_ALL_QUESTION_LISTs.Where(f => f.MODULE_ID.Equals(s_modulid.ToString()) && f.MODULE_SUB_ID.Equals(s_submodulid.ToString()) && f.QUESTION_TYPE.Equals(s_type.ToString()));
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

        public JsonResult DropdownModul()
        {
            var i_module = db_.TBL_R_MODULEs;
            var i_cert_type = db_.TBL_R_JENIS_UJIANs;
            var i_manposition = db_.TBL_M_POSITION_APPs.Where(x => x.IS_ACTIVE.Equals(1));

            return this.Json(new
            {
                Data = i_module,
                Data_cert = i_cert_type,
                Data_manposition = i_manposition,
                Total = i_module.Count()
            }, JsonRequestBehavior.AllowGet);
        }



        [HttpGet]
        public JsonResult ReadCoba()
        {
            var i_tbl = db_.VW_ALL_QUESTION_LISTs.Where(s => s.CERT_FOR.Contains("CERT,TRNG") && s.MODULE_ID.Equals("03"));
            return this.Json(new
            {
                Data = i_tbl,
                Total = i_tbl.Count()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult dropdownSubmodul(string modul_ids)
        {
            var i_tbl_egi = db_.TBL_R_MODULE_EGIs.Where(x => x.MODULE_PID.Equals(modul_ids) && x.ISACTIVE.Equals(1));
            var i_tbl = db_.TBL_R_MODULE_SUBs.Where(f => f.MODULE_ID.Equals(modul_ids));
            return this.Json(new
            {
                Data = i_tbl,
                Total = i_tbl.Count(),
                EGI = i_tbl_egi
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult dropdownTypeSoal()
        {
            var i_tbl = db_.TBL_R_TYPE_SOALs.Where(f => f.IS_ACTIVE.Equals(1) && !f.TYPE_CODE.Equals(3));
            return this.Json(new
            {
                Data = i_tbl,
                Total = i_tbl.Count()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AjaxReadModul()
        {
            ClsSoalPilGan iClsSoalPilGan = new ClsSoalPilGan();
            return this.Json(new
            {
                Total = iClsSoalPilGan.GetListDDModul().Count(),
                Data = iClsSoalPilGan.GetListDDModul()
            });
        }

        [HttpPost]
        public ActionResult AjaxReadSubModul(string smodul)
        {
            ClsSoalPilGan iClsSoalPilGan = new ClsSoalPilGan();
            return this.Json(new
            {
                Total = iClsSoalPilGan.GetListDDSUbModul(smodul).Count(),
                Data = iClsSoalPilGan.GetListDDSUbModul(smodul)
            });
        }

        [HttpPost]
        public ActionResult AjaxReadTipe()
        {
            ClsSoalPilGan iClsSoalPilGan = new ClsSoalPilGan();
            return this.Json(new
            {
                Total = iClsSoalPilGan.GetListTipe().Count(),
                Data = iClsSoalPilGan.GetListTipe()
            });
        }

        [HttpPost]
        public ActionResult AjaxReadTipeSoal()
        {
            ClsSoalPilGan iClsSoalPilGan = new ClsSoalPilGan();
            return this.Json(new
            {
                Total = iClsSoalPilGan.GetListTipeSoal().Count(),
                Data = iClsSoalPilGan.GetListTipeSoal()
            });
        }

        [HttpPost]
        public ActionResult AjaxReadPosisi()
        {
            ClsSoalPilGan iClsSoalPilGan = new ClsSoalPilGan();
            return this.Json(new
            {
                Total = iClsSoalPilGan.GetListPosisi().Count(),
                Data = iClsSoalPilGan.GetListPosisi()
            });
        }

        [HttpPost]
        public async Task<JsonResult> Upload(string sSession, string sMODULE_ID, string sMODULE_SUB_ID, string sEGI_GENERAL, string sTIPE, string sSOALTIPE, string sPOSISI)
        {
            this.pv_CustLoadSession();
            DataTable dt = new DataTable();

            var iStrRemark = string.Empty;

            try
            {
                object[,] obj = null;
                int noOfCol = 0;
                int noOfRow = 0;
                HttpFileCollectionBase file = Request.Files;
                if ((file != null) && (file.Count > 0))
                {
                    //string fileName = file.FileName;
                    //string fileContentType = file.ContentType;
                    byte[] fileBytes = new byte[Request.ContentLength];
                    var data = Request.InputStream.Read(fileBytes, 0, Convert.ToInt32(Request.ContentLength));
                    using (var package = new ExcelPackage(Request.InputStream))
                    {
                        var currentSheet = package.Workbook.Worksheets;
                        var workSheet = currentSheet.First();
                        noOfCol = workSheet.Dimension.End.Column;
                        noOfRow = workSheet.Dimension.End.Row;
                        obj = new object[noOfRow, noOfCol];
                        obj = (object[,])workSheet.Cells.Value;
                    }
                }

                string[,] source = ExcelToArray(obj, 110, (noOfRow - 7), noOfCol);

                bool insert = pilgan_.ExcelTodDatabase(source, noOfCol, noOfRow, sMODULE_ID, sMODULE_SUB_ID, sEGI_GENERAL, sTIPE, sSession, sSOALTIPE, sPOSISI);
                iStrRemark = "Upload Success";
                return this.Json(new
                {
                    status = insert,
                    remarks = iStrRemark
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return this.Json(new
                {
                    status = false,
                    remarks = e.ToString() + "Upload Failed !"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AjaxReadEgi(string egi) //DirektoriServer
        {
            ClsSoalPilGan iClsSoalPilgan = new ClsSoalPilGan();
            return this.Json(new
            {
                Total = iClsSoalPilgan.GetListDDEgi(egi).Count(),
                Data = iClsSoalPilgan.GetListDDEgi(egi)
            });
        }
        [HttpPost]
        public ActionResult AJaxReadUpload(string sSession, int take, int skip, IEnumerable<Kendo.DynamicLinq.Sort> sort, Kendo.DynamicLinq.Filter filter)
        {
            try
            {
                var iTbl = db_.TBL_TMP_QUESTION_ALLs.Where(f => f.SESSION == sSession);
                return this.Json(iTbl.ToDataSourceResult(take, skip, sort, filter));
            }
            catch (Exception e)
            {
                return this.Json(e.ToString());
            }
        }

        [HttpPost]
        public ActionResult AJaxSaveUpload(string SESS_ID)
        {
            var iStrDataUploadSucses = string.Empty;

            try
            {
                db_.cusp_insert_QuestionPG(SESS_ID);
                db_.CariJawabanSoal();

                return Json(new
                {
                    status = true,
                    remarks = "Insert Success"
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult AJaxCancelUpload(string SESS_ID)
        {
            var iStrDataUploadSucses = string.Empty;

            try
            {
                db_.cusp_cancel_InputQuestionEssay(SESS_ID);
                return Json(new
                {
                    status = true,
                    remarks = "Insert Batal"
                }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception e)
            {
                return this.Json(new
                {
                    error = e.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        private string[,] ExcelToArray(object[,] obj, int start, int rows, int cols)
        {
            int jumlahrow = obj.Length / cols;
            string[,] result = new string[(jumlahrow), (cols)];
            
            //Debug.WriteLine("ROW : " + (rows + 1));
            //Debug.WriteLine("COL : " + (cols));
            //Debug.WriteLine("Object : " + obj.Length);
            int z = 0;
            int actual = 0;
            int sindex = 0;
            int batas = jumlahrow * 6;

            foreach (object element in obj)
            {
                //Debug.WriteLine(element);

                if (z >= start)
                {
                    if (z == (start + cols))
                    {
                        actual++;
                        start += cols;
                        sindex = 0;
                    }
                    Debug.WriteLine(String.Concat("[", actual, ",", sindex, "]", result[actual, sindex]));
                    if (element == null)
                    {
                        result[actual, sindex] = string.Empty;
                    }
                    else
                    {
                        result[actual, sindex] = element.ToString();
                    }
                    sindex++;
                }

                z++;
            }
            return result;
        }
    }
}